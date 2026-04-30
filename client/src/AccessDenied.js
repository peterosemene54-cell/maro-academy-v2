import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AccessDenied = () => {
    const navigate = useNavigate();

    // 🔍 CHECK WHY THEY ARE HERE
    const location = useLocation();
    const isExpired = location.state?.expired;

    return (
        <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px', 
            height: '100vh', 
            backgroundColor: '#fff5f5', 
            fontFamily: 'Arial, sans-serif' 
        }}>
            <div style={{ 
                maxWidth: '600px', 
                margin: '0 auto', 
                background: 'white', 
                padding: '40px', 
                borderRadius: '15px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
            }}>
                <h1 style={{ color: '#d9534f', fontSize: '3.5rem', marginBottom: '10px' }}>
                    {isExpired ? '⏰' : '🛑'}
                </h1>

                <h2 style={{ color: '#d9534f', fontSize: '2rem', marginBottom: '20px' }}>
                    {isExpired ? 'SUBSCRIPTION EXPIRED' : 'ACCESS DENIED'}
                </h2>
                
                <p style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.6' }}>
                    {isExpired 
                        ? 'Your 30-day access has ended. Renew your subscription to continue watching tutorials and keep your progress going! 💪'
                        : "Oga hasn't cleared your account to watch the tutorials yet. This usually happens when your school fees (payment) haven't been verified."
                    }
                </p>

                <div style={{ 
                    marginTop: '30px', 
                    padding: '20px', 
                    border: '2px dashed #ddd', 
                    borderRadius: '10px',
                    textAlign: 'left'
                }}>
                    <h3 style={{ color: '#333' }}>
                        {isExpired ? 'How to Renew Your Access:' : 'How to Unlock the Vault:'}
                    </h3>
                    <ul style={{ color: '#666', lineHeight: '2' }}>
                        {isExpired ? (
                            <>
                                <li>1. Transfer the renewal fee to <b>Moniepoint: [YOUR ACCOUNT NUMBER]</b></li>
                                <li>2. Take a screenshot of the receipt.</li>
                                <li>3. Send it to Oga on WhatsApp for instant renewal.</li>
                                <li>4. Your 30 days restarts immediately after approval! ✅</li>
                            </>
                        ) : (
                            <>
                                <li>1. Transfer the fee to <b>Moniepoint: [YOUR ACCOUNT NUMBER]</b></li>
                                <li>2. Take a screenshot of the receipt.</li>
                                <li>3. Send it to Oga on WhatsApp for instant approval.</li>
                            </>
                        )}
                    </ul>
                </div>

                <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button 
                        onClick={() => window.location.href = "https://wa.me"}
                        style={{ 
                            background: '#28a745', 
                            color: 'white', 
                            padding: '18px', 
                            border: 'none', 
                            borderRadius: '8px', 
                            cursor: 'pointer', 
                            fontWeight: 'bold', 
                            fontSize: '1.1rem' 
                        }}>
                        {isExpired 
                            ? 'RENEW SUBSCRIPTION ON WHATSAPP 🔄' 
                            : 'SEND PAYMENT RECEIPT ON WHATSAPP 💰'
                        }
                    </button>

                    <button 
                        onClick={() => navigate('/login')}
                        style={{ 
                            background: 'transparent', 
                            color: '#666', 
                            border: 'none', 
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}>
                        Try Login Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;