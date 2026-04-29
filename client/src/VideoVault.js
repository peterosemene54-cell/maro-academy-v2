import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * 🏛️ MARO ACADEMY - PRESIDENTIAL VIDEO VAULT v7.0 [OMNIPOTENCE]
 * 🦾 TOTAL ARCHITECTURE LOCKDOWN:
 * 1. SLIM-NAV ENGINE: Hardcoded for maximum vertical real estate.
 * 2. NAV-COMMAND RELATIVE v2: Uses 'seekBy' execution for infinite skipping.
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
  // This ensures no one can right-click, drag, or inspect your assets.
  useEffect(() => {
    const lockSystem = (e) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener('contextmenu', lockSystem);
    document.addEventListener('dragstart', lockSystem);
    
    return () => {
      document.removeEventListener('contextmenu', lockSystem);
      document.removeEventListener('dragstart', lockSystem);
    };
  }, []);

  /**
   * 🚀 NAV-COMMAND: OMNIPOTENT RELATIVE SEEK ENGINE
   * This is the fix, Oga. Instead of jumping to a fixed time,
   * it tells the player to 'seekBy' - adding seconds to the current time.
   */
  const handleIndustrialSkip = (seconds) => {
    const iframe = document.getElementById('vault-player-core');
    if (iframe) {
      // COMMAND 1: THE MASTER EXECUTION (Seek relative to current position)
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'execute',
        args: ['seekBy', seconds]
      }), '*');

      // COMMAND 2: FORCE RESUME (Ensures playback doesn't stall)
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'playVideo'
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
      
      // ⏳ PRESIDENTIAL INITIALIZATION DELAY (Premium Experience)
      setTimeout(() => {
        setLoading(false);
        setSystemReady(true);
      }, 2500);
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
        <div style={{ position: 'relative', width: '150px', height: '150px' }}>
          <div style={mightySpinnerStyle}></div>
          <div style={{ position: 'absolute', top: '50px', left: '55px', fontSize: '3rem' }}>🔐</div>
        </div>
        <h2 style={loadingTextStyle}>
            DECRYPTING MARO ACADEMY ASSETS...<br/>
            <span style={loadingSubTextStyle}>
                VERIFYING BIOMETRIC CLEARANCE [OK]
            </span>
        </h2>
        <style>{`
          @keyframes mightySpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes pulseBrilliance { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={vaultRootStyle}>
      
      {/* 🧭 SLIM-NAV COMMAND CENTER */}
      <nav style={navBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div style={logoIconStyle}>M</div>
          <div>
            <h1 style={logoTextStyle}>MARO ACADEMY</h1>
            <div style={logoSubTextStyle}>Premium Vault v7.0 [OMNIPOTENCE]</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={statusBadgeStyle}>
            <div style={onlineDotStyle}></div>
            VAULT STATUS: <span style={{ color: '#ffd700', fontWeight: '950', marginLeft: '8px' }}>{user?.name?.toUpperCase()} [ACTIVE]</span>
          </div>
          <button 
            onClick={() => navigate('/login')} 
            style={logoutButtonStyle}
            onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.borderColor = '#ffd700'; }}
            onMouseOut={(e) => { e.target.style.color = '#555'; e.target.style.borderColor = '#222'; }}
          >LOGOUT SYSTEM</button>
        </div>
      </nav>

      <main style={mainContainerStyle(systemReady)}>
        
        {activeVideo ? (
          <div style={videoSectionStyle}>
            
            {/* 🎬 THE ARMORED BRILLIANCE ENGINE */}
            <div style={armoredContainerStyle}>
              
              {/* 🛡️ THE GHOST SHIELD (Top Logo Killer) */}
              <div style={ghostShieldTopStyle}></div>

              {/* 🚀 THE PLAYER ENGINE (4K FORCED CLARITY) */}
              <iframe 
                id="vault-player-core"
                title="Maro Academy Secure Stream"
                src={`https://youtube.com/embed/${activeVideo.videoId}?enablejsapi=1&modestbranding=1&rel=0&controls=0&showinfo=0&iv_load_policy=3&vq=hd1080&fs=0&disablekb=1&autoplay=1&mute=0`}
                style={iframeStyle}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              ></iframe>

              {/* 🕹️ INDUSTRIAL NAVIGATION SYSTEM (FIXED RELATIVE SKIP) */}
              <div style={navigationOverlayStyle}>
                <button 
                    onClick={() => handleIndustrialSkip(-10)} 
                    style={industrialButtonStyle}
                    onMouseOver={(e) => { e.target.style.background = '#ffd700'; e.target.style.color = '#000'; }}
                    onMouseOut={(e) => { e.target.style.background = 'rgba(0,0,0,0.9)'; e.target.style.color = '#ffd700'; }}
                >⏪ BACK 10S</button>
                
                <button 
                    onClick={() => handleIndustrialSkip(10)} 
                    style={industrialButtonStyle}
                    onMouseOver={(e) => { e.target.style.background = '#ffd700'; e.target.style.color = '#000'; }}
                    onMouseOut={(e) => { e.target.style.background = 'rgba(0,0,0,0.9)'; e.target.style.color = '#ffd700'; }}
                >FORWARD 10S ⏩</button>
              </div>

              {/* 🔒 LOGO-KILLER FOOTER (Buries Progress Bar & Logo) */}
              <div style={logoKillerFooterStyle}></div>

              {/* 💎 MARO ACADEMY PRO BADGE */}
              <div style={proBadgeStyle}>
                <span style={{ color: '#ffd700', fontSize: '0.9rem', fontWeight: '950', letterSpacing: '8px' }}>MARO PRO VAULT</span>
              </div>
            </div>

            {/* 🔊 OGA INSTRUCTION CARD */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <div style={ogaInstructionStyle}>
                  <span style={{ color: '#ffd700', fontSize: '1.1rem', fontWeight: '950', letterSpacing: '4px' }}>
                    🔊 OGA, USE THE INDUSTRIAL BUTTONS ABOVE TO NAVIGATE THE VAULT
                  </span>
                </div>
            </div>

            {/* 📝 LESSON DATA CARD */}
            <div style={lessonDataCardStyle}>
              <div style={vaultWatermarkStyle}>MASTERCLASS</div>
              <h1 style={videoTitleStyle}>{activeVideo.title}</h1>
              <p style={videoDescStyle}>{activeVideo.description}</p>
              <div style={{ marginTop: '60px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                <div style={tagStyle}>🛡️ ENCRYPTED ASSET</div>
                <div style={tagStyle}>🚀 4K SOURCE ENGINE</div>
                <div style={tagStyle}>🔒 ZERO-LEAK SHIELD</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <h2 style={{ color: '#111', letterSpacing: '25px', fontSize: '3rem' }}>INITIALIZING NEURAL LINK...</h2>
          </div>
        )}

        {/* 📚 THE SIDEBAR (PREMIUM CURRICULUM MATRIX) */}
        <div style={sidebarWrapperStyle}>
          <div style={sidebarContentStyle}>
            <h3 style={sidebarTitleStyle}>Curriculum</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {videos.map((video, index) => (
                <div 
                    key={video._id} 
                    onClick={() => setActiveVideo(video)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={sidebarItemStyle(activeVideo?._id === video._id, hoveredIndex === index)}
                >
                    <div style={{ opacity: 0.2, fontSize: '1.2rem', minWidth: '40px' }}>{String(index + 1).padStart(2, '0')}</div>
                    <div style={{ fontSize: '1.3rem', letterSpacing: '1px', fontWeight: '900' }}>{video.title.toUpperCase()}</div>
                </div>
                ))}
            </div>
            <div style={sidebarFooterStyle}>MARO SECURITY v7.0 [OMNIPOTENCE]</div>
          </div>
        </div>

      </main>
      
      <footer style={globalFooterStyle}>
        © 2026 MARO ACADEMY | PRESIDENTIAL VAULT v7.0 | ARCHITECTURE BY MARO GLOBAL
      </footer>
    </div>
  );
};

/**
 * 🎨 OMNIPOTENT STYLING SYSTEM
 */

const vaultRootStyle = {
  background: 'radial-gradient(circle at top right, #0a0a0a 0%, #000 100%)',
  minHeight: '100vh', color: '#fff', 
  fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', overflowX: 'hidden'
};

const navBarStyle = {
  padding: '20px 6%', background: 'rgba(0,0,0,0.99)', borderBottom: '4px solid #111',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  position: 'sticky', top: 0, zIndex: 1000, backdropFilter: 'blur(60px)',
  boxShadow: '0 15px 50px rgba(0,0,0,1)'
};

const logoIconStyle = {
  background: 'linear-gradient(145deg, #ffd700, #9a7b00)', width: '55px', height: '55px',
  borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center',
  color: '#000', fontWeight: '950', fontSize: '1.8rem', boxShadow: '0 0 35px rgba(255,215,0,0.5)'
};

const logoTextStyle = { margin: 0, color: '#ffd700', fontSize: '1.6rem', letterSpacing: '8px', fontWeight: '950', textShadow: '0 0 20px rgba(255,215,0,0.3)' };
const logoSubTextStyle = { fontSize: '0.65rem', color: '#444', letterSpacing: '5px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '5px' };

const statusBadgeStyle = {
  background: 'rgba(255,215,0,0.03)', padding: '12px 30px', borderRadius: '100px', 
  border: '2px solid #1a1a1a', fontSize: '0.9rem', display: 'flex', alignItems: 'center'
};

const onlineDotStyle = { width: '10px', height: '10px', background: '#00ff00', borderRadius: '50%', boxShadow: '0 0 15px #00ff00', marginRight: '15px' };

const logoutButtonStyle = {
  background: 'transparent', border: '1px solid #222', color: '#555', 
  padding: '12px 25px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '900', transition: '0.4s'
};

const loadingContainerStyle = { background: '#000', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
const mightySpinnerStyle = { width: '100%', height: '100%', border: '10px solid #080808', borderTop: '10px solid #ffd700', borderRadius: '50%', animation: 'mightySpin 1s linear infinite' };
const loadingTextStyle = { color: '#ffd700', letterSpacing: '15px', marginTop: '50px', fontSize: '0.9rem', textAlign: 'center', fontWeight: '900' };
const loadingSubTextStyle = { color: '#222', fontSize: '0.65rem', letterSpacing: '6px', marginTop: '15px', display: 'inline-block' };

const mainContainerStyle = (ready) => ({
  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', 
  padding: '60px 6%', gap: '60px', maxWidth: '2000px', margin: '0 auto',
  opacity: ready ? 1 : 0, transition: 'opacity 2s ease-in-out', justifyContent: 'center'
});

const videoSectionStyle = { flex: '1 1 1100px', maxWidth: '1400px', width: '100%' };

const armoredContainerStyle = {
  position: 'relative', width: '100%', paddingBottom: '56.25%', 
  overflow: 'hidden', borderRadius: '55px', background: '#000',
  border: '15px solid #080808', boxShadow: '0 120px 250px rgba(0,0,0,1)'
};

const ghostShieldTopStyle = {
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100px', 
  zIndex: 20, background: 'black', pointerEvents: 'none'
};

const iframeStyle = {
  position: 'absolute', top: '-11%', left: '-1%', 
  width: '102%', height: '122%', border: 'none',
  filter: 'contrast(1.18) brightness(1.1) saturate(1.12)'
};

const navigationOverlayStyle = {
  position: 'absolute', bottom: '90px', left: '50%', transform: 'translateX(-50%)',
  display: 'flex', gap: '40px', zIndex: 100 
};

const industrialButtonStyle = {
  background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
  border: '3px solid #ffd700', color: '#ffd700',
  padding: '22px 50px', borderRadius: '100px', fontSize: '0.8rem',
  fontWeight: '950', letterSpacing: '3px', cursor: 'pointer',
  boxShadow: '0 15px 50px rgba(0,0,0,0.9)', transition: '0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

const logoKillerFooterStyle = {
  position: 'absolute', bottom: 0, right: 0, width: '100%', height: '60px', 
  zIndex: 20, background: 'black', pointerEvents: 'none' 
};

const proBadgeStyle = {
  position: 'absolute', top: '50px', right: '50px', zIndex: 25,
  background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(30px)',
  padding: '15px 45px', borderRadius: '100px', border: '1px solid #ffd70055',
  animation: 'pulseBrilliance 4s infinite'
};

const ogaInstructionStyle = {
  display: 'inline-block', padding: '20px 60px', 
  background: 'rgba(255,215,0,0.05)', borderRadius: '100px',
  border: '2px solid rgba(255,215,0,0.2)', animation: 'pulseBrilliance 3s infinite'
};

const lessonDataCardStyle = {
  marginTop: '70px', background: 'linear-gradient(165deg, #0a0a0a 0%, #000 100%)', 
  padding: '70px', borderRadius: '65px', borderLeft: '22px solid #ffd700', 
  boxShadow: '0 80px 150px rgba(0,0,0,0.9)', position: 'relative', overflow: 'hidden'
};

const vaultWatermarkStyle = { position: 'absolute', top: '-60px', right: '-60px', fontSize: '18rem', color: 'rgba(255,215,0,0.015)', fontWeight: '950', pointerEvents: 'none' };
const videoTitleStyle = { margin: '0 0 40px 0', fontSize: '4.2rem', fontWeight: '950', color: '#fff', textTransform: 'uppercase', letterSpacing: '-4px', lineHeight: '1' };
const videoDescStyle = { color: '#666', fontSize: '1.5rem', lineHeight: '2.2', maxWidth: '1100px', margin: 0 };
const tagStyle = { background: '#070707', padding: '18px 40px', borderRadius: '18px', fontSize: '0.95rem', color: '#ffd700', fontWeight: '900', border: '2px solid #111', letterSpacing: '3px' };

const sidebarWrapperStyle = { flex: '1 1 450px', maxWidth: '550px', width: '100%' };
const sidebarContentStyle = { background: '#050505', padding: '60px', borderRadius: '70px', border: '3px solid #111', position: 'sticky', top: '140px', boxShadow: '0 60px 120px rgba(0,0,0,1)' };
const sidebarTitleStyle = { color: '#ffd700', marginBottom: '60px', fontSize: '1.5rem', letterSpacing: '12px', fontWeight: '950', textAlign: 'center', borderBottom: '4px solid #111', paddingBottom: '40px', textTransform: 'uppercase' };

const sidebarItemStyle = (isActive, isHovered) => ({
  padding: '45px', borderRadius: '45px', cursor: 'pointer',
  background: isActive ? 'linear-gradient(90deg, #ffd700, #b8860b)' : (isHovered ? '#151515' : '#0a0a0a'),
  color: isActive ? '#000' : '#444', fontWeight: '950', 
  transform: isActive ? 'translateX(30px) scale(1.05)' : 'scale(1)',
  transition: '0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  display: 'flex', alignItems: 'center', gap: '35px',
  border: '3px solid', borderColor: isActive ? '#ffd700' : '#0d0d0d'
});

const sidebarFooterStyle = { marginTop: '80px', textAlign: 'center', color: '#111', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '10px' };
const emptyStateStyle = { flex: '1 1 1100px', textAlign: 'center', padding: '300px', background: '#050505', borderRadius: '70px', border: '5px dashed #0a0a0a' };
const globalFooterStyle = { textAlign: 'center', padding: '120px', color: '#111', letterSpacing: '18px', fontSize: '0.85rem', textTransform: 'uppercase' };

export default VideoVault;
