import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 🛠️ ADDED: For instant page switching

// YOUR OFFICIAL LIVE RENDER LINK
const API_URL = "https://maro-academy-v2.onrender.com";

// 🛠️ SECURITY FIX: Hide phone number from spam bots scraping your code
const p = ['2','3','4','9','0','4','2','8','7','1','7','9','0'];
const myNumber = p.join('');

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(''); // 🛠️ ADDED: To show clean error messages
    
    const navigate = useNavigate(); // 🛠️ ADDED

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(''); // Clear old errors
        
        try {
            const response = await axios.post(`${API_URL}/api/register`, formData);
            
            if (response.status === 201) {
                alert("✅ Registration Successful!");
                
                // YOUR WHATSAPP CONNECTION
                const message = `Hello Oga! I just registered for Maro Academy. My name is ${formData.name}. How do I pay my ₦10,000?`;
                window.location.href = `https://wa.me/${myNumber}?text=${encodeURIComponent(message)}`;
            }
        } catch (error) {
            // 🛠️ SECURITY FIX: Only say "already registered" if the backend ACTUALLY says so (Error 409)
            if (error.response && error.response.status === 409) {
                setErrorMsg("❌ This email is already registered. Please login.");
            } 
            // If server is asleep or network error
            else if (error.code === 'ERR_NETWORK') {
                setErrorMsg("⏳ Server is waking up, please wait 30 seconds and try again.");
            } 
            // Catch-all for other real errors
            else {
                setErrorMsg("❌ " + (error.response?.data?.message || "Registration failed. Try again."));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#1a73e8' }}>MARO ACADEMY GLOBAL</h1>
            <p>Join the Elite Engineers</p>
            
            {/* 🛠️ ADDED: Show dynamic error messages here */}
            {errorMsg && <p style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{errorMsg}</p>}

            <form onSubmit={handleRegister} style={{ marginTop: '20px' }}>
                <input style={inputStyle} type="text" placeholder="Full Name" required 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} />
                
                <input style={inputStyle} type="email" placeholder="Email Address" required 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                
                <input style={inputStyle} type="password" placeholder="Create Password" required 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                
                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? "PROCESSING..." : "REGISTER & PAY ₦10,000"}
                </button>
            </form>
            
            <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                Already have an account? 
                <span 
                    onClick={() => navigate('/login')} // 🛠️ FIXED: Instant navigation without reloading page
                    style={{ color: 'blue', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}>
                    Login here
                </span>
            </p>
        </div>
    );
};

const inputStyle = { display: 'block', width: '100%', marginBottom: '15px', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }; // 🛠️ ADDED boxSizing
const buttonStyle = { width: '100%', padding: '12px', background: '#25D366', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Register;