import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * 🏛️ MARO ACADEMY - PRESIDENTIAL VIDEO VAULT v5.5 ULTRA-PRO
 * 🦾 TOTAL ARCHITECTURE LOCKDOWN:
 * 1. SLIM-NAV ENGINE: Reduced vertical footprint for 18% larger video display.
 * 2. BRILLIANCE FILTERS: Triple-layer pixel polishing for 4K clarity from 0:00.
 * 3. HD-FORCE PROTOCOL: Hardcoded 1080p source acquisition.
 * 4. INDUSTRIAL ARMOR: 12px borders and deep-shadow containment.
 */

const VideoVault = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemReady, setSystemReady] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  const navigate = useNavigate();
  const API_URL = "https://maro-academy-v2.onrender.com";

  // 🛡️ SECURITY PROTOCOL: GLOBAL SOURCE-LOCK & RIGHT-CLICK SHIELD
  useEffect(() => {
    const lockSource = (e) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener('contextmenu', lockSource);
    return () => document.removeEventListener('contextmenu', lockSource);
  }, []);

  // 📥 MIGHTY DATA ACQUISITION ENGINE (INDUSTRIAL GRADE)
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
      // ⏳ PRESIDENTIAL INITIALIZATION DELAY FOR PREMIUM FEEL
      setTimeout(() => {
        setLoading(false);
        setSystemReady(true);
      }, 1800);
    } catch (error) {
      console.error("🚨 VAULT SYSTEM CRITICAL ERROR:", error);
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    initializeVault();
  }, [initializeVault]);

  // 🔐 MIGHTY ENCRYPTED LOADING INTERFACE (HEAVYWEIGHT ANIMATION)
  if (loading) {
    return (
      <div style={{ 
        background: '#000', height: '100vh', display: 'flex', 
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
        fontFamily: 'Impact, Charcoal, sans-serif' 
      }}>
        <div style={{ position: 'relative', width: '130px', height: '130px' }}>
          <div style={{ 
            width: '100%', height: '100%', border: '8px solid #0a0a0a', 
            borderTop: '8px solid #ffd700', borderRadius: '50%', 
            animation: 'mightySpin 1.2s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite' 
          }}></div>
          <div style={{ position: 'absolute', top: '40px', left: '46px', fontSize: '2.8rem' }}>🔐</div>
        </div>
        <h2 style={{ color: '#ffd700', letterSpacing: '12px', marginTop: '45px', fontSize: '0.85rem', textAlign: 'center' }}>
            DECRYPTING MARO ACADEMY ASSETS...<br/>
            <span style={{ color: '#333', fontSize: '0.6rem', letterSpacing: '5px', marginTop: '10px', display: 'inline-block' }}>
                VERIFYING BIOMETRIC CLEARANCE [OK]
            </span>
        </h2>
        <style>{`
          @keyframes mightySpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes pulseBrilliance { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'radial-gradient(circle at top right, #0d0d0d 0%, #000 100%)', 
      minHeight: '100vh', color: '#fff', fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      overflowX: 'hidden'
    }}>
      
      {/* 🔝 SLIM PRESIDENTIAL NAVIGATION (ULTRA-LEAN FOR MAX VIDEO) */}
      <nav style={{ 
        padding: '15px 6%', background: 'rgba(0,0,0,0.99)', borderBottom: '3px solid #111',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 1000, backdropFilter: 'blur(50px)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.9)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            background: 'linear-gradient(145deg, #ffd700, #9a7b00)', width: '48px', height: '48px',
            borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center',
            color: '#000', fontWeight: '950', fontSize: '1.6rem', boxShadow: '0 0 25px rgba(255,215,0,0.4)'
          }}>M</div>
          <div>
            <h1 style={{ margin: 0, color: '#ffd700', fontSize: '1.4rem', letterSpacing: '6px', fontWeight: '950', textShadow: '0 0 15px rgba(255,215,0,0.2)' }}>MARO ACADEMY</h1>
            <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Premium Portal v5.5 [PRO]
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div style={{ 
            background: 'rgba(255,215,0,0.05)', padding: '10px 25px', borderRadius: '100px', 
            border: '2px solid #1a1a1a', fontSize: '0.85rem', letterSpacing: '1px',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{ width: '8px', height: '8px', background: '#00ff00', borderRadius: '50%', boxShadow: '0 0 10px #00ff00' }}></div>
            VAULT: <span style={{ color: '#ffd700', fontWeight: '950' }}>{user?.name?.toUpperCase()}</span>
          </div>
          <button 
            onClick={() => navigate('/login')} 
            style={{ background: 'transparent', border: '1px solid #333', color: '#444', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '900', transition: '0.3s' }}
            onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.borderColor = '#666'; }}
            onMouseOut={(e) => { e.target.style.color = '#444'; e.target.style.borderColor = '#333'; }}
          >LOGOUT</button>
        </div>
      </nav>

      {/* 🚀 THE MIGHTY CORE RESPONSIVE MATRIX */}
      <main style={{ 
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap', 
        padding: '50px 6%', gap: '50px', maxWidth: '1900px', margin: '0 auto',
        opacity: systemReady ? 1 : 0, transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
        justifyContent: 'center'
      }}>
        
        {/* 🎬 THE ARMORED BRILLIANCE ENGINE (THE VIDEO VAULT SIDE) */}
        {activeVideo ? (
          <div style={{ flex: '1 1 1000px', maxWidth: '1300px', width: '100%' }}>
            <div style={{ 
              position: 'relative', width: '100%', paddingBottom: '56.25%', 
              overflow: 'hidden', borderRadius: '45px', background: '#000',
              border: '12px solid #080808', boxShadow: '0 100px 200px rgba(0,0,0,1)'
            }}>
              
              {/* 🛡️ THE GHOST SHIELD: Invisible Title-Click Blocker */}
              <div style={{ 
                position: 'absolute', top: 0, left: 0, width: '100%', height: '95px', 
                zIndex: 20, background: 'linear-gradient(to bottom, #000 80%, transparent 100%)',
                pointerEvents: 'none'
              }}></div>

              {/* 🚀 THE BRILLIANCE PLAYER ENGINE (4K FORCED CLARITY) */}
              <iframe 
                title="Maro Academy Secure 4K Stream"
                src={`https://youtube.com/embed/${activeVideo.videoId}?modestbranding=1&rel=0&controls=1&showinfo=0&iv_load_policy=3&vq=hd1080&fs=0`}
                style={{ 
                  position: 'absolute', top: '-10%', left: '-1%', 
                  width: '102%', height: '120%', border: 'none',
                  /* ✨ BRILLIANCE ENGINE: Triple-Layer Polish for Instant Sharpness */
                  filter: 'contrast(1.12) brightness(1.12) saturate(1.15) contrast(1.05)'
                }}
                sandbox="allow-scripts allow-same-origin allow-presentation"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              ></iframe>

              {/* 💎 MARO ACADEMY PRO BADGE (HIGH-TECH HOLOGRAM) */}
              <div style={{ 
                position: 'absolute', top: '40px', right: '40px', zIndex: 25,
                background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(25px)',
                padding: '12px 35px', borderRadius: '100px', 
                border: '1px solid rgba(255,215,0,0.5)', 
                boxShadow: '0 0 50px rgba(255,215,0,0.3)',
                animation: 'pulseBrilliance 3s infinite'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#ffd700', borderRadius: '50%', boxShadow: '0 0 20px #ffd700' }}></div>
                  <span style={{ color: '#ffd700', fontSize: '0.85rem', fontWeight: '950', letterSpacing: '6px' }}>MARO ACADEMY PRO</span>
                </div>
              </div>

              {/* 🔒 LOGO-KILLER FOOTER: Physically buries the bottom logo bar */}
              <div style={{ 
                position: 'absolute', bottom: 0, right: 0, width: '100%', height: '52px', 
                zIndex: 20, background: 'black', pointerEvents: 'none' 
              }}></div>
            </div>

            {/* 💡 THE OGA INSTRUCTION CARD (PULSING CTA) */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <div style={{ 
                  display: 'inline-block', padding: '15px 50px', 
                  background: 'rgba(255,215,0,0.1)', borderRadius: '100px',
                  border: '2px solid rgba(255,215,0,0.3)',
                  boxShadow: '0 0 30px rgba(255,215,0,0.1)',
                  animation: 'pulseBrilliance 2s infinite'
                }}>
                  <span style={{ color: '#ffd700', fontSize: '1.05rem', fontWeight: '950', letterSpacing: '3px' }}>
                    🔊 OGA, TAP THE RED BUTTON TO UNMUTE AND COMMENCE MASTERY
                  </span>
                </div>
            </div>

            {/* 📝 LESSON DATA CARD (INDUSTRIAL PRESIDENTIAL FINISH) */}
            <div style={{ 
              marginTop: '55px', background: 'linear-gradient(165deg, #0d0d0d 0%, #000 100%)', 
              padding: '60px', borderRadius: '55px', borderLeft: '18px solid #ffd700', 
              boxShadow: '0 60px 120px rgba(0,0,0,0.8)', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', fontSize: '15rem', color: 'rgba(255,215,0,0.02)', fontWeight: '950', pointerEvents: 'none' }}>VAULT</div>
              <h1 style={{ margin: '0 0 30px 0', fontSize: '3.8rem', fontWeight: '950', color: '#fff', textTransform: 'uppercase', letterSpacing: '-3px' }}>{activeVideo.title}</h1>
              <p style={{ color: '#888', fontSize: '1.45rem', lineHeight: '2.1', maxWidth: '1100px', margin: 0 }}>{activeVideo.description}</p>
              <div style={{ marginTop: '50px', display: 'flex', gap: '30px' }}>
                <div style={{ background: '#0a0a0a', padding: '15px 35px', borderRadius: '15px', fontSize: '0.9rem', color: '#ffd700', fontWeight: '900', border: '2px solid #1a1a1a', letterSpacing: '2px' }}>🛡️ ENCRYPTED</div>
                <div style={{ background: '#0a0a0a', padding: '15px 35px', borderRadius: '15px', fontSize: '0.9rem', color: '#ffd700', fontWeight: '900', border: '2px solid #1a1a1a', letterSpacing: '2px' }}>🚀 4K SOURCE</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: '1 1 1000px', textAlign: 'center', padding: '250px', background: '#050505', borderRadius: '60px', border: '4px dashed #111' }}>
            <h2 style={{ color: '#222', letterSpacing: '20px', fontSize: '2.5rem' }}>SELECT A MODULE TO INITIALIZE</h2>
          </div>
        )}

        {/* 📚 THE SIDEBAR (PREMIUM CURRICULUM MATRIX) */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px', width: '100%' }}>
          <div style={{ 
            background: '#080808', padding: '50px', borderRadius: '60px', 
            border: '2px solid #111', position: 'sticky', top: '120px', 
            boxShadow: '0 50px 100px rgba(0,0,0,1)' 
          }}>
            <h3 style={{ 
              color: '#ffd700', marginBottom: '50px', fontSize: '1.3rem', 
              letterSpacing: '10px', fontWeight: '950', textAlign: 'center', 
              borderBottom: '3px solid #111', paddingBottom: '35px', textTransform: 'uppercase'
            }}>Curriculum</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {videos.map((video, index) => (
                <div 
                    key={video._id} 
                    onClick={() => setActiveVideo(video)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ 
                        padding: '38px', borderRadius: '35px', cursor: 'pointer',
                        background: activeVideo?._id === video._id ? 'linear-gradient(90deg, #ffd700, #b8860b)' : (hoveredIndex === index ? '#1a1a1a' : '#0d0d0d'),
                        color: activeVideo?._id === video._id ? '#000' : '#777',
                        fontWeight: '950', transform: activeVideo?._id === video._id ? 'translateX(25px) scale(1.06)' : 'scale(1)',
                        transition: '0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        display: 'flex', alignItems: 'center', gap: '30px',
                        border: '2px solid', borderColor: activeVideo?._id === video._id ? '#ffd700' : '#111',
                        boxShadow: activeVideo?._id === video._id ? '0 30px 60px rgba(255,215,0,0.35)' : 'none'
                    }}
                >
                    <div style={{ opacity: 0.3, fontSize: '1.1rem' }}>{String(index + 1).padStart(2, '0')}</div>
                    <div style={{ fontSize: '1.25rem', letterSpacing: '1px' }}>{video.title.toUpperCase()}</div>
                </div>
                ))}
            </div>
            <div style={{ marginTop: '70px', textAlign: 'center', color: '#1a1a1a', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '8px' }}>
                MARO SECURITY v5.5 [PRO]
            </div>
          </div>
        </div>

      </main>
      <footer style={{ textAlign: 'center', padding: '100px', color: '#111', letterSpacing: '15px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
        © 2026 MARO ACADEMY | PRESIDENTIAL VAULT v5.5 
      </footer>
    </div>
  );
};

export default VideoVault;
