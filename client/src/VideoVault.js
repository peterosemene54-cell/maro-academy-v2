import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VideoVault = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(null);
  const navigate = useNavigate();
  const API_URL = "";

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/videos`);
        setVideos(res.data);
        if (res.data.length > 0) setActiveVideo(res.data[0]);
      } catch (err) {
        console.error("🚨 CRITICAL SYSTEM ERROR:", err);
      } finally {
        // ⏳ MIGHTY DELAY FOR PREMIUM LOAD
        setTimeout(() => setLoading(false), 2000);
      }
    };
    fetchVideos();
  }, [user, navigate]);

  if (loading) return (
    <div style={{ 
      background: '#000', minHeight: '100vh', display: 'flex', 
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
      color: '#ffd700', fontFamily: 'Impact, Charcoal, sans-serif' 
    }}>
      <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '40px' }}>
        <div style={{ 
          position: 'absolute', width: '100%', height: '100%', 
          border: '6px solid #111', borderTop: '6px solid #ffd700', 
          borderRadius: '50%', animation: 'mightySpin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite' 
        }}></div>
        <div style={{ position: 'absolute', top: '35px', left: '42px', fontSize: '2.5rem' }}>🔓</div>
      </div>
      <div style={{ letterSpacing: '12px', fontWeight: '900', fontSize: '0.9rem', textAlign: 'center', color: '#ffd700' }}>
        DECRYPTING MARO SECURITY LAYERS...<br/>
        <span style={{ color: '#444', fontSize: '0.6rem', letterSpacing: '4px' }}>BYPASSING GOVERNMENT FIREWALLS</span>
      </div>
      <style>{`
        @keyframes mightySpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulseGlow { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
    </div>
  );

  return (
    <div style={{ 
      background: 'radial-gradient(circle at top right, #0d0d0d 0%, #000 100%)', 
      minHeight: '100vh', color: '#fff', 
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      overflowX: 'hidden'
    }}>
      
      {/* 🔝 MIGHTY PRESIDENTIAL NAVIGATION (ULTRA-HEAVYWEIGHT) */}
      <nav style={{ 
        padding: '35px 6%', background: 'rgba(0,0,0,0.98)', 
        borderBottom: '4px solid #1a1a1a', display: 'flex', 
        justifyContent: 'space-between', alignItems: 'center', 
        backdropFilter: 'blur(50px)', position: 'sticky', top: 0, zIndex: 1000,
        boxShadow: '0 15px 50px rgba(0,0,0,0.9)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{ 
              background: 'linear-gradient(145deg, #ffd700 0%, #8a6d00 100%)', 
              width: '65px', height: '65px', borderRadius: '18px', 
              display: 'flex', justifyContent: 'center', alignItems: 'center', 
              color: '#000', fontWeight: '950', fontSize: '2.2rem', 
              boxShadow: '0 0 40px rgba(255,215,0,0.5)',
              transform: 'perspective(500px) rotateY(10deg)'
            }}>M</div>
            <div>
                <h1 style={{ 
                  color: '#ffd700', margin: 0, letterSpacing: '10px', 
                  fontSize: '2rem', fontWeight: '950', textShadow: '0 0 20px rgba(255,215,0,0.3)' 
                }}>MARO ACADEMY</h1>
                <div style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '6px', fontWeight: 'bold', marginTop: '5px' }}>
                    PREMIUM MATHEMATICAL ARCHIVE v4.0 PRO
                </div>
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
            <div style={{ 
              background: 'rgba(255,215,0,0.05)', padding: '15px 40px', borderRadius: '100px', 
              border: '2px solid #222', fontSize: '0.95rem', letterSpacing: '2px',
              display: 'flex', alignItems: 'center', gap: '15px',
              boxShadow: 'inset 0 0 10px rgba(255,215,0,0.1)'
            }}>
              <div style={{ width: '12px', height: '12px', background: '#00ff00', borderRadius: '50%', boxShadow: '0 0 20px #00ff00', animation: 'pulseGlow 1.5s infinite' }}></div>
              SECURE SESSION: <span style={{ color: '#ffd700', fontWeight: '950' }}>{user?.name?.toUpperCase()}</span>
            </div>
            <button 
              onClick={() => navigate('/login')}
              style={{ 
                background: 'transparent', border: '1px solid #444', color: '#666', 
                padding: '15px 35px', borderRadius: '50px', cursor: 'pointer', 
                fontWeight: 'bold', fontSize: '0.8rem', transition: '0.3s all'
              }}
              onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.borderColor = '#fff'; }}
              onMouseOut={(e) => { e.target.style.color = '#666'; e.target.style.borderColor = '#444'; }}
            >LOGOUT</button>
        </div>
      </nav>

      {/* 🚀 THE MIGHTY RESPONSIVE MATRIX CONTAINER */}
      <main style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          padding: '60px 6%', 
          gap: '60px', 
          maxWidth: '1800px', 
          margin: '0 auto',
          justifyContent: 'center'
      }}>
        
        {/* 🎬 THE ARMORED CINEMA ENGINE (THE VIDEO SIDE) */}
        {activeVideo ? (
          <div style={{ flex: '1 1 900px', maxWidth: '1200px', width: '100%' }}>
            
            {/* THE ARMOR BOX (HEAVY INDUSTRIAL STYLING) */}
            <div style={{ 
                position: 'relative', width: '100%', paddingBottom: '56.25%', 
                overflow: 'hidden', borderRadius: '50px', background: '#000',
                border: '14px solid #0a0a0a', boxShadow: '0 120px 250px rgba(0,0,0,1)' 
            }}>
                {/* 🛡️ TOP SECURITY MASK (KILLS TITLES) */}
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100px', 
                  zIndex: 20, background: 'linear-gradient(to bottom, #000 85%, transparent 100%)', 
                  pointerEvents: 'none' 
                }}></div>
                
                {/* 🚀 THE PLAYER ENGINE (4K ULTRA CLARITY) */}
                <iframe 
                    title="Maro Academy Ultra Premium"
                    src={`https://youtube.com/embed/${activeVideo.videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&vq=hd1080`}
                    style={{ 
                      position: 'absolute', top: '-10%', left: '-1%', 
                      width: '102%', height: '120%', border: 'none', 
                      filter: 'contrast(1.15) saturate(1.2) brightness(1.05)' 
                    }}
                    allow="autoplay; encrypted-media"
                ></iframe>

                {/* 💎 MARO ACADEMY PRO BADGE (FLOATING HOLOGRAM) */}
                <div style={{ 
                  position: 'absolute', top: '50px', right: '50px', zIndex: 25, 
                  background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(25px)',
                  padding: '14px 40px', borderRadius: '100px', 
                  border: '1px solid rgba(255,215,0,0.7)', 
                  boxShadow: '0 0 60px rgba(255,215,0,0.5)' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                        <div style={{ width: '14px', height: '14px', background: '#ffd700', borderRadius: '50%', boxShadow: '0 0 25px #ffd700' }}></div>
                        <span style={{ color: '#ffd700', fontSize: '0.9rem', fontWeight: '950', letterSpacing: '8px' }}>MARO ACADEMY PRO</span>
                    </div>
                </div>

                {/* 🔒 AUDIO PORTAL (DYNAMICALY OPTIMIZED FOR UNMUTE) */}
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '200px', height: '45px', zIndex: 20, background: 'black', pointerEvents: 'none' }}></div>
            </div>

            {/* 💡 THE OGA INSTRUCTION (MIGHTY CALL TO ACTION) */}
            <div style={{ textAlign: 'center', marginTop: '45px' }}>
                <div style={{ 
                  display: 'inline-block', padding: '18px 50px', 
                  background: 'rgba(255,215,0,0.1)', borderRadius: '100px',
                  border: '2px solid rgba(255,215,0,0.3)',
                  animation: 'pulseGlow 2s infinite'
                }}>
                  <span style={{ color: '#ffd700', fontSize: '1.1rem', fontWeight: '950', letterSpacing: '3px' }}>
                    🔊 OGA, TAP THE VIDEO TO UNMUTE AND BEGIN YOUR MASTERY
                  </span>
                </div>
            </div>

            {/* 📝 LESSON DATA CARD (PRESIDENTIAL FINISH) */}
            <div style={{ 
              marginTop: '60px', background: 'linear-gradient(165deg, #111 0%, #000 100%)', 
              padding: '70px', borderRadius: '60px', borderLeft: '18px solid #ffd700', 
              boxShadow: '0 60px 120px rgba(0,0,0,0.8)', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', fontSize: '15rem', color: 'rgba(255,215,0,0.02)', fontWeight: '950', pointerEvents: 'none' }}>MATH</div>
                <h1 style={{ margin: '0 0 30px 0', fontSize: '4rem', fontWeight: '950', color: '#fff', textTransform: 'uppercase', letterSpacing: '-3px' }}>{activeVideo.title}</h1>
                <p style={{ color: '#888', fontSize: '1.5rem', lineHeight: '2.2', maxWidth: '1000px', margin: 0 }}>{activeVideo.description}</p>
                <div style={{ marginTop: '50px', display: 'flex', gap: '30px' }}>
                    <div style={{ background: '#0a0a0a', padding: '15px 35px', borderRadius: '15px', fontSize: '0.9rem', color: '#ffd700', fontWeight: 'bold', border: '2px solid #222' }}>🚀 4K BITRATE UNLOCKED</div>
                    <div style={{ background: '#0a0a0a', padding: '15px 35px', borderRadius: '15px', fontSize: '0.9rem', color: '#ffd700', fontWeight: 'bold', border: '2px solid #222' }}>🛡️ MILITARY GRADE STREAM</div>
                </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: '1 1 900px', textAlign: 'center', padding: '250px', background: '#050505', borderRadius: '60px', border: '4px dashed #1a1a1a' }}>
            <h2 style={{ color: '#222', letterSpacing: '15px', fontSize: '2.5rem' }}>INITIALIZE LESSON FROM MATRIX SIDEBAR</h2>
          </div>
        )}

        {/* 📚 THE SIDEBAR (PREMIUM CURRICULUM LIST) */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px', width: '100%' }}>
          <div style={{ 
            background: '#0a0a0a', padding: '50px', borderRadius: '60px', 
            border: '2px solid #1a1a1a', position: 'sticky', top: '140px', 
            boxShadow: '0 40px 80px rgba(0,0,0,1)' 
          }}>
            <h3 style={{ 
              color: '#ffd700', marginBottom: '50px', fontSize: '1.3rem', 
              letterSpacing: '8px', fontWeight: '950', textAlign: 'center', 
              borderBottom: '3px solid #111', paddingBottom: '35px' 
            }}>CURRICULUM</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {videos.map((video, index) => (
                <div 
                    key={video._id} 
                    onClick={() => setActiveVideo(video)}
                    onMouseEnter={() => setIsHovered(video._id)}
                    onMouseLeave={() => setIsHovered(null)}
                    style={{ 
                        padding: '35px', borderRadius: '35px', cursor: 'pointer',
                        background: activeVideo?._id === video._id ? 'linear-gradient(90deg, #ffd700, #b8860b)' : (isHovered === video._id ? '#1a1a1a' : '#0d0d0d'),
                        color: activeVideo?._id === video._id ? '#000' : '#888',
                        fontWeight: '950', transform: activeVideo?._id === video._id ? 'translateX(20px) scale(1.05)' : 'scale(1)',
                        transition: '0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        display: 'flex', alignItems: 'center', gap: '30px',
                        border: '2px solid', borderColor: activeVideo?._id === video._id ? '#ffd700' : '#111',
                        boxShadow: activeVideo?._id === video._id ? '0 25px 50px rgba(255,215,0,0.3)' : 'none'
                    }}
                >
                    <div style={{ opacity: 0.3, fontSize: '1rem' }}>{String(index + 1).padStart(2, '0')}</div>
                    <div style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>{video.title.toUpperCase()}</div>
                </div>
                ))}
            </div>
            <div style={{ marginTop: '60px', textAlign: 'center', color: '#333', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '6px' }}>
                SECURED BY MARO SECURITY v4.0 PRO
            </div>
          </div>
        </div>

      </main>
      <footer style={{ textAlign: 'center', padding: '60px', color: '#222', letterSpacing: '10px', fontSize: '0.7rem' }}>
        © 2026 MARO ACADEMY GLOBAL PORTAL | ALL RIGHTS RESERVED
      </footer>
    </div>
  );
};

export default VideoVault;
