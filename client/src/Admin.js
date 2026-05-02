/**
 * MARO ACADEMY GLOBAL - CITADEL COMMANDER
 * VERSION: 7.0.0 (Enterprise Admin Edition)
 * FEATURES: Student Search, Analytics, Batch Approval, Real-time Logs, Advanced Publishing
 */

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

const API_URL = "https://maro-academy-v2.onrender.com";
const ADMIN_PASSWORD = "MaroAdmin2026";

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
    
    // ⚙️ SETTINGS & FILTERS
    const [paymentRequired, setPaymentRequired] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, approved, pending
    
    // 🎥 VIDEO DATA
    const [videoData, setVideoData] = useState({ title: '', videoId: '', description: '', category: 'Maths' });

    // =============================================
    // 🛠️ DATA FETCHING & SYNC
    // =============================================
    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/students`);
            setStudents(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/settings`);
            setPaymentRequired(res.data.paymentRequired);
        } catch (error) {
            console.error("Settings Error");
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchStudents();
            fetchSettings();
            // ⚡ High-Frequency Refresh (1s)
            const ticker = setInterval(fetchStudents, 1000);
            return () => clearInterval(ticker);
        }
    }, [isAuthenticated]);

    // =============================================
    // 📊 ANALYTICS COMPUTATION (Memoized)
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
            const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                s.email.toLowerCase().includes(searchTerm.toLowerCase());
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

    const toggleApproval = async (id) => {
        try {
            await axios.put(`${API_URL}/api/students/${id}/approve`);
            // Instant local update for UI snappiness
            setStudents(prev => prev.map(s => s._id === id ? { ...s, isPaid: !s.isPaid } : s));
        } catch (e) { alert("Action Failed"); }
    };

    const togglePaymentMode = async () => {
        if (!window.confirm("CRITICAL: This changes access for all students. Proceed?")) return;
        try {
            const res = await axios.put(`${API_URL}/api/settings`, { paymentRequired: !paymentRequired });
            setPaymentRequired(res.data.paymentRequired);
        } catch (e) { alert("System Update Failed"); }
    };

    const handleVideoUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            await axios.post(`${API_URL}/api/videos/upload`, videoData);
            alert("🚀 INTEL PUBLISHED TO VAULT!");
            setVideoData({ title: '', videoId: '', description: '', category: 'Maths' });
        } catch (e) { alert("Upload Failed"); }
        finally { setUploading(false); }
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
        <div style={styles.dashboardContainer}>
            {/* 🛰️ TOP NAV BAR */}
            <header style={styles.topNav}>
                <div>
                    <h1 style={styles.navLogo}>CITADEL <span style={{color:'#ffd700'}}>ADMIN</span></h1>
                    <p style={styles.navSub}>Maro Academy Operations Center v7.0</p>
                </div>
                <div style={styles.navActions}>
                    <div style={styles.liveIndicator}>
                        <div style={styles.pulseDot} /> LIVE SYNC ACTIVE
                    </div>
                    <button onClick={() => setIsAuthenticated(false)} style={styles.lockBtn}>LOCK CONSOLE</button>
                </div>
            </header>

            {/* 📊 ANALYTICS TILES */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <span style={styles.statLabel}>TOTAL ACADEMICS</span>
                    <span style={styles.statValue}>{stats.total}</span>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #28a745'}}>
                    <span style={styles.statLabel}>APPROVED</span>
                    <span style={styles.statValue}>{stats.approved}</span>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #ff4d4d'}}>
                    <span style={styles.statLabel}>PENDING ACCESS</span>
                    <span style={styles.statValue}>{stats.pending}</span>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #ffd700'}}>
                    <span style={styles.statLabel}>ACTIVE SESSIONS</span>
                    <span style={styles.statValue}>{stats.loggedIn}</span>
                </div>
            </div>

            {/* 🎛️ CONTROL PANEL & STUDENT TABLE */}
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
                            />
                            <select style={styles.selectInput} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="all">All Records</option>
                                <option value="approved">Approved Only</option>
                                <option value="pending">Pending Only</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeadRow}>
                                    <th>FULL NAME</th>
                                    <th>EMAIL ADDRESS</th>
                                    <th>STATUS</th>
                                    <th>FIRST LOGIN</th>
                                    <th>EXPIRY DATE</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(s => (
                                    <tr key={s._id} style={styles.tableRow}>
                                        <td style={styles.tdName}>{s.name}</td>
                                        <td>{s.email}</td>
                                        <td>
                                            <span style={{
                                                ...styles.badge, 
                                                background: s.isPaid ? '#eaffea' : '#ffeaea',
                                                color: s.isPaid ? '#28a745' : '#ff4d4d'
                                            }}>
                                                {s.isPaid ? 'APPROVED' : 'PENDING'}
                                            </span>
                                        </td>
                                        <td style={styles.tdDate}>{s.firstLoginDate ? new Date(s.firstLoginDate).toLocaleDateString() : 'N/A'}</td>
                                        <td style={styles.tdDate}>{s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <button 
                                                onClick={() => toggleApproval(s._id)}
                                                style={{...styles.actionBtn, background: s.isPaid ? '#ff4d4d' : '#28a745'}}
                                            >
                                                {s.isPaid ? 'Revoke' : 'Approve'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 🛡️ SIDEBAR CONTROLS */}
                <aside style={styles.sidebar}>
                    <div style={styles.configCard}>
                        <h3 style={styles.cardTitle}>SYSTEM CONFIG</h3>
                        <p style={styles.cardInfo}>Toggle worldwide payment requirement.</p>
                        <button 
                            onClick={togglePaymentMode} 
                            style={{...styles.toggleBtn, background: paymentRequired ? '#28a745' : '#ff4d4d'}}
                        >
                            {paymentRequired ? 'ACTIVATE FREE MODE' : 'RESTRICT ACCESS (PAID)'}
                        </button>
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
                                type="text" placeholder="YouTube ID" required
                                value={videoData.videoId} style={styles.sideInput}
                                onChange={(e) => setVideoData({...videoData, videoId: e.target.value})}
                            />
                            <textarea 
                                placeholder="Brief lesson description..."
                                value={videoData.description} style={styles.sideArea}
                                onChange={(e) => setVideoData({...videoData, description: e.target.value})}
                            />
                            <button type="submit" disabled={uploading} style={styles.publishBtn}>
                                {uploading ? 'UPLOADING...' : 'PUSH TO VAULT'}
                            </button>
                        </form>
                    </div>
                </aside>
            </div>
        </div>
    );
};

// =============================================
// 🎨 THE CITADEL DESIGN SYSTEM
// =============================================
const styles = {
    authContainer: { height: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    authCard: { background: '#0a0a0a', padding: '60px', borderRadius: '30px', border: '1px solid #111', textAlign: 'center', width: '100%', maxWidth: '450px' },
    authTitle: { color: '#ffd700', fontSize: '1.8rem', letterSpacing: '5px', margin: '10px 0' },
    authSubtitle: { color: '#444', fontSize: '0.85rem', marginBottom: '30px' },
    authInput: { width: '100%', padding: '15px', background: '#000', border: '1px solid #222', color: '#ffd700', textAlign: 'center', fontSize: '1.5rem', borderRadius: '12px', letterSpacing: '8px' },
    authBtn: { width: '100%', padding: '15px', marginTop: '20px', background: '#ffd700', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' },
    
    dashboardContainer: { minHeight: '100vh', background: '#f4f7f6', paddingBottom: '50px', fontFamily: 'Inter, system-ui' },
    topNav: { background: '#000', color: '#fff', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    navLogo: { margin: 0, fontSize: '1.4rem', letterSpacing: '2px' },
    navSub: { margin: 0, fontSize: '0.7rem', color: '#444' },
    liveIndicator: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#28a745', fontWeight: 'bold' },
    pulseDot: { width: '8px', height: '8px', background: '#28a745', borderRadius: '50%' },
    lockBtn: { background: '#ff4d4d', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },

    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '30px 40px' },
    statCard: { background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' },
    statLabel: { fontSize: '0.7rem', color: '#888', fontWeight: 'bold', letterSpacing: '1px' },
    statValue: { fontSize: '2rem', fontWeight: '900', color: '#111' },

    mainGrid: { display: 'flex', gap: '30px', padding: '0 40px' },
    tableSection: { flex: 3, background: '#fff', borderRadius: '16px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    filterBar: { display: 'flex', gap: '10px' },
    searchInput: { padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', width: '250px' },
    selectInput: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd' },

    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeadRow: { textAlign: 'left', borderBottom: '2px solid #f0f0f0', color: '#888', fontSize: '0.75rem' },
    tableRow: { borderBottom: '1px solid #f9f9f9', transition: '0.2s' },
    tdName: { fontWeight: 'bold', color: '#111' },
    tdDate: { color: '#888', fontSize: '0.8rem' },
    badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' },
    actionBtn: { border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },

    sidebar: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },
    configCard: { background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    cardTitle: { fontSize: '0.9rem', margin: '0 0 10px' },
    cardInfo: { fontSize: '0.75rem', color: '#888', marginBottom: '20px' },
    toggleBtn: { width: '100%', padding: '12px', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
    
    publishCard: { background: '#000', color: '#fff', padding: '25px', borderRadius: '16px' },
    publishForm: { display: 'flex', flexDirection: 'column', gap: '12px' },
    sideInput: { background: '#111', border: '1px solid #222', color: '#fff', padding: '12px', borderRadius: '8px' },
    sideArea: { background: '#111', border: '1px solid #222', color: '#fff', padding: '12px', borderRadius: '8px', minHeight: '80px' },
    publishBtn: { background: '#ffd700', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Admin;