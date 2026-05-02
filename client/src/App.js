import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🚀 LAZY LOADING
const Register = lazy(() => import('./Register'));
const Admin = lazy(() => import('./Admin'));
const Login = lazy(() => import('./Login'));
const VideoVault = lazy(() => import('./VideoVault'));
const AccessDenied = lazy(() => import('./AccessDenied'));
// 🆕 BROWSER WARNING PAGE
const BrowserWarning = lazy(() => import('./BrowserWarning'));

function App() {
  // 🔐 FIXED: Reads localStorage IMMEDIATELY - no more reload bug!
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('maroUser');
    return saved ? JSON.parse(saved) : null;
  });

  // 🆓 FREE MODE SWITCH
  const [paymentRequired, setPaymentRequired] = useState(() => {
    const mode = localStorage.getItem('paymentRequired');
    return mode ? JSON.parse(mode) : false;
  });
  // ... existing code ...
  useEffect(() => {
    fetchPaymentMode();
  }, []);

  // 👇 PASTE IT HERE (Inside the App function)
  useEffect(() => {
    const globalWatcher = setInterval(async () => {
      if (!user || !user.expiryDate) return;
      // ... rest of the logic ...
    }, 1000);
    return () => clearInterval(globalWatcher);
  }, [user]);

  // ⏰ CHECK IF SUBSCRIPTION HAS EXPIRED
  const isSubscriptionExpired = (user) => {
    // ... rest of the code ...

  // 🌐 FETCH PAYMENT MODE FROM SERVER ON LOAD
  useEffect(() => {
    const fetchPaymentMode = async () => {
      try {
        const res = await fetch("https://maro-academy-v2.onrender.com/api/settings");
        const data = await res.json();
        setPaymentRequired(data.paymentRequired);
        localStorage.setItem('paymentRequired', JSON.stringify(data.paymentRequired));
      } catch (error) {
        console.error("Could not fetch payment mode", error);
      }
    };
    fetchPaymentMode();
  }, []);
  // 🛡️ GLOBAL EXPIRY GUARD (Kicks out from ANY page!)
  useEffect(() => {
    const globalWatcher = setInterval(async () => {
      if (!user || !user.expiryDate) return;

      const now = new Date();
      const expiry = new Date(user.expiryDate);

      if (now > expiry) {
        console.log("🔴 GLOBAL EXPIRY: Access Revoked!");
        
        try {
          // Sync with Admin Dashboard immediately using ID
          await fetch(`https://onrender.com{user._id}`, {
            method: 'PUT'
          });
        } catch (e) {
          console.error("Admin sync failed", e);
        }

        // Clear local session and kick
        localStorage.removeItem('maroUser');
        window.location.href = '/access-denied?expired=true';
      }
    }, 1000); 

    return () => clearInterval(globalWatcher);
  }, [user]);

  // ⏰ CHECK IF SUBSCRIPTION HAS EXPIRED
  const isSubscriptionExpired = (user) => {
    if (!user || !user.expiryDate) return false;
    return new Date() > new Date(user.expiryDate);
  };

  // 🔑 Handle Login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('maroUser', JSON.stringify(userData));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Suspense fallback={<div style={{textAlign: 'center', padding: '50px'}}>Loading Maro Academy... 🦾</div>}>
          <Routes>
            {/* 🏠 Register */}
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} />

            {/* 🔑 Login */}
            <Route path="/login" element={<Login setUser={handleLogin} />} />

            {/* 🔒 Access Denied */}
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* 🆕 Browser Warning */}
            <Route path="/browser-warning" element={<BrowserWarning />} />

            {/* 🎬 VIDEO VAULT */}
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

            {/* 🔐 Admin */}
            <Route path="/oga-boss-admin-vault-77" element={<Admin />} />

            {/* 🚫 Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}
}

export default App;