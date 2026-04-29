import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🚀 HEAVY MOVE: "Lazy Loading" 
const Register = lazy(() => import('./Register'));
const Admin = lazy(() => import('./Admin'));
const Login = lazy(() => import('./Login'));
const VideoVault = lazy(() => import('./VideoVault'));
const AccessDenied = lazy(() => import('./AccessDenied'));

function App() {
  // 🔐 This state holds the "Oga Key" (the user data)
  const [user, setUser] = useState(null);

  // Check if user was already logged in (saves them from logging in every 5 mins)
  useEffect(() => {
    const savedUser = localStorage.getItem('maroUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Function to lock the suitcase when they log in
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

            {/* 🎬 THE VIP ROOM (Only for Paid Students) */}
            <Route 
              path="/video-vault" 
              element={
                user ? (
                  user.isPaid ? <VideoVault user={user} /> : <Navigate to="/access-denied" />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />

            {/* 🔐 The Oga's Secret Vault (Admin) */}
            <Route path="/oga-boss-admin-vault-77" element={<Admin />} />

            {/* 🚫 Auto-Redirect: If someone types a wrong link, take them back home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
