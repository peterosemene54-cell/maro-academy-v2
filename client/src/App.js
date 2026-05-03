import React, { Suspense, lazy, useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const Register = lazy(() => import('./Register'));
const Admin = lazy(() => import('./Admin'));
const Login = lazy(() => import('./Login'));
const VideoVault = lazy(() => import('./VideoVault'));
const AccessDenied = lazy(() => import('./AccessDenied'));
const BrowserWarning = lazy(() => import('./BrowserWarning'));

const API_URL = "https://maro-academy-v2.onrender.com";

const PrivateGuard = ({ children, user, paymentRequired }) => {
    if (!paymentRequired) return children;
    if (!user) return <Navigate to="/login" replace />;
    if (!localStorage.getItem('maroToken')) return <Navigate to="/access-denied" replace />;
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

    const handleKick = useCallback((reason = "security_violation") => {
        localStorage.removeItem('maroUser');
        localStorage.removeItem('maroToken'); 
        setUser(null);
        window.location.href = `/access-denied?reason=${reason}`;
    }, []);

    // WEBSOCKET
    useEffect(() => {
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
            socket.emit('init_vault_session', user._id);
        });

        socket.on('system_broadcast', (data) => {
            setPaymentRequired(data.payment);
            setSystemNotice(data.notice);
            localStorage.setItem('paymentRequired', JSON.stringify(data.payment));
            if (data.maintenance) handleKick("maintenance");
        });

        socket.on('security_alert', (data) => handleKick(data.type.toLowerCase()));
        socket.on('force_disconnect', () => handleKick("admin_revoked"));
        socket.on('disconnect', () => setSocketConnected(false));

        return () => socket.disconnect();
    }, [user, handleKick]);

    // BACKGROUND SYNC
    const syncStatus = useCallback(async () => {
        if (!user?._id) return;

        try {
            const res = await axios.get(`${API_URL}/api/settings`);
            setPaymentRequired(res.data.paymentRequired);
            localStorage.setItem('paymentRequired', JSON.stringify(res.data.paymentRequired));
            
            if (res.data.paymentRequired) {
                const token = localStorage.getItem('maroToken');
                if (token) {
                    await axios.get(`${API_URL}/api/videos`, {
                        headers: { 'x-vault-token': token }
                    });
                }
            }
        } catch (e) {
            // 401 = Fake token, 403 = Expired. Kick them.
            // 402 = Not approved yet. IGNORE IT so they don't get stuck in a loop!
            if (e.response && [401, 403].includes(e.response.status)) {
                handleKick("access_revoked");
            }
        }
    }, [user, handleKick]);

    useEffect(() => {
        syncStatus();
        const interval = setInterval(syncStatus, 30000); 
        return () => clearInterval(interval);
    }, [syncStatus]);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('maroUser', JSON.stringify(userData));
    };

    const LoadingScreen = useMemo(() => (
        <div className="flex flex-col items-center justify-center h-screen bg-black font-mono">
            <div className="relative">
                <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-green-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-green-500 text-xs">MARO</span>
                </div>
            </div>
            <h2 className="mt-8 text-green-500 tracking-[0.5em] animate-pulse">INITIALIZING CITADEL...</h2>
        </div>
    ), []);

    return (
        <Router>
            <div className="min-h-screen bg-[#050505] text-white selection:bg-green-500 selection:text-black">
                <Suspense fallback={LoadingScreen}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/register" replace />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login setUser={handleLogin} />} />
                        <Route path="/access-denied" element={<AccessDenied />} />
                        <Route path="/browser-warning" element={<BrowserWarning />} />
                        
                        <Route path="/video-vault" element={
                            <PrivateGuard user={user} paymentRequired={paymentRequired}>
                                <VideoVault user={user} />
                            </PrivateGuard>
                        } />

                        <Route path="/oga-boss-admin-vault-77" element={<Admin />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>

                <footer className="fixed bottom-0 w-full z-50" aria-hidden="true">
                    {systemNotice && (
                        <div className="bg-green-600 text-black text-center py-1 text-xs font-bold uppercase tracking-widest">
                            📢 {systemNotice}
                        </div>
                    )}
                    <div className="bg-black/80 backdrop-blur-md border-t border-white/5 py-2 px-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${socketConnected ? 'bg-green-500 shadow-[0_0_10px_green]' : 'bg-red-500 animate-pulse'}`}></div>
                            <span className="text-[9px] uppercase tracking-tighter text-gray-400">
                                {socketConnected ? 'Citadel Linked' : 'Link Interrupted'}
                            </span>
                        </div>
                        {user && (
                            <div className="text-[9px] text-gray-400 font-mono">
                                SESSION: {user._id.substring(0, 8)}...
                            </div>
                        )}
                        <div className="text-[9px] text-gray-400">© 2026 MARO ACADEMY</div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;