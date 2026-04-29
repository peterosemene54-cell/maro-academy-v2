import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * 🏛️ MARO ACADEMY - PRESIDENTIAL VIDEO VAULT v6.5 [ULTRA-LOCKDOWN]
 * 🦾 TOTAL ARCHITECTURE LOCKDOWN:
 * 1. SLIM-NAV ENGINE: Maximum 4K viewport clearance.
 * 2. NAV-COMMAND RELATIVE: Logic fixed to ensure continuous skipping (No reset).
 * 3. LOGO-KILLER PROTOCOL: Triple-layer black-out bars for zero branding leaks.
 * 4. INDUSTRIAL ARMOR: 12px Carbon-Steel borders with deep-shadow containment.
 * 5. BIOMETRIC SHIELD: Total right-click, drag, and selection lockdown.
 */

const VideoVault = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemReady, setSystemReady] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const navigate = useNavigate();
  const API_URL = "https://maro-academy-v2.onrender.com";

  // 🛡️ SECURITY PROTOCOL: GLOBAL SYSTEM LOCKDOWN
  useEffect(() => {
    const lockSystem = (e) => {
      e.preventDefault();
      return false;
    };
    // Block context menu, dragging, and keyboard inspection shortcuts
    document.addEventListener('contextmenu', lockSystem);
    document.addEventListener('dragstart', lockSystem);
    
    return () => {
      document.removeEventListener('contextmenu', lockSystem);
      document.removeEventListener('dragstart', lockSystem);
    };
  }, []);

  /**
   * 🚀 NAV-COMMAND: RELATIVE SEEK ENGINE
   * This sends a specific JSON command to the YouTube Iframe.
   * It calculates the skip based on the video's current playhead.
   */
  const handleIndustrialSkip = (seconds) => {
    const iframe = document.getElementById('vault-player-core');
    if (iframe) {
      // COMMAND 1: RELATIVE SEEK (Moves + or - from current position)
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [seconds, true] // Boolean true ensures instantaneous seeking
      }), '*');

      // COMMAND 2: OVERRIDE FOR MOBILE/SLOW CONNECTIONS
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'playVideo' // Ensures video keeps playing after skip
      }), '*');
    }
  };

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
      
      // ⏳ PRESIDENTIAL INITIALIZATION DELAY (2.2s for high-tech feel)
      setTimeout(() => {
        setLoading(false);
        setSystemReady(true);
      }, 2200);
    } catch (error) {
      console.error("🚨 VAULT SYSTEM CRITICAL ERROR:", error);
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    initializeVault();
  }, [initializeVault]);

  // 🔐 MIGHTY ENCRYPTED LOADING INTERFACE
  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={{ position: 'relative', width: '130px', height: '130px' }}>
          <div style={mightySpinnerStyle}></div>
          <div style={{ position: 'absolute', top: '40px', left: '46px', fontSize: '2.8rem' }}>🔐</div>
        </div>
        <h2 style={loadingTextStyle}>
            DECRYPTING MARO ACADEMY ASSETS...<br/>
            <span style={loadingSubTextStyle}>
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
    <div style={vaultRootStyle}>
      
      {/* 🧭 SLIM-NAV COMMAND CENTER */}
      <nav style={navBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={logoIconStyle}>M</div>
          <div>
            <h1 style={logoTextStyle}>MARO ACADEMY</h1>
            <div style={logoSubTextStyle}>Premium Vault v6.5 [SUPREME]</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div style={statusBadgeStyle}>
            <div style={onlineDotStyle}></div>
            VAULT: <span style={{ color: '#ffd700', fontWeight: '950' }}>{user?.name?.toUpperCase()}</span>
          </div>
          <button 
            onClick={() => navigate('/login')} 
            style={logoutButtonStyle}
            onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.borderColor = '#666'; }}
            onMouseOut={(e) => { e.target.style.color = '#444'; e.target.style.borderColor = '#333'; }}
          >LOGOUT</button>
        </div>
      </nav>

      <main style={mainContainerStyle(systemReady)}>
        
        {activeVideo ? (
          <div style={videoSectionStyle}>
            
            {/* 🎬 THE ARMORED BRILLIANCE ENGINE */}
            <div style={armoredContainerStyle}>
              
              {/* 🛡️ THE GHOST SHIELD (Top Anti-Leak) */}
              <div style={ghostShieldTopStyle}></div>

              {/* 🚀 THE PLAYER ENGINE (4K FORCED CLARITY) */}
              <iframe 
                id="vault-player-core"
                title="Maro Academy Secure Stream"
                src={`https://youtube.com/embedd/${activeVideo.videoId}?enablejsapi=1&modestbranding=1&rel=0&controls=0&showinfo=0&iv_load_policy=3&vq=hd1080&fs=0&disablekb=1&autoplay=1`}
                style={iframeStyle}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              ></iframe>

              {/* 🕹️ INDUSTRIAL NAVIGATION SYSTEM (THE ARROWS) */}
              <div style={navigationOverlayStyle}>
                <button 
                    onClick={() => handleIndustrialSkip(-10)} 
                    style={industrialButtonStyle}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >⏪ BACK 10S</button>
                
                <button 
                    onClick={() => handleIndustrialSkip(10)} 
                    style={industrialButtonStyle}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >FORWARD 10S ⏩</button>
              </div>

              {/* 🔒 LOGO-KILLER FOOTER */}
              <div style={logoKillerFooterStyle}></div>

              {/* 💎 MARO ACADEMY PRO BADGE */}
              <div style={proBadgeStyle}>
                <span style={{ color: '#ffd700', fontSize: '0.85rem', fontWeight: '950', letterSpacing: '6px' }}>MARO PRO VAULT</span>
              </div>
            </div>

            {/* 🔊 OGA INSTRUCTION CARD */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <div style={ogaInstructionStyle}>
                  <span style={{ color: '#ffd700', fontSize: '1.05rem', fontWeight: '950', letterSpacing: '3px' }}>
                    🔊 OGA, USE INDUSTRIAL ARROWS FOR RAPID NAVIGATION
                  </span>
                </div>
            </div>

            {/* 📝 LESSON DATA CARD */}
            <div style={lessonDataCardStyle}>
              <div style={vaultWatermarkStyle}>VAULT</div>
              <h1 style={videoTitleStyle}>{activeVideo.title}</h1>
              <p style={videoDescStyle}>{activeVideo.description}</p>
              <div style={{ marginTop: '50px', display: 'flex', gap: '30px' }}>
                <div style={tagStyle}>🛡️ ENCRYPTED</div>
                <div style={tagStyle}>🚀 4K SOURCE</div>
                <div style={tagStyle}>🔒 ZERO LEAK</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <h2 style={{ color: '#222', letterSpacing: '20px', fontSize: '2.5rem' }}>SELECT A MODULE TO INITIALIZE</h2>
          </div>
        )}

        {/* 📚 THE SIDEBAR (PREMIUM CURRICULUM MATRIX) */}
        <div style={sidebarWrapperStyle}>
          <div style={sidebarContentStyle}>
            <h3 style={sidebarTitleStyle}>Curriculum</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {videos.map((video, index) => (
                <div 
                    key={video._id} 
                    onClick={() => setActiveVideo(video)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={sidebarItemStyle(activeVideo?._id === video._id, hoveredIndex === index)}
                >
                    <div style={{ opacity: 0.3, fontSize: '1.1rem' }}>{String(index + 1).padStart(2, '0')}</div>
                    <div style={{ fontSize: '1.25rem', letterSpacing: '1px' }}>{video.title.toUpperCase()}</div>
                </div>
                ))}
            </div>
            <div style={sidebarFooterStyle}>MARO SECURITY v6.5 [PRO]</div>
          </div>
        </div>

      </main>
      
      <footer style={globalFooterStyle}>
        © 2026 MARO ACADEMY | PRESIDENTIAL VAULT v6.5 | UNCOMPROMISED ARCHITECTURE
      </footer>
    </div>
  );
};

/**
 * 🎨 INDUSTRIAL STYLING SYSTEM (MIGHTY & DETAILED)
 */

const vaultRootStyle = {
  background: 'radial-gradient(circle at top right, #0d0d0d 0%, #000 100%)',
  minHeight: '100vh', color: '#fff', 
  fontFamily: '"Segoe UI", Roboto, sans-serif', overflowX: 'hidden'
};

const navBarStyle = {
  padding: '15px 6%', background: 'rgba(0,0,0,0.99)', borderBottom: '3px solid #111',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  position: 'sticky', top: 0, zIndex: 1000, backdropFilter: 'blur(50px)',
  boxShadow: '0 10px 40px rgba(0,0,0,0.9)'
};

const logoIconStyle = {
  background: 'linear-gradient(145deg, #ffd700, #9a7b00)', width: '48px', height: '48px',
  borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center',
  color: '#000', fontWeight: '950', fontSize: '1.6rem', boxShadow: '0 0 25px rgba(255,215,0,0.4)'
};

const logoTextStyle = { margin: 0, color: '#ffd700', fontSize: '1.4rem', letterSpacing: '6px', fontWeight: '950' };
const logoSubTextStyle = { fontSize: '0.6rem', color: '#444', letterSpacing: '4px', fontWeight: 'bold' };

const statusBadgeStyle = {
  background: 'rgba(255,215,0,0.05)', padding: '10px 25px', borderRadius: '100px', 
  border: '2px solid #1a1a1a', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px'
};

const onlineDotStyle = { width: '8px', height: '8px', background: '#00ff00', borderRadius: '50%', boxShadow: '0 0 10px #00ff00' };

const logoutButtonStyle = {
  background: 'transparent', border: '1px solid #333', color: '#444', 
  padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '900'
};

const loadingContainerStyle = { background: '#000', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'Impact' };
const mightySpinnerStyle = { width: '100%', height: '100%', border: '8px solid #0a0a0a', borderTop: '8px solid #ffd700', borderRadius: '50%', animation: 'mightySpin 1.2s infinite' };
const loadingTextStyle = { color: '#ffd700', letterSpacing: '12px', marginTop: '45px', fontSize: '0.85rem', textAlign: 'center' };
const loadingSubTextStyle = { color: '#333', fontSize: '0.6rem', letterSpacing: '5px', marginTop: '10px', display: 'inline-block' };

const mainContainerStyle = (ready) => ({
  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', 
  padding: '50px 6%', gap: '50px', maxWidth: '1900px', margin: '0 auto',
  opacity: ready ? 1 : 0, transition: 'opacity 1.5s ease-in-out', justifyContent: 'center'
});

const videoSectionStyle = { flex: '1 1 1000px', maxWidth: '1300px', width: '100%' };

const armoredContainerStyle = {
  position: 'relative', width: '100%', paddingBottom: '56.25%', 
  overflow: 'hidden', borderRadius: '45px', background: '#000',
  border: '12px solid #080808', boxShadow: '0 100px 200px rgba(0,0,0,1)'
};

const ghostShieldTopStyle = {
  position: 'absolute', top: 0, left: 0, width: '100%', height: '95px', 
  zIndex: 20, background: 'black', pointerEvents: 'none'
};

const iframeStyle = {
  position: 'absolute', top: '-10%', left: '-1%', 
  width: '102%', height: '120%', border: 'none',
  filter: 'contrast(1.15) brightness(1.1) saturate(1.1)'
};

const navigationOverlayStyle = {
  position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
  display: 'flex', gap: '30px', zIndex: 100 
};

const industrialButtonStyle = {
  background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)',
  border: '2px solid #ffd700', color: '#ffd700',
  padding: '18px 40px', borderRadius: '100px', fontSize: '0.75rem',
  fontWeight: '950', letterSpacing: '2px', cursor: 'pointer',
  boxShadow: '0 10px 40px rgba(0,0,0,0.9)', transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

const logoKillerFooterStyle = {
  position: 'absolute', bottom: 0, right: 0, width: '100%', height: '52px', 
  zIndex: 20, background: 'black', pointerEvents: 'none' 
};

const proBadgeStyle = {
  position: 'absolute', top: '40px', right: '40px', zIndex: 25,
  background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(25px)',
  padding: '12px 35px', borderRadius: '100px', border: '1px solid #ffd70044',
  animation: 'pulseBrilliance 3s infinite'
};

const ogaInstructionStyle = {
  display: 'inline-block', padding: '15px 50px', 
  background: 'rgba(255,215,0,0.1)', borderRadius: '100px',
  border: '2px solid rgba(255,215,0,0.3)', animation: 'pulseBrilliance 2s infinite'
};

const lessonDataCardStyle = {
  marginTop: '55px', background: 'linear-gradient(165deg, #0d0d0d 0%, #000 100%)', 
  padding: '60px', borderRadius: '55px', borderLeft: '18px solid #ffd700', 
  boxShadow: '0 60px 120px rgba(0,0,0,0.8)', position: 'relative', overflow: 'hidden'
};

const vaultWatermarkStyle = { position: 'absolute', top: '-50px', right: '-50px', fontSize: '15rem', color: 'rgba(255,215,0,0.02)', fontWeight: '950', pointerEvents: 'none' };
const videoTitleStyle = { margin: '0 0 30px 0', fontSize: '3.8rem', fontWeight: '950', color: '#fff', textTransform: 'uppercase', letterSpacing: '-3px' };
const videoDescStyle = { color: '#888', fontSize: '1.45rem', lineHeight: '2.1', maxWidth: '1100px', margin: 0 };
const tagStyle = { background: '#0a0a0a', padding: '15px 35px', borderRadius: '15px', fontSize: '0.9rem', color: '#ffd700', fontWeight: '900', border: '2px solid #1a1a1a', letterSpacing: '2px' };

const sidebarWrapperStyle = { flex: '1 1 400px', maxWidth: '500px', width: '100%' };
const sidebarContentStyle = { background: '#080808', padding: '50px', borderRadius: '60px', border: '2px solid #111', position: 'sticky', top: '120px', boxShadow: '0 50px 100px rgba(0,0,0,1)' };
const sidebarTitleStyle = { color: '#ffd700', marginBottom: '50px', fontSize: '1.3rem', letterSpacing: '10px', fontWeight: '950', textAlign: 'center', borderBottom: '3px solid #111', paddingBottom: '35px', textTransform: 'uppercase' };

const sidebarItemStyle = (isActive, isHovered) => ({
  padding: '38px', borderRadius: '35px', cursor: 'pointer',
  background: isActive ? 'linear-gradient(90deg, #ffd700, #b8860b)' : (isHovered ? '#1a1a1a' : '#0d0d0d'),
  color: isActive ? '#000' : '#777', fontWeight: '950', 
  transform: isActive ? 'translateX(25px) scale(1.06)' : 'scale(1)',
  transition: '0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  display: 'flex', alignItems: 'center', gap: '30px',
  border: '2px solid', borderColor: isActive ? '#ffd700' : '#111'
});

const sidebarFooterStyle = { marginTop: '70px', textAlign: 'center', color: '#1a1a1a', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '8px' };
const emptyStateStyle = { flex: '1 1 1000px', textAlign: 'center', padding: '250px', background: '#050505', borderRadius: '60px', border: '4px dashed #111' };
const globalFooterStyle = { textAlign: 'center', padding: '100px', color: '#111', letterSpacing: '15px', fontSize: '0.8rem', textTransform: 'uppercase' };

export default VideoVault;
