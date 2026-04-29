import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VideoVault = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = "https://onrender.com";

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/videos`);
        setVideos(res.data);
        if (res.data.length > 0) setActiveVideo(res.data);
      } catch (err) { console.error("CRITICAL VAULT ERROR:", err); }
      finally { 
        // ⏳ Heavyweight Delay for "Premium" Feel
        setTimeout(() => setLoading(false), 1500); 
      }
    };
    fetchVideos();
  }, [user, navigate]);

  if (loading) return (
    <div style={{ 
      background: '#000', minHeight: '100vh', display: 'flex', 
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
      color: '#ffd700', fontFamily: 'Arial Black, Gadget, sans-serif' 
    }}>
      <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '30px' }}>
        <div style={{ 
          position: 'absolute', width: '100%', height: '100%', 
          border: '4px solid #111', borderTop: '4px solid #ffd700', 
          borderRadius: '50%', animation: 'spin 1s linear infinite' 
        }}></div>
        <div style={{ position: 'absolute', top: '30px', left: '35px', fontSize: '2rem' }}>🔐</div>
      </div>
      <div style={{ letterSpacing: '10px', fontWeight: '900', fontSize: '0.8rem', textAlign: 'center' }}>
        ESTABLISHING SECURE CONNECTION...<br/>
        <span style={{ color: '#444', fontSize: '0.6rem' }}>ENCRYPTING BIOMETRICS</span>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ 
      background: 'radial-gradient(circle at top, #0a0a0a 0%, #000 100%)', 
      minHeight: '100vh', color: '#fff', 
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      overflowX: 'hidden'
    }}>
      
      {/* 🔝 MIGHTY PRESIDENTIAL NAVIGATION (ULTRA-HEAVY) */}
      <div style={{ 
        padding: '35px 80px', background: 'rgba(0,0,0,0.95)', 
        borderBottom: '4px solid #111', display: 'flex', 
        justifyContent: 'space-between', alignItems: 'center', 
        backdropFilter: 'blur(40px)', position: 'sticky', top: 0, zIndex: 1000,
        boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #ffd700 0%, #9a7b00 100%)', 
              width: '60px', height: '60px', borderRadius: '15px', 
              display: 'flex', justifyContent: 'center', alignItems: 'center', 
              color: '#000', fontWeight: '900', fontSize: '1.8rem', 
              boxShadow: '0 0 35px rgba(255,215,0,0.4)',
              transform: 'rotate(-5deg)'
            }}>M</div>
            <div>
                <h1 style={{ 
                  color: '#ffd700', margin: 0, letterSpacing: '8px', 
                  fontSize: '1.8rem', fontWeight: '900', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' 
                }}>MARO ACADEMY</h1>
                <div style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '5px', fontWeight: 'bold', marginTop: '5px' }}>
                    PREMIUM EDUCATIONAL ARCHIVE v3.0
                </div>
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{ 
              background: '#0a0a0a', padding: '15px 35px', borderRadius: '100px', 
              border: '2px solid #222', fontSize: '0.9rem', letterSpacing: '2px',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{ width: '10px', height: '10px', background: '#00ff00', borderRadius: '50%', boxShadow: '0 0 15px #00ff00' }}></div>
              VAULT ACCESS: <span style={{ color: '#ffd700', fontWeight: '900' }}>{user?.name?.toUpperCase()}</span>
            </div>
            <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: '1px solid #333', color: '#444', padding: '12px 25px', borderRadius: '50px', cursor: 'pointer', transition: '0.3s', fontWeight: 'bold' }}>LOGOUT</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', padding: '60px', gap: '60px', maxWidth: '1920px', margin: '0 auto' }}>
        
        {/* 🎬 THE ARMORED CINEMA ENGINE (HEAVYWEIGHT VERSION) */}
        {activeVideo ? (
          <div style={{ flex: '3.5', minWidth: '500px' }}>
            <div style={{ 
                position: 'relative', width: '100%', paddingBottom: '56.25%', 
                overflow: 'hidden', borderRadius: '50px', background: '#000',
                border: '12px solid #080808', boxShadow: '0 100px 200px rgba(0,0,0,1)' 
            }}>
                {/* 🛡️ TOP SECURITY SHIELD (Hides Title/Share) */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100px', zIndex: 20, background: 'linear-gradient(to bottom, #000 85%, transparent 100%)', pointerEvents: 'none' }}></div>
                
                {/* 🚀 THE PLAYER ENGINE (MIGHTY 1080p CLARITY) */}
                <iframe 
                    title="Maro Academy Ultra Premium"
                    src={`https://youtube.com{activeVideo.videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&vq=hd1080`}
                    style={{ 
                      position: 'absolute', top: '-8%', left: '-1%', 
                      width: '102%', height: '116%', border: 'none', 
                      filter: 'contrast(1.1) saturate(1.2) brightness(1.05)' 
                    }}
                    allow="autoplay; encrypted-media"
                ></iframe>

                {/* 💎 MARO ACADEMY PRO BADGE (HIGH-TECH HOLOGRAM) */}
                <div style={{ 
                  position: 'absolute', top: '45px', right: '45px', zIndex: 25, 
                  background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
                  padding: '12px 35px', borderRadius: '100px', 
                  border: '1px solid rgba(255,215,0,0.6)', 
                  boxShadow: '0 0 50px rgba(255,215,0,0.4)' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '12px', height: '12px', background: '#ffd700', borderRadius: '50%', boxShadow: '0 0 20px #ffd700' }}></div>
                        <span style={{ color: '#ffd700', fontSize: '0.85rem', fontWeight: '950', letterSpacing: '6px' }}>MARO ACADEMY PRO</span>
                    </div>
                </div>

                {/* 🔊 THE AUDIO PORTAL (DYNAMIALLY SIZED FOR MUTE/UNMUTE ACCESS) */}
                <div style={{ 
                  position: 'absolute', bottom: 0, right: 0, width: '180px', height: '42px', 
                  zIndex: 20, background: 'black', pointerEvents: 'none' 
                }}></div>
            </div>

            {/* 💡 THE OGA INSTRUCTION (PULSING ANIMATION) */}
            <div style={{ textAlign: 'center', marginTop: '35px' }}>
                <div style={{ 
                  display: 'inline-block', padding: '15px 40px', 
                  background: 'rgba(255,215,0,0.1)', borderRadius: '50px',
                  border: '1px solid rgba(255,215,0,0.3)',
                  animation: 'pulse 2s infinite'
                }}>
                  <span style={{ color: '#ffd700', fontSize: '1rem', fontWeight: '900', letterSpacing: '2px' }}>
                    🔊 OGA, TAP THE VIDEO TO UNMUTE AND BEGIN THE LESSON
                  </span>
                </div>
            </div>

            {/* 📝 LESSON DATA CARD (ULTRA-HEAVY DESIGN) */}
            <div style={{ 
              marginTop: '50px', background: 'linear-gradient(165deg, #0d0d0d, #000)', 
              padding: '60px', borderRadius: '45px', borderLeft: '15px solid #ffd700', 
              boxShadow: '0 50px 100px rgba(0,0,0,0.7)', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', fontSize: '12rem', color: 'rgba(255,215,0,0.02)', fontWeight: '950' }}>MARO</div>
                <h1 style={{ margin: '0 0 25px 0', fontSize: '3.5rem', fontWeight: '950', color: '#fff', textTransform: 'uppercase', letterSpacing: '-2px' }}>{activeVideo.title}</h1>
                <p style={{ color: '#999', fontSize: '1.4rem', lineHeight: '2.1', maxWidth: '1000px', margin: 0 }}>{activeVideo.description}</p>
                <div style={{ marginTop: '40px', display: 'flex', gap: '25px' }}>
                    <div style={{ background: '#111', padding: '12px 25px', borderRadius: '12px', fontSize: '0.8rem', color: '#ffd700', fontWeight: 'bold', border: '1px solid #222' }}>🚀 4K BITRATE ACTIVE</div>
                    <div style={{ background: '#111', padding: '12px 25px', borderRadius: '12px', fontSize: '0.8rem', color: '#ffd700', fontWeight: 'bold', border: '1px solid #222' }}>🛡️ ENCRYPTED FEED</div>
                </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: '3.5', textAlign: 'center', padding: '250px', background: '#050505', borderRadius: '50px', border: '3px dashed #111' }}>
            <h2 style={{ color: '#222', letterSpacing: '10px', fontSize: '2rem' }}>INITIALIZE LESSON FROM SIDEBAR</h2>
          </div>
        )}

        {/* 📚 THE SIDEBAR (PREMIUM MATRIX LIST) */}
        <div style={{ flex: '1.3', minWidth: '400px' }}>
          <div style={{ 
            background: '#080808', padding: '50px', borderRadius: '50px', 
            border: '2px solid #111', position: 'sticky', top: '60px', 
            boxShadow: '0 30px 60px rgba(0,0,0,1)' 
          }}>
            <h3 style={{ 
              color: '#ffd700', marginBottom: '45px', fontSize: '1.2rem', 
              letterSpacing: '8px', fontWeight: '950', textAlign: 'center', 
              borderBottom: '2px solid #111', paddingBottom: '30px' 
            }}>CURRICULUM</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {videos.map((video, index) => (
                <div 
                    key={video._id} 
                    onClick={() => setActiveVideo(video)}
                    style={{ 
                        padding: '32px', borderRadius: '30px', cursor: 'pointer',
                        background: activeVideo?._id === video._id ? 'linear-gradient(90deg, #ffd700, #b8860b)' : '#0d0d0d',
                        color: activeVideo?._id === video._id ? '#000' : '#777',
                        fontWeight: '950', transform: activeVideo?._id === video._id ? 'translateX(15px) scale(1.05)' : 'scale(1)',
                        transition: '0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        display: 'flex', alignItems: 'center', gap: '25px',
                        boxShadow: activeVideo?._id === video._id ? '0 20px 40px rgba(255,215,0,0.3)' : 'none',
                        border: '2px solid', borderColor: activeVideo?._id === video._id ? '#ffd700' : '#111'
                    }}
                >
                    <div style={{ opacity: 0.4, fontSize: '0.9rem' }}>{String(index + 1).padStart(2, '0')}</div>
                    <div style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>{video.title.toUpperCase()}</div>
                </div>
                ))}
            </div>
            <div style={{ marginTop: '50px', textAlign: 'center', color: '#333', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '4px' }}>
                POWERED BY MARO SECURITY v3.0
            </div>
          </div>
        </div>

      </div>
      <style>{` @keyframes pulse { 0% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.02); } 100% { opacity: 0.7; transform: scale(1); } } `}</style>
    </div>
  );
};

export default VideoVault;
