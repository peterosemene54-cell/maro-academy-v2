import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VideoVault = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = "https://maro-academy-v2.onrender.com";

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/videos`);
        setVideos(res.data);
        if (res.data.length > 0) setActiveVideo(res.data[0]);
      } catch (err) { console.error("Vault Error:", err); }
      finally { setLoading(false); }
    };
    fetchVideos();
  }, [user, navigate]);

  if (loading) return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffd700', fontFamily: 'Arial' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px', animation: 'pulse 2s infinite' }}>🔐</div>
        <div style={{ letterSpacing: '5px', fontWeight: '900', fontSize: '0.8rem' }}>DECRYPTING PREMIUM VAULT...</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      
      {/* 🔝 MIGHTY PRESIDENTIAL NAVIGATION */}
      <div style={{ padding: '30px 60px', background: 'rgba(0,0,0,0.95)', borderBottom: '3px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px)', sticky: 'top', zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: 'linear-gradient(145deg, #ffd700, #b8860b)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#000', fontWeight: '900', fontSize: '1.5rem', boxShadow: '0 0 20px rgba(255,215,0,0.3)' }}>M</div>
            <div>
                <h2 style={{ color: '#ffd700', margin: 0, letterSpacing: '5px', fontSize: '1.4rem', fontWeight: '900', textShadow: '0 0 10px rgba(255,215,0,0.3)' }}>MARO ACADEMY</h2>
                <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '3px', fontWeight: 'bold' }}>OFFICIAL PREMIUM PORTAL</div>
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: '#111', padding: '12px 25px', borderRadius: '100px', border: '1px solid #333', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', background: '#00ff00', borderRadius: '50%', boxShadow: '0 0 10px #00ff00' }}></div>
                SECURE SESSION: <span style={{ color: '#ffd700', fontWeight: '900' }}>{user?.name?.toUpperCase()}</span>
            </div>
            <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: '1px solid #444', color: '#888', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>LOGOUT</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', padding: '50px', gap: '50px', maxWidth: '1800px', margin: '0 auto' }}>
        
        {/* 🎬 THE ARMORED CINEMA ENGINE */}
        {activeVideo ? (
          <div style={{ flex: '3', minWidth: '400px' }}>
            
            <div style={{ 
                position: 'relative', width: '100%', paddingBottom: '56.25%', 
                overflow: 'hidden', borderRadius: '35px', background: '#000',
                border: '10px solid #111', boxShadow: '0 60px 120px rgba(0,0,0,1)' 
            }}>
                
                {/* 🛡️ SECURITY LAYER 1: TOP GRADIENT MASK (Kills Title/Share) */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '90px', zIndex: 20, background: 'linear-gradient(to bottom, #000 75%, transparent 100%)', pointerEvents: 'none' }}></div>
                
                {/* 🚀 THE GHOST PLAYER ENGINE (Optimized Clarity + Logo Burial) */}
                <iframe 
                    title="Maro Academy Ultra Premium"
                    src={`https://youtube.com/embed/${activeVideo.videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=0&vq=hd1080`}
                    style={{ 
                        position: 'absolute', 
                        top: '-9%', // 🛡️ Optimized "Sweet Spot" to hide title but keep clarity
                        left: '-1%', 
                        width: '102%', 
                        height: '118%', // 🛡️ Optimized to bury corner logo without blurring your face
                        border: 'none',
                        filter: 'contrast(1.08) brightness(1.03) saturate(1.1)' // ✨ INDUSTRIAL SHARPNESS FILTER
                    }}
                    allow="autoplay; encrypted-media"
                ></iframe>

                {/* 💎 THE MARO PRO HOLOGRAM (Authority Badge) */}
                <div style={{ 
                    position: 'absolute', top: '35px', right: '35px', zIndex: 25, 
                    background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)',
                    padding: '10px 25px', borderRadius: '100px', border: '1px solid rgba(255,215,0,0.5)',
                    boxShadow: '0 0 30px rgba(255,215,0,0.2)' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '10px', height: '10px', background: '#ffd700', borderRadius: '50%', boxShadow: '0 0 15px #ffd700' }}></div>
                        <span style={{ color: '#ffd700', fontSize: '0.8rem', fontWeight: '900', letterSpacing: '4px' }}>MARO ACADEMY PRO</span>
                    </div>
                </div>

                {/* 🔒 SECURITY LAYER 2: BOTTOM LOGO CHOKE (Kills corner YouTube icon) */}
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: '60px', zIndex: 20, background: 'black', pointerEvents: 'none' }}></div>
            </div>

            {/* 💡 THE OGA INSTRUCTION (Audio Fix) */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <span style={{ color: '#ffd700', fontSize: '0.9rem', fontWeight: 'bold', animation: 'pulse 1.5s infinite' }}> 🔊 OGA, TAP VIDEO TO UNMUTE AND LEARN! </span>
            </div>

            {/* 📝 PREMIUM INFO CARD (Heavy Industrial Design) */}
            <div style={{ marginTop: '40px', background: 'linear-gradient(160deg, #0d0d0d 0%, #050505 100%)', padding: '45px', borderRadius: '30px', borderLeft: '10px solid #ffd700', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', color: 'rgba(255,215,0,0.03)', fontWeight: '900' }}>MATH</div>
                <h1 style={{ margin: '0 0 20px 0', fontSize: '2.8rem', fontWeight: '900', color: '#fff', letterSpacing: '-1.5px', textTransform: 'uppercase' }}>{activeVideo.title}</h1>
                <p style={{ color: '#888', fontSize: '1.25rem', lineHeight: '1.9', maxWidth: '900px', margin: 0 }}>{activeVideo.description}</p>
                <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
                    <div style={{ border: '1px solid #333', padding: '10px 20px', borderRadius: '10px', fontSize: '0.7rem', color: '#ffd700', fontWeight: 'bold' }}>HD 1080P SOURCE</div>
                    <div style={{ border: '1px solid #333', padding: '10px 20px', borderRadius: '10px', fontSize: '0.7rem', color: '#ffd700', fontWeight: 'bold' }}>ENCRYPTED STREAM</div>
                </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: '3', textAlign: 'center', padding: '200px', background: '#080808', borderRadius: '40px', border: '2px dashed #1a1a1a' }}>
            <h2 style={{ color: '#333', letterSpacing: '5px' }}>SELECT A LESSON FROM THE CURRICULUM</h2>
          </div>
        )}

        {/* 📚 THE SIDEBAR (High-End Lesson Matrix) */}
        <div style={{ flex: '1.1', minWidth: '350px' }}>
          <div style={{ background: '#0a0a0a', padding: '40px', borderRadius: '35px', border: '1px solid #1a1a1a', position: 'sticky', top: '50px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <h3 style={{ color: '#ffd700', marginBottom: '35px', fontSize: '1.1rem', letterSpacing: '5px', fontWeight: '900', textAlign: 'center', borderBottom: '1px solid #222', paddingBottom: '20px' }}>CURRICULUM</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {videos.map((video, index) => (
                <div 
                    key={video._id} 
                    onClick={() => setActiveVideo(video)}
                    style={{ 
                        padding: '25px', borderRadius: '20px', cursor: 'pointer',
                        background: activeVideo?._id === video._id ? 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)' : '#111',
                        color: activeVideo?._id === video._id ? '#000' : '#888',
                        fontWeight: '900', transform: activeVideo?._id === video._id ? 'translateX(10px) scale(1.02)' : 'scale(1)',
                        transition: 'all 0.5s cubic-bezier(0.2, 1, 0.3, 1)',
                        display: 'flex', alignItems: 'center', gap: '20px',
                        boxShadow: activeVideo?._id === video._id ? '0 15px 30px rgba(255,215,0,0.25)' : 'none',
                        border: '1px solid', borderColor: activeVideo?._id === video._id ? '#ffd700' : '#1a1a1a'
                    }}
                >
                    <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{String(index + 1).padStart(2, '0')}</div>
                    <div style={{ fontSize: '1rem', letterSpacing: '1px' }}>{video.title.toUpperCase()}</div>
                </div>
                ))}
            </div>
            <div style={{ marginTop: '40px', textAlign: 'center', color: '#444', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '2px' }}>
                🛡️ MARO ACADEMY SECURITY V2.0
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoVault;
