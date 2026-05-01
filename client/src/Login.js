import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://maro-academy-v2.onrender.com";

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/login`, { email, password });
            
            const loggedInUser = res.data;
            setUser(loggedInUser);

            // 🛡️ Send to vault - App.js decides access
            navigate("/video-vault");

        } catch (error) {
            // 🆕 CHECK IF THEY ARE EXPIRED!
            if (error.response?.status === 403 && error.response?.data?.expired) {
                // ⏰ Subscription expired - send to renewal page!
                navigate("/access-denied", { state: { expired: true } });
                return;
            }

            // Normal error messages
            const professionalMessage = error.response?.data?.message || "Connection error. Please check your internet.";
            alert("🛡️ MARO ACADEMY SECURITY:\n\n" + professionalMessage + " ❌");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: '50px 20px', textAlign: 'center', fontFamily: 'Arial' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <h2 style={{ color: '#333' }}>🔐 LOGIN TO WATCH TUTORIAL VIDEOS</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>Enter your details to enter the academy.</p>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            padding: '14px', 
                            background: '#333', 
                            color: '#fff', 
                            cursor: 'pointer', 
                            border: 'none', 
                            borderRadius: '6px',
                            fontWeight: 'bold' 
                        }}>
                        {loading ? "Verifying... 🦾" : "ENTER THE ACADEMY 🚀"}
                    </button>
                </form>
                <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                    Don't have an account? <span onClick={() => navigate('/register')} style={{ color: 'blue', cursor: 'pointer' }}>Register here</span>
                </p>
            </div>
        </div>
    );
};

export default Login;