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
        if (res.data.length > 0) setActiveVideo(res.data[0]);
      } catch (err) { console.error("Vault Error:", err); }
      finally { setLoading(false); }
    };
    fetchVideos();
  }, [user, navigate]);

  if (loading) return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffd700', fontFamily: 'Arial' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔐</div>
        <div style={{ letterSpacing: '3px', fontWeight: 'bold' }}>VERIFYING PREMIUM ACCESS...</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      
      {/* 🔝 MIGHTY TOP NAVIGATION */}
      <div style={{ padding: '25px 50px', background: 'rgba(0,0,0,0.8)', borderBottom: '2px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#ffd700', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#000', fontWeight: 'bold' }}>M</div>
            <h2 style={{ color: '#ffd700', margin: 0, letterSpacing: '4px', fontSize: '1.2rem', fontWeight: '900' }}>MARO ACADEMY VAULT</h2>
        </div>
        <div style={{ background: '#111', padding: '10px 20px', borderRadius: '50px', border: '1px solid #333', fontSize: '0.85rem' }}>
          🎓 STUDENT: <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{user?.name?.toUpperCase()}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', padding: '40px', gap: '40px', maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* 🎬 THE ARMORED CINEMA SECTION */}
        {activeVideo ? (
          <div style={{ flex: '2.8', minWidth: '350px' }}>
            
            <div style={{ 
                position: 'relative', width: '100%', paddingBottom: '56.25%', 
                overflow: 'hidden', borderRadius: '30px', background: '#000',
                border: '8px solid #111', boxShadow: '0 50px 100px rgba(0,0,0,0.9)' 
            }}>
                
                {/* 🛡️ TOP SECURITY MASK (Kills Title & Share) */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '80px', zIndex: 20, background: 'linear-gradient(to bottom, #000 60%, transparent 100%)', pointerEvents: 'none' }}></div>
                
                {/* 🚀 THE GHOST PLAYER (Deep Overscan -15% kills logos) */}
                <iframe 
                    title="Maro Academy Ultra Premium"
                    src={`https://youtube.com{activeVideo.videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=0`}
                    style={{ position: 'absolute', top: '-15%', left: '-2%', width: '104%', height: '135%', border: 'none' }}
                    allow="autoplay; encrypted-media"
                ></iframe>

                {/* 💎 MARO ACADEMY PRO BADGE (Hologram Style) */}
                <div style={{ 
                    position: 'absolute', top: '30px', right: '30px', zIndex: 25, 
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
                    padding: '8px 22px', borderRadius: '100px', border: '1px solid rgba(255,215,0,0.4)',
                    boxShadow: '0 0 20px rgba(255,215,0,0.2)' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', background: '#ffd700', borderRadius: '50%', boxShadow: '0 0 10px #ffd700' }}></div>
                        <span style={{ color: '#ffd700', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '3px' }}>MARO ACADEMY PRO</span>
                    </div>
                </div>

                {/* 🔒 BOTTOM SECURITY MASK (Kills corner logo) */}
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: '65px', zIndex: 20, background: 'black', pointerEvents: 'none' }}></div>
            </div>

            {/* 📝 PREMIUM INFO CARD */}
            <div style={{ marginTop: '35px', background: 'linear-gradient(145deg, #0f0f0f, #050505)', padding: '40px', borderRadius: '25px', borderLeft: '8px solid #ffd700', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                <h1 style={{ margin: '0 0 15px 0', fontSize: '2.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>{activeVideo.title}</h1>
                <p style={{ color: '#777', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '800px' }}>{activeVideo.description}</p>
                <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                    <span style={{ padding: '6px 15px', background: '#222', borderRadius: '5px', fontSize: '0.8rem', color: '#ffd700' }}>✓ 4K ULTRA HD</span>
                    <span style={{ padding: '6px 15px', background: '#222', borderRadius: '5px', fontSize: '0.8rem', color: '#ffd700' }}>✓ PREMIUM AUDIO</span>
                </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: '2.8', textAlign: 'center', padding: '150px', background: '#0a0a0a', borderRadius: '30px', border: '2px dashed #222' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📚</div>
            <h2 style={{ color: '#444' }}>SELECT A LESSON TO BEGIN YOUR MASTERY</h2>
          </div>
        )}

        {/* 📚 THE SIDEBAR (Premium Lesson List) */}
        <div style={{ flex: '1', minWidth: '320px' }}>
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '30px', border: '1px solid #1a1a1a', position: 'sticky', top: '40px' }}>
            <h3 style={{ color: '#ffd700', marginBottom: '30px', fontSize: '1rem', letterSpacing: '3px', fontWeight: '900', textAlign: 'center' }}>YOUR CURRICULUM</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {videos.map((video, index) => (
                <div 
                    key={video._id} 
                    onClick={() => setActiveVideo(video)}
                    style={{ 
                    padding: '22px', borderRadius: '15px', cursor: 'pointer',
                    background: activeVideo?._id === video._id ? 'linear-gradient(90deg, #ffd700, #b8860b)' : '#111',
                    color: activeVideo?._id === video._id ? '#000' : '#888',
                    fontWeight: 'bold', transform: activeVideo?._id === video._id ? 'scale(1.03)' : 'scale(1)',
                    transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    display: 'flex', alignItems: 'center', gap: '15px',
                    boxShadow: activeVideo?._id === video._id ? '0 10px 20px rgba(255,215,0,0.2)' : 'none'
                    }}
                >
                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{String(index + 1).padStart(2, '0')}</div>
                    <div style={{ fontSize: '0.95rem' }}>{video.title.toUpperCase()}</div>
                </div>
                ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoVault;
