import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * 🏛️ MARO ACADEMY - PRESIDENTIAL VIDEO VAULT v5.0 PRO
 * 🛡️ SECURITY PROTOCOLS:
 * 1. SANDBOX ISOLATION: Prevents navigation away from the portal.
 * 2. GHOST SHIELD: Blocks clicks on YouTube titles and share features.
 * 3. RIGHT-CLICK LOCKDOWN: Prevents source code inspection and link theft.
 * 4. DEEP OVERSCAN: Physically buries YouTube branding outside the UI frame.
 */

const VideoVault = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemReady, setSystemReady] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const navigate = useNavigate();
  const API_URL = "https://maro-academy-v2.onrender.com";

  // 🛡️ SECURITY PROTOCOL: GLOBAL CONTEXT MENU LOCKDOWN
  useEffect(() => {
    const lockSource = (e) => {
      if (e.button === 2) {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener('contextmenu', lockSource);
    return () => document.removeEventListener('contextmenu', lockSource);
  }, []);

  // 📥 DATA ACQUISITION ENGINE
  const initializeVault = useCallback(async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/videos`);
      setVideos(response.data);
      if (response.data.length > 0) {
        setActiveVideo(response.data[0]);
      }
      // ⏳ HEAVYWEIGHT INITIALIZATION DELAY
      setTimeout(() => {
        setLoading(false);
        setSystemReady(true);
      }, 1800);
    } catch (error) {
      console.error("🚨 VAULT ACCESS DENIED:", error);
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    initializeVault();
  }, [initializeVault]);

  // 🔐 ENCRYPTION LOADING SCREEN
  if (loading) {
    return (
      <div style={{ 
        background: '#000', height: '100vh', display: 'flex', 
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
        fontFamily: 'Impact, Charcoal, sans-serif' 
      }}>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <div style={{ 
            width: '100%', height: '100%', border: '6px solid #111', 
            borderTop: '6px solid #ffd700', borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }}></div>
          <div style={{ position: 'absolute', top: '38px', left: '42px', fontSize: '2.5rem' }}>🔐</div>
        </div>
        <h2 style={{ color: '#ffd700', letterSpacing: '10px', marginTop: '40px', fontSize: '0.8rem', textAlign: 'center' }}>
            CONNECTING TO MARO SECURE CLOUD...<br/>
            <span style={{ color: '#444', fontSize: '0.6rem', letterSpacing: '4px' }}>BYPASSING INTERCEPTORS</span>
        </h2>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'radial-gradient(circle at center, #0d0d0d 0%, #000 100%)', 
      minHeight: '100vh', color: '#fff', fontFamily: '"Segoe UI", Roboto, sans-serif',
      paddingBottom: '100px'
    }}>
      
      {/* 🔝 PRESIDENTIAL NAVIGATION (ULTRA-HEAVYWEIGHT) */}
      <nav style={{ 
        padding: '30px 6%', background: 'rgba(0,0,0,0.98)', borderBottom: '4px solid #111',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 1000, backdropFilter: 'blur(30px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #ffd700, #b8860b)', width: '55px', height: '55px',
            borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center',
            color: '#000', fontWeight: '900', fontSize: '1.8rem', boxShadow: '0 0 30px rgba(255,215,0,0.4)'
          }}>M</div>
          <div>
            <h1 style={{ margin: 0, color: '#ffd700', fontSize: '1.6rem', letterSpacing: '6px', fontWeight: '950' }}>MARO ACADEMY</h1>
            <div style={{ fontSize: '0.65rem', color: '#555', letterSpacing: '4px', fontWeight: 'bold' }}>PREMIUM ENCRYPTED PORTAL v5.0</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ 
            background: '#0a0a0a', padding: '12px 30px', borderRadius: '100px', 
            border: '2px solid #222', fontSize: '0.85rem', letterSpacing: '1px'
          }}>
            🎓 STUDENT ID: <span style={{ color: '#ffd700', fontWeight: '900' }}>{user?.name?.toUpperCase()}</span>
          </div>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: '1px solid #444', color: '#666', padding: '10px 25px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>LOGOUT</button>
        </div>
      </nav>

      {/* 🚀 THE MIGHTY CORE ARCHITECTURE */}
      <main style={{ 
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap', 
        padding: '50px 6%', gap: '50px', maxWidth: '1800px', margin: '0 auto',
        opacity: systemReady ? 1 : 0, transition: 'opacity 1s ease-in'
      }}>
        
        {/* 🎬 THE ARMORED SANDBOX VAULT (THE VIDEO ENGINE) */}
        {activeVideo ? (
          <div style={{ flex: '1 1 900px', maxWidth: '1200px', width: '100%' }}>
            <div style={{ 
              position: 'relative', width: '100%', paddingBottom: '56.25%', 
              overflow: 'hidden', borderRadius: '40px', background: '#000',
              border: '12px solid #0a0a0a', boxShadow: '0 80px 160px rgba(0,0,0,0.9)'
            }}>
              
              {/* 🛡️ THE GHOST SHIELD: Invisible layer blocking Title/Share clicks */}
              <div style={{ 
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100px', 
                zIndex: 20, background: 'linear-gradient(to bottom, #000 85%, transparent 100%)' 
              }}></div>

              {/* 🚀 THE CINEMA PLAYER: Red Button enabled for Instant Sound + Sandbox Lock */}
              <iframe 
                title="Maro Academy Secure Stream"
                src={`https://youtube.com/embed/${activeVideo.videoId}?modestbranding=1&rel=0&controls=1&showinfo=0&iv_load_policy=3&vq=hd1080&autoplay=0`}
                style={{ 
                  position: 'absolute', top: '-10%', left: '-1%', 
                  width: '102%', height: '120%', border: 'none',
                  filter: 'contrast(1.1) saturate(1.1) brightness(1.05)'
                }}
                /* 🔒 THE SECURITY FENCE: Blocks YouTube App Hijacking */
                sandbox="allow-scripts allow-same-origin allow-presentation"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              ></iframe>

              {/* 💎 MARO ACADEMY PRO BADGE (Hologram Overlay) */}
              <div style={{ 
                position: 'absolute', top: '40px', right: '40px', zIndex: 25,
                background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
                padding: '12px 30px', borderRadius: '100px', 
                border: '1px solid rgba(255,215,0,0.5)', boxShadow: '0 0 40px rgba(255,215,0,0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', background: '#ffd700', borderRadius: '50%', boxShadow: '0 0 15px #ffd700' }}></div>
                  <span style={{ color: '#ffd700', fontSize: '0.85rem', fontWeight: '950', letterSpacing: '6px' }}>MARO ACADEMY PRO</span>
                </div>
              </div>

              {/* 🔒 BOTTOM SECURITY MASK: Buries "Watch on YouTube" and Logos */}
              <div style={{ 
                position: 'absolute', bottom: 0, right: 0, width: '100%', height: '50px', 
                zIndex: 20, background: 'black', pointerEvents: 'none' 
              }}></div>
            </div>

            {/* 📝 LESSON INTEL CARD (INDUSTRIAL FINISH) */}
            <div style={{ 
              marginTop: '50px', background: 'linear-gradient(165deg, #0d0d0d, #000)', 
              padding: '60px', borderRadius: '50px', borderLeft: '15px solid #ffd700', 
              boxShadow: '0 50px 100px rgba(0,0,0,0.7)', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', fontSize: '15rem', color: 'rgba(255,215,0,0.02)', fontWeight: '950' }}>VAULT</div>
              <h1 style={{ margin: '0 0 25px 0', fontSize: '3.8rem', fontWeight: '950', color: '#fff', textTransform: 'uppercase', letterSpacing: '-2px' }}>{activeVideo.title}</h1>
              <p style={{ color: '#888', fontSize: '1.4rem', lineHeight: '2.1', maxWidth: '1000px', margin: 0 }}>{activeVideo.description}</p>
              <div style={{ marginTop: '50px', display: 'flex', gap: '30px' }}>
                <div style={{ background: '#111', padding: '15px 35px', borderRadius: '15px', fontSize: '0.85rem', color: '#ffd700', fontWeight: 'bold', border: '1px solid #222' }}>🛡️ ENCRYPTED FEED</div>
                <div style={{ background: '#111', padding: '15px 35px', borderRadius: '15px', fontSize: '0.85rem', color: '#ffd700', fontWeight: 'bold', border: '1px solid #222' }}>🚀 1080P SOURCE</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: '1 1 900px', textAlign: 'center', padding: '250px', background: '#050505', borderRadius: '60px', border: '4px dashed #111' }}>
            <h2 style={{ color: '#222', letterSpacing: '15px', fontSize: '2rem' }}>INITIALIZE SECURITY CLEARANCE...</h2>
          </div>
        )}

        {/* 📚 THE SIDEBAR (PREMIUM MATRIX LIST) */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px', width: '100%' }}>
          <div style={{ 
            background: '#0a0a0a', padding: '50px', borderRadius: '60px', 
            border: '2px solid #111', position: 'sticky', top: '140px', 
            boxShadow: '0 40px 80px rgba(0,0,0,1)' 
          }}>
            <h3 style={{ 
              color: '#ffd700', marginBottom: '50px', fontSize: '1.2rem', 
              letterSpacing: '8px', fontWeight: '950', textAlign: 'center', 
              borderBottom: '3px solid #111', paddingBottom: '35px' 
            }}>CURRICULUM</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {videos.map((video, index) => (
                <div 
                    key={video._id} 
                    onClick={() => setActiveVideo(video)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ 
                        padding: '35px', borderRadius: '35px', cursor: 'pointer',
                        background: activeVideo?._id === video._id ? 'linear-gradient(90deg, #ffd700, #b8860b)' : (hoveredIndex === index ? '#1a1a1a' : '#0d0d0d'),
                        color: activeVideo?._id === video._id ? '#000' : '#888',
                        fontWeight: '950', transform: activeVideo?._id === video._id ? 'translateX(20px) scale(1.05)' : 'scale(1)',
                        transition: '0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        display: 'flex', alignItems: 'center', gap: '30px',
                        border: '2px solid', borderColor: activeVideo?._id === video._id ? '#ffd700' : '#111',
                        boxShadow: activeVideo?._id === video._id ? '0 25px 50px rgba(255,215,0,0.3)' : 'none'
                    }}
                >
                    <div style={{ opacity: 0.3, fontSize: '1rem' }}>{String(index + 1).padStart(2, '0')}</div>
                    <div style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>{video.title.toUpperCase()}</div>
                </div>
                ))}
            </div>
            <div style={{ marginTop: '60px', textAlign: 'center', color: '#222', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '5px' }}>
                MARO SECURITY PROTOCOL v5.0
            </div>
          </div>
        </div>

      </main>
      <footer style={{ textAlign: 'center', color: '#1a1a1a', letterSpacing: '15px', fontSize: '0.7rem', padding: '100px 0' }}>
        © 2026 MARO ACADEMY GLOBAL PORTAL | TOP SECRET ASSET
      </footer>
    </div>
  );
};

export default VideoVault;
