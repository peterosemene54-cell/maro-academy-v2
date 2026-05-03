/**
 * MARO ACADEMY GLOBAL - THE INFINITE GUARDIAN
 * VERSION: 6.4.0 (Smart Mobile Tuning)
 * FEATURES: Socket.io Integration, Session Tracking, Anti-Tamper Logic, Performance Tuned
 */

import React, { Suspense, lazy, useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

// 🚀 LAZY LOADING (Performance Optimization)
const Register = lazy(() => import('./Register'));
const Admin = lazy(() => import('./Admin'));
const Login = lazy(() => import('./Login'));
const VideoVault = lazy(() => import('./VideoVault'));
const AccessDenied = lazy(() => import('./AccessDenied'));
const BrowserWarning = lazy(() => import('./BrowserWarning'));

// 🌐 CONFIG
const API_URL = "https://maro-academy-v2.onrender.com";

// =============================================
// 🛡️ ADVANCED ROUTE GUARD COMPONENT
// =============================================
const PrivateGuard = ({ children, user, paymentRequired }) => {
    if (!paymentRequired) return children;
    if (!user) return <Navigate to="/login" replace />;
    if (!user.isPaid) return <Navigate to="/access-denied" replace />;
    return children;
};

function App() {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('maroUser');
        return saved ? JSON.parse(saved) : null;
    });

    const [paymentRequired, setPaymentRequired] = useState(() => {
        const mode = localStorage.getItem('paymentRequired');
        return mode ? JSON.parse(mode) : false;
    });

    const [systemNotice, setSystemNotice] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);

    // =============================================
    // ⚡ ACTION: THE GLOBAL KILL-SWITCH
    // =============================================
    const handleKick = useCallback((reason = "security_violation") => {
        console.warn(`[SECURITY ALERT] Kicking user: ${reason}`);
        localStorage.removeItem('maroUser');
        localStorage.removeItem('maroToken'); 
        setUser(null);
        window.location.href = `/access-denied?reason=${reason}`;
    }, []);

    // =============================================
    // 📡 WEBSOCKET ENGINE (Smart Mobile Tuning)
    // =============================================
    useEffect(() => {
        // 🚀 PERFORMANCE FIX: Don't connect to Socket on Login/Register pages!
        // Only connect if user is actually logged in (has an ID). Saves massive mobile data.
        if (!user?._id) {
            setSocketConnected(false);
            return; 
        }

        const socket = io(API_URL, {
            reconnectionAttempts: 5,
            reconnectionDelay: 2000
        });

        socket.on('connect', () => {
            setSocketConnected(true);
            console.log("⚡ Secure Link Established with Citadel.");
            socket.emit('init_vault_session', user._id);
        });

        socket.on('system_broadcast', (data) => {
            setPaymentRequired(data.payment);
            setSystemNotice(data.notice);
            localStorage.setItem('paymentRequired', JSON.stringify(data.payment));
            
            if (data.maintenance) {
                handleKick("maintenance");
            }
        });

        socket.on('security_alert', (data) => {
            handleKick(data.type.toLowerCase());
        });

        socket.on('force_disconnect', () => {
            handleKick("admin_revoked");
        });

        socket.on('disconnect', () => setSocketConnected(false));

        return () => socket.disconnect();
    }, [user, handleKick]);

    // =============================================
    // 🏛️ REFRESH SYNC (Fixed 404 Error & Smart Ping)
    // =============================================
    const syncStatus = useCallback(async () => {
        // 🚀 PERFORMANCE FIX: Don't ping backend if user isn't logged in
        if (!user?._id) return;

        try {
            const res = await axios.get(`${API_URL}/api/settings`);
            setPaymentRequired(res.data.paymentRequired);
            
            if (user && res.data.paymentRequired) {
                const token = localStorage.getItem('maroToken');
                
                if (!token) {
                    handleKick("missing_token");
                    return;
                }

                await axios.get(`${API_URL}/api/videos`, {
                    headers: { 'x-vault-token': token }
                });
            }
        } catch (e) {
            if (e.response && [401, 402, 403].includes(e.response.status)) {
                handleKick("unpaid_status");
            }
        }
    }, [user, handleKick]);

    useEffect(() => {
        syncStatus();
        const backupCheck = setInterval(syncStatus, 30000); 
        return () => clearInterval(backupCheck);
    }, [syncStatus]);

    // =============================================
    // 🔑 AUTH HANDLERS
    // =============================================
    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('maroUser', JSON.stringify(userData));
    };

    // =============================================
    // 🎨 UI COMPONENTS
    // =============================================
    const LoadingScreen = useMemo(() => (
        <div className="flex flex-col items-center justify-center h-screen bg-black font-mono">
            <div className="relative">
                <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-green-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-green-500 text-xs">MARO</span>
                </div>
            </div>
            <h2 className="mt-8 text-green-500 tracking-[0.5em] animate-pulse">
                INITIALIZING CITADEL...
            </h2>
            <p className="mt-2 text-gray-600 text-[10px]">VERIFYING ENCRYPTION KEYS</p>
        </div>
    ), []);

    return (
        <Router>
            <div className="min-h-screen bg-[#050505] text-white selection:bg-green-500 selection:text-black">
                <Suspense fallback={LoadingScreen}>
                    <Routes>
                        {/* PUBLIC ACCESS */}
                        <Route path="/" element={<Navigate to="/register" replace />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login setUser={handleLogin} />} />
                        <Route path="/access-denied" element={<AccessDenied />} />
                        <Route path="/browser-warning" element={<BrowserWarning />} />

                        {/* 🎬 SECURE VIDEO VAULT */}
                        <Route 
                            path="/video-vault" 
                            element={
                                <PrivateGuard user={user} paymentRequired={paymentRequired}>
                                    <VideoVault user={user} />
                                </PrivateGuard>
                            } 
                        />

                        {/* 🔑 ADMIN OVERRIDE */}
                        <Route path="/oga-boss-admin-vault-77" element={<Admin />} />

                        {/* FALLBACK */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>

                {/* 🛡️ REAL-TIME SYSTEM MONITOR */}
                {/* ✅ ACCESSIBILITY FIX: aria-hidden="true" tells screen readers to ignore decorative footer */}
                <footer className="fixed bottom-0 w-full z-50" aria-hidden="true">
                    {systemNotice && (
                        <div className="bg-green-600 text-black text-center py-1 text-xs font-bold uppercase tracking-widest">
                            📢 {systemNotice}
                        </div>
                    )}
                    <div className="bg-black/80 backdrop-blur-md border-t border-white/5 py-2 px-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${socketConnected ? 'bg-green-500 shadow-[0_0_10px_green]' : 'bg-red-500 animate-pulse'}`}></div>
                            {/* ✅ ACCESSIBILITY FIX: Changed text-gray-500 to text-gray-400 so contrast is higher */}
                            <span className="text-[9px] uppercase tracking-tighter text-gray-400">
                                {socketConnected ? 'Citadel Linked' : 'Link Interrupted'}
                            </span>
                        </div>
                        {user && (
                            <div className="text-[9px] text-gray-400 font-mono">
                                SESSION_ID: {user._id.substring(0, 8)}... | SECURITY_LEVEL: HIGH
                            </div>
                        )}
                        {/* ✅ ACCESSIBILITY FIX: Changed text-gray-600 to text-gray-400 */}
                        <div className="text-[9px] text-gray-400">
                            © 2026 MARO ACADEMY GLOBAL
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;