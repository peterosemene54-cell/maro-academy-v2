import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🚀 LAZY LOADING
const Register = lazy(() => import('./Register'));
const Admin = lazy(() => import('./Admin'));
const Login = lazy(() => import('./Login'));
const VideoVault = lazy(() => import('./VideoVault'));
const AccessDenied = lazy(() => import('./AccessDenied'));
const BrowserWarning = lazy(() => import('./BrowserWarning'));

// 🌐 CONFIG
const API_URL = "https://maro-academy-v2.onrender.com";

function App() {
  // 🔐 INITIAL STATE
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('maroUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [paymentRequired, setPaymentRequired] = useState(() => {
    const mode = localStorage.getItem('paymentRequired');
    return mode ? JSON.parse(mode) : false;
  });

  // ===============================
  // 🌐 SYNC PAYMENT MODE ON LOAD
  // ===============================
  useEffect(() => {
    const fetchPaymentMode = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings`);
        const data = await res.json();
        setPaymentRequired(data.paymentRequired);
        localStorage.setItem('paymentRequired', JSON.stringify(data.paymentRequired));
      } catch (error) {
        console.error("Could not fetch payment mode", error);
      }
    };
    fetchPaymentMode();
  }, []);

  // ===============================
  // 🛡️ MIGHTY GLOBAL EXPIRY GUARD
  // Kicks from ANY page & syncs Admin instantly!
  // ===============================
  useEffect(() => {
    const globalWatcher = setInterval(async () => {
      if (!user || !user.expiryDate) return;

      const now = new Date();
      const expiry = new Date(user.expiryDate);

      if (now > expiry) {
        console.log("🔴 GLOBAL EXPIRY: Kicking out now! GBAMA! 💥");
        
        try {
          // Sync with Admin Dashboard using individual ID
          await fetch(`${API_URL}/api/students/auto-expire/${user._id}`, {
            method: 'PUT'
          });
        } catch (e) {
          console.error("Admin sync failed", e);
        }

        // Clear local session and force redirect
        localStorage.removeItem('maroUser');
        setUser(null);
        window.location.href = '/access-denied?expired=true';
      }
    }, 1000); // Super fast 1-second check

    return () => clearInterval(globalWatcher);
  }, [user]);

  // ===============================
  // 🛠️ HELPERS
  // ===============================
  const isSubscriptionExpired = (userData) => {
    if (!userData || !userData.expiryDate) return false;
    return new Date() > new Date(userData.expiryDate);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('maroUser', JSON.stringify(userData));
  };

  // ===============================
  // 🏛️ THE MIGHTY ROUTER
  // ===============================
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Suspense fallback={<div style={{textAlign: 'center', padding: '50px'}}>Loading Maro Academy... 🦾</div>}>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setUser={handleLogin} />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="/browser-warning" element={<BrowserWarning />} />

            {/* 🎬 PROTECTED VIDEO VAULT */}
            <Route
              path="/video-vault"
              element={
                !paymentRequired ? (
                  <VideoVault user={user} />
                ) : user ? (
                  isSubscriptionExpired(user) ? (
                    <Navigate to="/access-denied" state={{ expired: true }} />
                  ) : user.isPaid ? (
                    <VideoVault user={user} />
                  ) : (
                    <Navigate to="/access-denied" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route path="/oga-boss-admin-vault-77" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
