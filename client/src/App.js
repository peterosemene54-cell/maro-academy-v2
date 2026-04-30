import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🚀 HEAVY MOVE: "Lazy Loading" 
const Register = lazy(() => import('./Register'));
const Admin = lazy(() => import('./Admin'));
const Login = lazy(() => import('./Login'));
const VideoVault = lazy(() => import('./VideoVault'));
const AccessDenied = lazy(() => import('./AccessDenied'));

function App() {
  // 🔐 FIXED: Reads localStorage IMMEDIATELY - no more reload bug!
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('maroUser');
    return saved ? JSON.parse(saved) : null;
  });

  // 🆓 FREE MODE SWITCH - false = everyone watches free!
  const [paymentRequired, setPaymentRequired] = useState(() => {
    const mode = localStorage.getItem('paymentRequired');
    return mode ? JSON.parse(mode) : false;
  });

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

  // ⏰ CHECK IF SUBSCRIPTION HAS EXPIRED
  const isSubscriptionExpired = (user) => {
    if (!user || !user.expiryDate) return false;
    return new Date() > new Date(user.expiryDate);
  };

  // 🔑 Function to lock the suitcase when they log in
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('maroUser', JSON.stringify(userData));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Suspense fallback={<div style={{textAlign: 'center', padding: '50px'}}>Loading Maro Academy... 🦾</div>}>
          <Routes>
            {/* 🏠 The Student Gateway */}
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} />
            
            {/* 🔑 The Login Gate */}
            <Route path="/login" element={<Login setUser={handleLogin} />} />

            {/* 🔒 Access Denied Page */}
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* 🎬 THE VIP ROOM */}
            <Route 
              path="/video-vault" 
              element={
                !paymentRequired ? (
                  // 🆓 FREE MODE - everyone watches free!
                  <VideoVault user={user} />
                ) : user ? (
                  isSubscriptionExpired(user) ? (
                    // ⏰ EXPIRED - subscription ended!
                    <Navigate to="/access-denied" state={{ expired: true }} />
                  ) : user.isPaid ? (
                    // ✅ PAID AND ACTIVE - welcome!
                    <VideoVault user={user} />
                  ) : (
                    // ❌ NOT PAID - go pay first!
                    <Navigate to="/access-denied" />
                  )
                ) : (
                  // 🔒 NOT LOGGED IN - go login first!
                  <Navigate to="/login" />
                )
              } 
            />

            {/* 🔐 The Oga's Secret Vault (Admin) */}
            <Route path="/oga-boss-admin-vault-77" element={<Admin />} />

            {/* 🚫 Auto-Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;