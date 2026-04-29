import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🚀 HEAVY MOVE: "Lazy Loading" 
// This makes the website faster by only loading the Admin page when you actually go there.
const Register = lazy(() => import('./Register'));
const Admin = lazy(() => import('./Admin'));

// 🛡️ HEAVY MOVE: Private Route Protection
// Even if a student finds the link, we can add a password check here later.
const AdminWrapper = ({ children }) => {
  return children; 
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* 🕵️‍♂️ Suspense: Shows a loading message while the "Heavy" pages are waking up */}
        <Suspense fallback={<div style={{textAlign: 'center', padding: '50px'}}>Loading Maro Academy... 🦾</div>}>
          <Routes>
            {/* 🏠 The Student Gateway */}
            <Route path="/" element={<Register />} />

            {/* 🔐 The Oga's Secret Vault */}
            <Route 
              path="/oga-boss-admin-vault-77" 
              element={
                <AdminWrapper>
                  <Admin />
                </AdminWrapper>
              } 
            />

            {/* 🚫 Auto-Redirect: If someone types a wrong link, take them back home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
