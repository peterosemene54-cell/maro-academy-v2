import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = "https://maro-academy-v2.onrender.com";
const ADMIN_PASSWORD = "MaroAdmin2026";

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [videoData, setVideoData] = useState({ title: '', videoId: '', description: '' });
    const [uploading, setUploading] = useState(false);
    const [paymentRequired, setPaymentRequired] = useState(false);

    const handleAdminLogin = (e) => {
        e.preventDefault();
        if (passwordInput === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setPasswordError('');
        } else {
            setPasswordError('❌ Wrong password! Try again.');
            setPasswordInput('');
        }
    };

    const handleAdminLogout = () => {
        setIsAuthenticated(false);
        setPasswordInput('');
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/students`);
            setStudents(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching students", error);
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/settings`);
            setPaymentRequired(res.data.paymentRequired);
        } catch (error) {
            console.error("Error fetching settings", error);
        }
    };

    // 🔥 REAL TIME — fetches every 3 seconds!
        // 🔥 SUPER REAL TIME — fetches every 1 second!
    useEffect(() => {
        if (isAuthenticated) {
            fetchStudents();
            fetchSettings();
            const realTimeRefresh = setInterval(() => {
                fetchStudents();
            }, 1000); // <--- Changed from 3000 to 1000 for instant updates!
            return () => clearInterval(realTimeRefresh);
        }
    }, [isAuthenticated]);


    const toggleApproval = async (id) => {
        try {
            await axios.put(`${API_URL}/api/students/${id}/approve`);
            fetchStudents();
        } catch (error) {
            alert("Error updating status");
        }
    };

    const togglePaymentMode = async () => {
        try {
            const res = await axios.put(`${API_URL}/api/settings`, {
                paymentRequired: !paymentRequired
            });
            setPaymentRequired(res.data.paymentRequired);
            fetchStudents();
            alert(`Payment mode is now ${res.data.paymentRequired
                ? 'ON 🔴 - Students must pay!'
                : 'OFF 🟢 - Everyone watches free!'
            }`);
        } catch (error) {
            alert("Error updating payment mode");
        }
    };

    const handleVideoUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            await axios.post(`${API_URL}/api/videos/upload`, videoData);
            alert("Tutorial Published Successfully! 🚀🎬");
            setVideoData({ title: '', videoId: '', description: '' });
        } catch (error) {
            alert("Error publishing video. Check your server connection.");
        } finally {
            setUploading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ background: '#111', padding: '50px 40px', borderRadius: '20px', border: '1px solid #222', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🔐</div>
                    <h2 style={{ color: '#ffd700', marginBottom: '5px' }}>OGA'S SECRET VAULT</h2>
                    <p style={{ color: '#555', marginBottom: '30px', fontSize: '0.9rem' }}>Authorised Personnel Only!</p>
                    <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            type="password"
                            placeholder="Enter Admin Password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            required
                            style={{ padding: '14px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: '#fff', fontSize: '1rem', textAlign: 'center', letterSpacing: '4px' }}
                        />
                        {passwordError && <p style={{ color: '#ff4d4d', fontSize: '0.9rem', margin: 0 }}>{passwordError}</p>}
                        <button type="submit" style={{ padding: '14px', background: '#ffd700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                            ENTER THE VAULT 🏛️
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading) return <h2 style={{ textAlign: 'center' }}>Opening the Vault... 🦾</h2>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#333', margin: 0 }}>Oga's Admin Dashboard 💰</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ color: 'green', fontSize: '0.85rem', background: '#eaffea', padding: '6px 12px', borderRadius: '20px', border: '1px solid #28a745' }}>
                        🟢 Live Updates
                    </span>
                    <button onClick={handleAdminLogout} style={{ background: '#ff4d4d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        🔒 Lock Vault
                    </button>
                </div>
            </div>

            {/* STUDENT TABLE */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h3>Registered Students ({students.length})</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#333', color: 'white' }}>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                {paymentRequired && <th>First Login</th>}
                                {paymentRequired && <th>Expiry Date</th>}
                                {paymentRequired && <th>Action</th>}
                                {!paymentRequired && <th>Access</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => (
                                <tr key={s._id} style={{ background: paymentRequired ? (s.isPaid ? '#eaffea' : '#fff') : '#eaffea' }}>
                                    <td>{s.name}</td>
                                    <td>{s.email}</td>
                                    <td style={{ fontWeight: 'bold', color: paymentRequired ? (s.isPaid ? 'green' : 'red') : 'green' }}>
                                        {paymentRequired ? (s.isPaid ? "APPROVED ✅" : "PENDING ⏳") : "FREE ACCESS 🟢"}
                                    </td>

                                    {/* 🆕 FIRST LOGIN COLUMN */}
                                    {paymentRequired && (
                                        <td style={{ color: '#666', fontSize: '0.85rem' }}>
                                            {s.hasLoggedIn && s.firstLoginDate
                                                ? new Date(s.firstLoginDate).toLocaleString('en-NG', {
                                                    day: 'numeric', month: 'short',
                                                    year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })
                                                : <span style={{ color: '#ff9800', fontWeight: 'bold' }}>⏳ Not logged in yet</span>
                                            }
                                        </td>
                                    )}

                                    {/* EXPIRY DATE */}
                                    {paymentRequired && (
                                        <td style={{ color: '#666', fontSize: '0.85rem' }}>
                                            {s.expiryDate
                                                ? new Date(s.expiryDate).toLocaleString('en-NG', {
                                                    day: 'numeric', month: 'short',
                                                    year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })
                                                : <span style={{ color: '#999' }}>⏳ Starts on first login</span>
                                            }
                                        </td>
                                    )}

                                    {/* APPROVE/DISAPPROVE */}
                                    {paymentRequired && (
                                        <td>
                                            <button
                                                onClick={() => toggleApproval(s._id)}
                                                style={{ padding: '8px 12px', cursor: 'pointer', background: s.isPaid ? '#ff4d4d' : '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                                                {s.isPaid ? "Disapprove" : "Approve Student"}
                                            </button>
                                        </td>
                                    )}

                                    {/* FREE MODE */}
                                    {!paymentRequired && (
                                        <td style={{ color: 'green', fontWeight: 'bold' }}>🟢 Watching Free</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAYMENT MODE TOGGLE */}
            <div style={{ marginTop: '30px', padding: '30px', border: `2px solid ${paymentRequired ? '#ff4d4d' : '#28a745'}`, borderRadius: '15px', background: '#f9f9f9' }}>
                <h2 style={{ color: '#333', margin: '0 0 10px 0' }}>💰 Payment Mode Control</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    Current Status: <b style={{ color: paymentRequired ? 'red' : 'green' }}>
                        {paymentRequired ? '🔴 PAYMENT REQUIRED' : '🟢 FREE ACCESS — Everyone watches for free'}
                    </b>
                </p>
                <button onClick={togglePaymentMode} style={{ background: paymentRequired ? '#28a745' : '#ff4d4d', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                    {paymentRequired ? '🟢 SWITCH TO FREE MODE' : '🔴 SWITCH TO PAYMENT MODE'}
                </button>
            </div>

            {/* PUBLISH MENU */}
            <div style={{ marginTop: '50px', padding: '30px', border: '2px solid #333', borderRadius: '15px', background: '#f9f9f9' }}>
                <h2 style={{ color: '#333', margin: '0 0 10px 0' }}>📤 Publish Math Tutorial</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>This sends the video straight to the Student Video Vault.</p>
                <form onSubmit={handleVideoUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px' }}>
                    <input type="text" placeholder="Video Title (e.g. Simultaneous Equations Part 1)" value={videoData.title} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} onChange={(e) => setVideoData({ ...videoData, title: e.target.value })} required />
                    <input type="text" placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" value={videoData.videoId} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} onChange={(e) => setVideoData({ ...videoData, videoId: e.target.value })} required />
                    <textarea placeholder="Describe what they will learn in this math lesson..." value={videoData.description} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '100px' }} onChange={(e) => setVideoData({ ...videoData, description: e.target.value })} />
                    <button type="submit" disabled={uploading} style={{ background: uploading ? '#888' : '#333', color: '#fff', padding: '15px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                        {uploading ? "Publishing... 🦾" : "PUBLISH TO VIDEO VAULT 🚀"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Admin;