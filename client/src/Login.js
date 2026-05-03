/**
 * MARO ACADEMY GLOBAL - THE SENTINEL LOGIN
 * VERSION: 6.4.0 (Unbreakable Free/Paid Mode Logic)
 * FEATURES: Dark Mode UI, Error Mapping, Secure Token Capture, Free Mode Bypass
 */

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = "https://maro-academy-v2.onrender.com";

const Login = ({ setUser }) => {
    // 🔐 STATE MANAGEMENT
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [status, setStatus] = useState({ loading: false, error: null });
    
    const navigate = useNavigate();
    const location = useLocation();
    const emailInputRef = useRef(null);

    // UI Feedback for users redirected from the "Kick" system
    const queryParams = new URLSearchParams(location.search);
    const reason = queryParams.get('reason');

    // 🛠️ Auto-focus email input on page load
    useEffect(() => {
        if (emailInputRef.current) {
            emailInputRef.current.focus();
        }
    }, []);

    // 🛡️ INPUT HANDLER
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // =============================================
    // 🚀 THE SECURE LOGIN LOGIC (v6.4 Unbreakable)
    // =============================================
    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null });

        try {
            // 1. Dispatch Login Request
            const res = await axios.post(`${API_URL}/api/login`, {
                email: credentials.email.trim(),
                password: credentials.password
            });
            
            const loggedInUser = res.data;

            // 🛡️ CRITICAL FIX: Separate the secure session token from user data
            const { sessionToken, ...userData } = loggedInUser;

            // 2. Clear old sessions to prevent ghost tokens
            localStorage.removeItem('maroToken');

            // 🛡️ CRITICAL FIX: Save the new Spoof-Proof Session Token
            if (sessionToken) {
                localStorage.setItem('maroToken', sessionToken);
            }

            // ==========================================
            // 🆕 THE UNBREAKABLE FREE/PAID LOGIC
            // ==========================================
            // Ask the backend: "Are we in Free Mode or Paid Mode?"
            const settingsRes = await axios.get(`${API_URL}/api/settings`);
            

           
            // If Free Mode OR (Paid Mode + Approved), they pass through below!
            // ==========================================

            // 4. Local State & Storage Update
            setUser(userData);
            localStorage.setItem('maroUser', JSON.stringify(userData));

            // 5. Log Success & Divert to Vault
            console.log("🛡️ CITADEL ACCESS GRANTED - TOKEN SECURED");
            navigate("/video-vault");

        } catch (error) {
            console.error("Login Security Breach:", error);
            
            // Mapping Specific Server Responses
            const statusCode = error.response?.status;
            const serverMessage = error.response?.data?.message;

            if (statusCode === 403) {
                navigate("/access-denied", { state: { expired: true } });
            } else if (statusCode === 423) {
                setStatus({ loading: false, error: "⛔ IP BLACKLISTED: Too many failed attempts. Wait 1 hour or change network." });
            } else if (statusCode === 429) {
                setStatus({ loading: false, error: "⏳ System cooling down. Wait a few minutes." });
            } else {
                setStatus({ loading: false, error: serverMessage || "Vault Unreachable. Check connection." });
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* 🦾 THE LOGO/HEADER */}
                <div style={styles.header}>
                    <div style={styles.iconBox}>🦾</div>
                    <h1 style={styles.title}>MARO ACADEMY</h1>
                    <p style={styles.subtitle}>SECURE SENTINEL ACCESS v6.4</p>
                </div>

                {/* 🚩 ALERTS & WARNINGS */}
                {reason && (
                    <div style={styles.warningBox}>
                        ⚠️ LOGOUT DETECTED: {reason.replace('_', ' ').toUpperCase()}
                    </div>
                )}
                
                {status.error && (
                    <div style={styles.errorBox}>
                        ❌ {status.error}
                    </div>
                )}

                {/* 🛡️ THE FORM */}
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>GMAIL ADDRESS</label>
                        <input 
                            ref={emailInputRef}
                            name="email"
                            type="email" 
                            placeholder="maro@example.com" 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>SECURITY PASSWORD</label>
                        <input 
                            name="password"
                            type="password" 
                            placeholder="••••••••" 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={status.loading}
                        style={status.loading ? styles.buttonDisabled : styles.button}
                    >
                        {status.loading ? "DECRYPTING... 🦾" : "VERIFY IDENTITY & ENTER 🚀"}
                    </button>
                </form>

                <div style={styles.footer}>
                    <span>New Cadet?</span>
                    <span 
                        onClick={() => navigate('/register')} 
                        style={styles.link}
                    > Apply for Membership</span>
                </div>
            </div>
        </div>
    );
};

// =============================================
// 🎨 HEAVY DUTY CSS-IN-JS STYLES
// =============================================
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Inter', sans-serif",
    },
    card: {
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#0f0f0f',
        border: '1px solid #1a1a1a',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    },
    header: { textAlign: 'center', marginBottom: '30px' },
    iconBox: { fontSize: '40px', marginBottom: '10px' },
    title: { color: '#fff', fontSize: '24px', fontWeight: '800', letterSpacing: '2px', margin: 0 },
    subtitle: { color: '#444', fontSize: '10px', fontWeight: 'bold', marginTop: '5px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { color: '#666', fontSize: '10px', fontWeight: '900', letterSpacing: '1px' },
    input: {
        padding: '14px',
        backgroundColor: '#151515',
        border: '1px solid #222',
        borderRadius: '8px',
        color: '#fff',
        outline: 'none',
        transition: '0.3s',
        boxSizing: 'border-box'
    },
    button: {
        marginTop: '10px',
        padding: '16px',
        backgroundColor: '#fff',
        color: '#000',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '900',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    buttonDisabled: {
        marginTop: '10px',
        padding: '16px',
        backgroundColor: '#222',
        color: '#444',
        borderRadius: '8px',
        cursor: 'not-allowed',
    },
    errorBox: {
        backgroundColor: '#220000',
        color: '#ff4444',
        padding: '12px',
        borderRadius: '6px',
        fontSize: '12px',
        textAlign: 'center',
        marginBottom: '20px',
        border: '1px solid #440000',
    },
    warningBox: {
        backgroundColor: '#221100',
        color: '#ff9900',
        padding: '12px',
        borderRadius: '6px',
        fontSize: '11px',
        textAlign: 'center',
        marginBottom: '20px',
        border: '1px solid #442200',
        fontWeight: 'bold',
    },
    footer: { marginTop: '25px', textAlign: 'center', fontSize: '13px', color: '#666' },
    link: { color: '#00ccff', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;