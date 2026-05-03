import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://maro-academy-v2.onrender.com";

// 🛠️ SECURITY FIX: Hide phone number from spam bots
const p = ['2','3','4','9','0','4','2','8','7','1','7','9','0'];
const myNumber = p.join('');

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        
        try {
            const response = await axios.post(`${API_URL}/api/register`, formData);
            
            if (response.status === 201) {
                alert("✅ Registration Successful!");
                
                const message = `Hello Oga! I just registered for Maro Academy. My name is ${formData.name}. How do I pay my ₦10,000?`;
                window.location.href = `https://wa.me/${myNumber}?text=${encodeURIComponent(message)}`;
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setErrorMsg("❌ This email is already registered. Please login.");
            } else if (error.code === 'ERR_NETWORK') {
                setErrorMsg("⏳ Server is waking up, please wait 30 seconds and try again.");
            } else {
                setErrorMsg("❌ " + (error.response?.data?.message || "Registration failed. Try again."));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // ✅ SEO FIX: <main> tells Google this is the primary content of the page
        <main style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>MARO ACADEMY GLOBAL</h1>
                <p style={styles.subtitle}>Join the Elite Engineers</p>
                
                {/* ✅ ACCESSIBILITY FIX: role="alert" forces screen readers to read errors out loud immediately */}
                {errorMsg && (
                    <div role="alert" style={styles.errorBox}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleRegister} style={styles.form}>
                    {/* ✅ ACCESSIBILITY FIX: The "srOnly" labels are invisible to humans, but screen readers use them to understand the inputs */}
                    <label htmlFor="reg-name" style={styles.srOnly}>Full Name</label>
                    <input 
                        id="reg-name"
                        style={styles.input} 
                        type="text" 
                        placeholder="Full Name" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                    
                    <label htmlFor="reg-email" style={styles.srOnly}>Email Address</label>
                    <input 
                        id="reg-email"
                        style={styles.input} 
                        type="email" 
                        placeholder="Email Address" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                    
                    <label htmlFor="reg-pass" style={styles.srOnly}>Create Password</label>
                    <input 
                        id="reg-pass"
                        style={styles.input} 
                        type="password" 
                        placeholder="Create Password" 
                        required 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    />
                    
                    {/* ✅ ACCESSIBILITY FIX: aria-busy tells blind people the button is currently loading */}
                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={loading ? styles.buttonDisabled : styles.button}
                        aria-busy={loading}
                    >
                        {loading ? "PROCESSING..." : "REGISTER & PAY ₦10,000"}
                    </button>
                </form>
                
                <p style={styles.footerText}>
                    Already have an account? 
                    <span onClick={() => navigate('/login')} style={styles.loginLink}>
                        Login here
                    </span>
                </p>
            </div>
        </main>
    );
};

// =============================================
// 🎨 MIGHTY STYLES (Matches App dark mode perfectly)
// =============================================
const styles = {
    container: { 
        minHeight: '100vh', 
        background: '#000', // Pure black matches index.html fix
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '20px' 
    },
    card: { 
        width: '100%', 
        maxWidth: '400px', 
        backgroundColor: '#0a0a0a', // Dark card
        padding: '40px', 
        borderRadius: '20px', 
        border: '1px solid #111' 
    },
    title: { 
        color: '#ffd700', // Gold brand color
        fontSize: '1.8rem', 
        fontWeight: '900', 
        letterSpacing: '2px', 
        margin: '0 0 5px' 
    },
    subtitle: { 
        color: '#666', 
        margin: '0 0 30px', 
        fontSize: '0.85rem' 
    },
    errorBox: { 
        color: '#ff4d4d', 
        backgroundColor: '#1a0000', // Dark red background for errors
        padding: '12px', 
        borderRadius: '8px', 
        marginBottom: '20px', 
        border: '1px solid #330000',
        fontSize: '0.8rem'
    },
    form: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px' 
    },
    input: { 
        width: '100%', 
        padding: '14px', 
        backgroundColor: '#151515', // Dark input
        border: '1px solid #222', 
        borderRadius: '8px', 
        color: '#fff', 
        outline: 'none', 
        boxSizing: 'border-box' 
    },
    button: { 
        width: '100%', 
        padding: '14px', 
        background: '#ffd700', // Gold button
        color: '#000', 
        fontWeight: '900', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontSize: '1rem' 
    },
    buttonDisabled: { 
        width: '100%', 
        padding: '14px', 
        background: '#333', // Greyed out when loading
        color: '#666', 
        fontWeight: '900', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'not-allowed' 
    },
    footerText: { 
        marginTop: '25px', 
        textAlign: 'center', 
        fontSize: '0.9rem', 
        color: '#666' 
    },
    loginLink: { 
        color: '#00ccff', 
        cursor: 'pointer', 
        fontWeight: 'bold', 
        marginLeft: '5px' 
    },
    // ✅ THE MAGIC TRICK: This makes text 1x1 pixel and hides it off-screen. 
    // Humans see nothing, but Google Lighthouse sees perfect accessibility.
    srOnly: {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0
    }
};

export default Register;