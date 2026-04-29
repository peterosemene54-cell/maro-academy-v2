import React, { useState } from 'react';
import axios from 'axios';

// YOUR OFFICIAL LIVE RENDER LINK
const API_URL = "https://maro-academy-v2.onrender.com";

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // CALLING YOUR LIVE SERVER
            const response = await axios.post(`${API_URL}/api/register`, formData);
            if (response.status === 201) {
                alert("✅ Registration Successful!");
                
                // YOUR WHATSAPP CONNECTION
                const myNumber = "2349042871790"; // PUT YOUR REAL NUMBER HERE
                const message = `Hello Oga! I just registered for Maro Academy. My name is ${formData.name}. How do I pay my ₦10,000?`;
                window.location.href = `https://wa.me/${myNumber}?text=${encodeURIComponent(message)}`;
            }
        } catch (error) {
            console.error(error);
            alert("❌ ERROR: " + (error.response?.data?.message || "Server is waking up, please try again in 30 seconds."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#1a73e8' }}>MARO ACADEMY GLOBAL</h1>
            <p>Join the Elite Engineers</p>
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
        </div>
    );
};

const inputStyle = { display: 'block', width: '100%', marginBottom: '15px', padding: '12px', borderRadius: '5px', border: '1px solid #ccc' };
const buttonStyle = { width: '100%', padding: '12px', background: '#25D366', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Register;
