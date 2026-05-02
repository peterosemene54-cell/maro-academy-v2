import React from 'react';
import { useNavigate } from 'react-router-dom';

const BrowserWarning = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif',
            padding: '20px'
        }}>
            <div style={{
                background: '#111',
                padding: '40px',
                borderRadius: '20px',
                maxWidth: '400px',
                width: '100%',
                textAlign: 'center',
                border: '1px solid #222',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '10px' }}>⚠️</div>
                <h2 style={{ color: '#ffd700', marginBottom: '10px', fontSize: '1.5rem' }}>
                    Browser Not Supported!
                </h2>
                <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.8', fontSize: '13px' }}>
                    For the best experience on <b style={{ color: '#ffd700' }}>Maro Academy</b>,
                    please open this platform on <b style={{ color: '#fff' }}>Google Chrome</b> browser.
                    Your current browser does not fully support our video player!
                </p>

                
                    href="https://www.google.com/chrome/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'block',
                        background: '#ffd700',
                        color: '#000',
                        padding: '15px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        marginBottom: '12px',
                        fontSize: '1rem'
                    }}
                    📥 Download Google Chrome
                </div>

                <button
                    onClick={() => navigate('/video-vault')}
                    style={{
                        background: 'transparent',
                        color: '#444',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '0.85rem'
                    }}>
                    Continue anyway (not recommended)
                </button>
            </div>
        
    );
};

export default BrowserWarning;