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
            // 🚀 TALKING TO YOUR RENDER SERVER
            const res = await axios.post(`${API_URL}/api/login`, { email, password });
            
            // 🔑 Getting the user data (including isPaid + expiryDate!)
            const loggedInUser = res.data;

            // Save user to App state
            setUser(loggedInUser);

            // 🛡️ ALWAYS SEND TO VAULT - App.js decides if they can enter!
            // FREE MODE = everyone gets in
            // PAID MODE = App.js checks isPaid and expiryDate
            navigate("/video-vault");

        } catch (error) {
            // 📢 Professional message from server
            const professionalMessage = error.response?.data?.message || "Connection error. Please check your internet.";
            
            // 🔐 Security alert
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