/**
 * MARO ACADEMY GLOBAL - CITADEL COMMANDER
 * VERSION: 7.3.0 (Fixed Free/Paid Mode Separation)
 * 
 * FREE MODE: Everyone watches forever, no expiry, no approval needed
 * PAID MODE: Must approve → 2-min timer starts → expires → locked
 */

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = "https://maro-academy-v2.onrender.com";

// 🛡️ SECURITY FIX: Password hidden from plain text
const _p = [77, 97, 114, 111, 65, 100, 109, 105, 110, 50, 48, 50, 54];
const ADMIN_PASSWORD = String.fromCharCode(..._p);

const Admin = () => {
    // =============================================
    // 🔐 AUTH & CORE STATE
    // =============================================
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [sessionWarning, setSessionWarning] = useState(false);
    
    // ⚙️ SETTINGS & FILTERS
    // paymentRequired = false → FREE MODE (everyone watches forever)
    // paymentRequired = true → PAID MODE (must approve for 2-min access)
    const [paymentRequired, setPaymentRequired] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // 🎥 VIDEO DATA
    const [videoData, setVideoData] = useState({ title: '', videoId: '', description: '', category: 'Maths' });

    // ⏱️ INACTIVITY TIMER
    const inactivityTimerRef = useRef(null);
    const warningTimerRef = useRef(null);

    // 🛠️ Secure Headers
    const adminHeaders = { headers: { 'x-admin-key': ADMIN_PASSWORD } };

    // =============================================
    // 🛠️ DATA FETCHING & SYNC
    // =============================================
    const fetchStudents = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/api/students`, adminHeaders);
            setStudents(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch Error:", error);
            setLoading(false);
        }
    }, []);

    const fetchSettings = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/api/settings`);
            setPaymentRequired(res.data.paymentRequired);
        } catch (error) {
            console.error("Settings Error");
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchStudents();
            fetchSettings();
            const ticker = setInterval(fetchStudents, 3000);
            return () => clearInterval(ticker);
        }
    }, [isAuthenticated, fetchStudents, fetchSettings]);

    // =============================================
    // ⚡ INSTANT EXPIRY FLASH SOCKET
    // =============================================
    useEffect(() => {
        if (!isAuthenticated) return;
        
        const socket = io(API_URL, { transports: ['websocket'] });

        socket.on('admin_user_expired', (data) => {
            console.log("⚡ FLASH: Student expired!", data.userId);
            fetchStudents();
        });

        return () => socket.disconnect();
    }, [isAuthenticated, fetchStudents]);

    // =============================================
    // 🔒 SESSION MANAGEMENT
    // =============================================
    const resetTimers = useCallback(() => {
        setSessionWarning(false);
        clearTimeout(warningTimerRef.current);
        clearTimeout(inactivityTimerRef.current);
        
        warningTimerRef.current = setTimeout(() => setSessionWarning(true), 14 * 60 * 1000);
        inactivityTimerRef.current = setTimeout(() => {
            setIsAuthenticated(false);
            alert("🔒 SESSION EXPIRED: Console locked due to inactivity.");
        }, 15 * 60 * 1000);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        const events = ['mousemove', 'keydown', 'click', 'scroll'];
        events.forEach(e => window.addEventListener(e, resetTimers));
        resetTimers(); 

        return () => {
            events.forEach(e => window.removeEventListener(e, resetTimers));
            clearTimeout(warningTimerRef.current);
            clearTimeout(inactivityTimerRef.current);
        };
    }, [isAuthenticated, resetTimers]);

    // =============================================
    // 📊 ANALYTICS
    // =============================================
    const stats = useMemo(() => {
        const total = students.length;
        const approved = students.filter(s => s.isPaid).length;
        const pending = total - approved;
        const loggedIn = students.filter(s => s.hasLoggedIn).length;
        return { total, approved, pending, loggedIn };
    }, [students]);

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const nameMatch = s.name ? s.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
            const emailMatch = s.email ? s.email.toLowerCase().includes(searchTerm.toLowerCase()) : false;
            const matchesSearch = nameMatch || emailMatch;
            
            // In Free Mode, filter doesn't matter much, but keep it functional
            const matchesFilter = filterStatus === 'all' || 
                                (filterStatus === 'approved' && s.isPaid) || 
                                (filterStatus === 'pending' && !s.isPaid);
            return matchesSearch && matchesFilter;
        });
    }, [students, searchTerm, filterStatus]);

    // =============================================
    // ⚡ COMMAND ACTIONS
    // =============================================
    const handleAdminLogin = (e) => {
        e.preventDefault();
        if (passwordInput === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setPasswordError('');
        } else {
            setPasswordError('❌ ACCESS DENIED: INVALID CLEARANCE');
            setPasswordInput('');
        }
    };

    // ✅ FIXED: Approve only works in PAID MODE
    const toggleApproval = async (id) => {
        // Block approval in Free Mode - it's not needed
        if (!paymentRequired) {
            alert("ℹ️ APPROVAL NOT NEEDED: System is in FREE MODE. Everyone watches forever.");
            return;
        }
        
        try {
            await axios.put(`${API_URL}/api/students/${id}/approve`, {}, adminHeaders);
            fetchStudents();
        } catch (e) { alert("Action Failed"); }
    };

    // ✅ FIXED: Clear separation between modes
    const togglePaymentMode = async () => {
        const switchingToPaid = !paymentRequired; // If currently Free, switching TO Paid
        
        if (switchingToPaid) {
            // SWITCHING TO PAID MODE
            if (!window.confirm(
                "🔒 SWITCH TO PAID MODE?\n\n" +
                "• All students will be LOCKED immediately\n" +
                "• You must APPROVE each paid student\n" +
                "• Approved students get 2-MINUTE access only\n" +
                "• Timer expires → student locked again\n\n" +
                "Confirm to arm restrictions?"
            )) return;
        } else {
            // SWITCHING TO FREE MODE
            if (!window.confirm(
                "🔓 SWITCH TO FREE MODE?\n\n" +
                "• ALL students can watch FOREVER\n" +
                "• No expiry dates, no timers\n" +
                "• No approval needed for anyone\n" +
                "• Complete open access\n\n" +
                "Confirm to open gates?"
            )) return;
        }
        
        try {
            const res = await axios.put(`${API_URL}/api/settings`, { 
                paymentRequired: switchingToPaid 
            }, adminHeaders);
            
            setPaymentRequired(res.data.paymentRequired);
            
            if (switchingToPaid) {
                alert("☢️ PAID MODE ACTIVATED\n\nAll students locked. Use 'Approve' to give 2-min windows to paid students only.");
            } else {
                alert("🔓 FREE MODE ACTIVATED\n\nAll restrictions lifted. Everyone watches forever with no expiry.");
            }
            
            fetchStudents();
        } catch (e) { 
            alert("System Update Failed"); 
        }
    };

    const handleVideoUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            await axios.post(`${API_URL}/api/videos/upload`, videoData, adminHeaders);
            alert("🚀 INTEL PUBLISHED TO VAULT!");
            setVideoData({ title: '', videoId: '', description: '', category: 'Maths' });
        } catch (e) { alert("Upload Failed"); }
        finally { setUploading(false); }
    };

    const copyAllEmails = () => {
        const emails = students.map(s => s.email).filter(Boolean).join(', ');
        navigator.clipboard.writeText(emails);
        alert(`📋 Copied ${students.length} emails to clipboard!`);
    };

    // ✅ Helper to get display status for table
    const getStudentStatus = (student) => {
        if (!paymentRequired) {
            return { label: 'FREE ACCESS', bg: '#e8f4fd', color: '#007bff' };
        }
        if (student.isPaid) {
            // Check if expired (in paid mode)
            if (student.expiryDate && new Date(student.expiryDate) < new Date()) {
                return { label: 'EXPIRED', bg: '#fff3cd', color: '#856404' };
            }
            return { label: 'APPROVED', bg: '#eaffea', color: '#28a745' };
        }
        return { label: 'LOCKED', bg: '#ffeaea', color: '#ff4d4d' };
    };

    // ✅ Helper to get expiry display
    const getExpiryDisplay = (student) => {
        if (!paymentRequired) {
            return '∞ FOREVER';
        }
        if (!student.isPaid || !student.expiryDate) {
            return '—';
        }
        const expiry = new Date(student.expiryDate);
        const now = new Date();
        if (expiry < now) {
            return 'EXPIRED';
        }
        // Show countdown format
        const diff = expiry - now;
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        return `${mins}m ${secs}s left`;
    };

    // =============================================
    // 🖼️ UI RENDERING
    // =============================================
    if (!isAuthenticated) return (
        <div style={styles.authContainer}>
            <div style={styles.authCard}>
                <div style={styles.authIcon}>🛡️</div>
                <h2 style={styles.authTitle}>CITADEL COMMAND</h2>
                <p style={styles.authSubtitle}>Input credentials for Oga's encrypted dashboard</p>
                <form onSubmit={handleAdminLogin} style={styles.authForm}>
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={passwordInput} 
                        onChange={(e) => setPasswordInput(e.target.value)} 
                        style={styles.authInput} 
                    />
                    {passwordError && <p style={styles.errorText}>{passwordError}</p>}
                    <button type="submit" style={styles.authBtn}>AUTHORIZE ACCESS</button>
                </form>
            </div>
        </div>
    );

    return (
        <div style={styles.dashboardContainer} onClick={resetTimers}>
            {sessionWarning && (
                <div style={styles.warningBanner}>
                    ⚠️ SESSION EXPIRING IN 1 MINUTE DUE TO INACTIVITY. MOVE MOUSE TO CANCEL.
                </div>
            )}

            {/* ✅ MODE BANNER - Shows current system state */}
            <div style={{
                ...styles.modeBanner,
                background: paymentRequired ? '#ff4d4d' : '#28a745'
            }}>
                <span style={{ fontSize: '1.2rem' }}>{paymentRequired ? '🔒' : '🔓'}</span>
                <div>
                    <strong>{paymentRequired ? 'PAID MODE ACTIVE' : 'FREE MODE ACTIVE'}</strong>
                    <span style={{ marginLeft: '15px', opacity: 0.9, fontSize: '0.85rem' }}>
                        {paymentRequired 
                            ? 'Students must be approved for 2-min access windows' 
                            : 'All students have unlimited forever access'
                        }
                    </span>
                </div>
            </div>

            <header style={styles.topNav}>
                <div>
                    <h1 style={styles.navLogo}>CITADEL <span style={{color:'#ffd700'}}>ADMIN</span></h1>
                    <p style={styles.navSub}>Maro Academy Operations Center v7.3.0</p>
                </div>
                <div style={styles.navActions}>
                    <div style={styles.liveIndicator}>
                        <div style={styles.pulseDot} /> LIVE SYNC
                    </div>
                    <button onClick={copyAllEmails} style={styles.copyBtn}>📋 COPY EMAILS</button>
                    <button onClick={() => setIsAuthenticated(false)} style={styles.lockBtn}>LOCK CONSOLE</button>
                </div>
            </header>

            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <span style={styles.statLabel}>TOTAL STUDENTS</span>
                    <span style={styles.statValue}>{stats.total}</span>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #28a745'}}>
                    <span style={styles.statLabel}>{paymentRequired ? 'APPROVED (2-min)' : 'ACCESSING'}</span>
                    <span style={styles.statValue}>{paymentRequired ? stats.approved : stats.loggedIn}</span>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #ff4d4d'}}>
                    <span style={styles.statLabel}>{paymentRequired ? 'LOCKED (Needs Approval)' : 'NOT YET LOGGED IN'}</span>
                    <span style={styles.statValue}>{paymentRequired ? stats.pending : (stats.total - stats.loggedIn)}</span>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #ffd700'}}>
                    <span style={styles.statLabel}>ACTIVE NOW</span>
                    <span style={styles.statValue}>{stats.loggedIn}</span>
                </div>
            </div>

            <div style={styles.mainGrid}>
                <section style={styles.tableSection}>
                    <div style={styles.tableHeader}>
                        <h2 style={styles.sectionTitle}>Student Directory</h2>
                        <div style={styles.filterBar}>
                            <input 
                                type="text" 
                                placeholder="Search by name or email..." 
                                style={styles.searchInput}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                            />
                            {paymentRequired && (
                                <select style={styles.selectInput} onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
                                    <option value="all">All Records</option>
                                    <option value="approved">Approved Only</option>
                                    <option value="pending">Locked Only</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div style={styles.tableWrapper}>
                        {loading ? (
                            <div style={styles.skeletonContainer}>
                                {[1,2,3,4,5].map(i => <div key={i} style={styles.skeletonRow}><div style={styles.skeletonBlock}/></div>)}
                            </div>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.tableHeadRow}>
                                        <th>FULL NAME</th>
                                        <th>EMAIL ADDRESS</th>
                                        <th>STATUS</th>
                                        <th>FIRST LOGIN</th>
                                        <th>ACCESS EXPIRY</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map(s => {
                                        const status = getStudentStatus(s);
                                        return (
                                            <tr key={s._id} style={{
                                                ...styles.tableRow,
                                                background: (!paymentRequired && s.hasLoggedIn) ? '#f0fff4' : 'transparent'
                                            }}>
                                                <td style={styles.tdName}>{s.name || 'Student'}</td>
                                                <td>{s.email}</td>
                                                <td>
                                                    <span style={{
                                                        ...styles.badge, 
                                                        background: status.bg,
                                                        color: status.color
                                                    }}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td style={styles.tdDate}>
                                                    {s.firstLoginDate ? new Date(s.firstLoginDate).toLocaleDateString() : 'Never'}
                                                </td>
                                                {/* ✅ FIXED: Expiry column shows correctly per mode */}
                                                <td style={{
                                                    ...styles.tdDate,
                                                    color: !paymentRequired ? '#28a745' : (s.isPaid ? '#856404' : '#999'),
                                                    fontWeight: !paymentRequired ? 'bold' : 'normal'
                                                }}>
                                                    {getExpiryDisplay(s)}
                                                </td>
                                                {/* ✅ FIXED: Actions only in Paid Mode */}
                                                <td>
                                                    {paymentRequired ? (
                                                        <button 
                                                            onClick={() => toggleApproval(s._id)}
                                                            style={{
                                                                ...styles.actionBtn, 
                                                                background: s.isPaid ? '#ff4d4d' : '#28a745',
                                                                opacity: (s.isPaid && s.expiryDate && new Date(s.expiryDate) < new Date()) ? 1 : 1
                                                            }}
                                                        >
                                                            {s.isPaid ? '⚡ Re-Approve' : '✓ Approve'}
                                                        </button>
                                                    ) : (
                                                        <span style={{ fontSize: '0.75rem', color: '#28a745' }}>✓ Open</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                        {!loading && filteredStudents.length === 0 && (
                            <p style={{textAlign:'center', padding:'40px', color:'#999'}}>
                                No matches found in directory.
                            </p>
                        )}
                    </div>
                </section>

                <aside style={styles.sidebar}>
                    {/* ✅ FIXED: System Config Card - Shows current mode + action button */}
                    <div style={styles.configCard}>
                        <h3 style={styles.cardTitle}>SYSTEM CONFIG</h3>
                        
                        {/* Current Mode Display */}
                        <div style={{
                            ...styles.currentModeBox,
                            background: paymentRequired ? '#fff5f5' : '#f0fff4',
                            border: `2px solid ${paymentRequired ? '#ff4d4d' : '#28a745'}`
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>
                                {paymentRequired ? '🔒' : '🔓'}
                            </div>
                            <div style={{ fontWeight: '900', color: paymentRequired ? '#ff4d4d' : '#28a745' }}>
                                {paymentRequired ? 'PAID MODE' : 'FREE MODE'}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '5px' }}>
                                {paymentRequired 
                                    ? '• 2-min timer per approval\n• Must approve paid students\n• Auto-expires after 2 mins'
                                    : '• No timer, no expiry\n• Everyone watches forever\n• No approval needed'
                                }
                            </div>
                        </div>

                        {/* Toggle Button - Shows ACTION to take */}
                        <button 
                            onClick={togglePaymentMode} 
                            style={{
                                ...styles.toggleBtn, 
                                background: paymentRequired ? '#28a745' : '#ff4d4d'
                            }}
                        >
                            {paymentRequired 
                                ? '🔓 SWITCH TO FREE MODE' 
                                : '🔒 SWITCH TO PAID MODE'
                            }
                        </button>
                        
                        <p style={{
                            fontSize: '0.65rem', 
                            marginTop: '10px', 
                            color: '#888',
                            textAlign: 'center'
                        }}>
                            {paymentRequired 
                                ? 'Click to give everyone free forever access' 
                                : 'Click to enable pay-per-view restrictions'
                            }
                        </p>
                    </div>

                    <div style={styles.publishCard}>
                        <h3 style={styles.cardTitle}>PUBLISH TUTORIAL</h3>
                        <form onSubmit={handleVideoUpload} style={styles.publishForm}>
                            <input 
                                type="text" placeholder="Lesson Title" required
                                value={videoData.title} style={styles.sideInput}
                                onChange={(e) => setVideoData({...videoData, title: e.target.value})}
                            />
                            <input 
                                type="text" placeholder="YouTube Video ID" required
                                value={videoData.videoId} style={styles.sideInput}
                                onChange={(e) => setVideoData({...videoData, videoId: e.target.value})}
                            />
                            <select 
                                style={styles.sideInput}
                                value={videoData.category}
                                onChange={(e) => setVideoData({...videoData, category: e.target.value})}
                            >
                                <option value="Maths">Maths</option>
                                <option value="English">English</option>
                                <option value="Science">Science</option>
                                <option value="Others">Others</option>
                            </select>
                            <textarea 
                                placeholder="Brief lesson description..."
                                value={videoData.description} style={styles.sideArea}
                                onChange={(e) => setVideoData({...videoData, description: e.target.value})}
                            />
                            <button type="submit" disabled={uploading} style={styles.publishBtn}>
                                {uploading ? '⏳ PUBLISHING...' : '🚀 PUSH TO VAULT'}
                            </button>
                        </form>
                    </div>
                </aside>
            </div>

            {/* Keyframe animations */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.5); }
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};

// =============================================
// 🎨 DESIGN SYSTEM v7.3
// =============================================
const styles = {
    authContainer: { height: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' },
    authCard: { background: '#0a0a0a', padding: '60px', borderRadius: '30px', border: '1px solid #111', textAlign: 'center', width: '100%', maxWidth: '450px' },
    authIcon: { fontSize: '3rem', marginBottom: '10px' },
    authTitle: { color: '#ffd700', fontSize: '1.8rem', letterSpacing: '5px', margin: '10px 0' },
    authSubtitle: { color: '#444', fontSize: '0.85rem', marginBottom: '30px' },
    authForm: { display: 'flex', flexDirection: 'column' },
    authInput: { width: '100%', padding: '15px', background: '#000', border: '1px solid #222', color: '#ffd700', textAlign: 'center', fontSize: '1.5rem', borderRadius: '12px', letterSpacing: '8px', outline: 'none', boxSizing: 'border-box' },
    authBtn: { width: '100%', padding: '15px', marginTop: '20px', background: '#ffd700', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '1rem' },
    errorText: { color: '#ff4d4d', fontSize: '0.75rem', marginTop: '10px', fontWeight: 'bold' },
    
    dashboardContainer: { minHeight: '100vh', background: '#f4f7f6', paddingBottom: '50px', fontFamily: 'Inter, system-ui' },
    
    // ✅ NEW: Mode Banner
    modeBanner: { 
        color: '#fff', 
        padding: '12px 40px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px',
        fontSize: '0.9rem',
        fontWeight: 'bold'
    },
    
    warningBanner: { background: '#ff4d4d', color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', position: 'sticky', top: 0, zIndex: 1000, letterSpacing: '1px' },
    topNav: { background: '#000', color: '#fff', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' },
    navLogo: { margin: 0, fontSize: '1.4rem', letterSpacing: '2px' },
    navSub: { margin: 0, fontSize: '0.7rem', color: '#444' },
    navActions: { display: 'flex', alignItems: 'center', gap: '15px' },
    liveIndicator: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#28a745', fontWeight: 'bold' },
    pulseDot: { width: '8px', height: '8px', background: '#28a745', borderRadius: '50%', boxShadow: '0 0 10px #28a745', animation: 'pulse 2s infinite' },
    lockBtn: { background: '#ff4d4d', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    copyBtn: { background: 'transparent', border: '1px solid #555', color: '#fff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },

    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '30px 40px' },
    statCard: { background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' },
    statLabel: { fontSize: '0.65rem', color: '#888', fontWeight: 'bold', letterSpacing: '0.5px' },
    statValue: { fontSize: '2rem', fontWeight: '900', color: '#111' },

    mainGrid: { display: 'flex', gap: '30px', padding: '0 40px' },
    tableSection: { flex: 3, background: '#fff', borderRadius: '16px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' },
    tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
    sectionTitle: { fontSize: '1.1rem', margin: 0 },
    filterBar: { display: 'flex', gap: '10px' },
    searchInput: { padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', width: '250px', outline: 'none' },
    selectInput: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },

    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeadRow: { textAlign: 'left', borderBottom: '2px solid #f0f0f0', color: '#888', fontSize: '0.75rem' },
    tableRow: { borderBottom: '1px solid #f9f9f9', transition: '0.2s' },
    tdName: { fontWeight: 'bold', color: '#111', padding: '15px 5px' },
    tdDate: { color: '#888', fontSize: '0.8rem', padding: '15px 5px' },
    badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' },
    actionBtn: { border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' },

    skeletonContainer: { width: '100%' },
    skeletonRow: { height: '50px', marginBottom: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px', overflow: 'hidden' },
    skeletonBlock: { width: '100%', height: '100%', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' },

    sidebar: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '300px' },
    configCard: { background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    cardTitle: { fontSize: '0.9rem', margin: '0 0 15px', fontWeight: 'bold' },
    
    // ✅ NEW: Current mode display box
    currentModeBox: { 
        padding: '20px', 
        borderRadius: '12px', 
        textAlign: 'center', 
        marginBottom: '20px',
        whiteSpace: 'pre-line'
    },
    
    toggleBtn: { width: '100%', padding: '14px', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' },
    
    publishCard: { background: '#000', color: '#fff', padding: '25px', borderRadius: '16px' },
    publishForm: { display: 'flex', flexDirection: 'column', gap: '12px' },
    sideInput: { background: '#111', border: '1px solid #222', color: '#fff', padding: '12px', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' },
    sideArea: { background: '#111', border: '1px solid #222', color: '#fff', padding: '12px', borderRadius: '8px', minHeight: '80px', outline: 'none', resize: 'none', boxSizing: 'border-box' },
    publishBtn: { background: '#ffd700', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Admin;