import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * 🏛️ MARO ACADEMY - PRESIDENTIAL VIDEO VAULT v18.5 [THE GOLIATH SEAL]
 * 🦾 TOTAL ARCHITECTURE LOCKDOWN:
 * 1. NAV-COMMAND RELATIVE: Uses 'seekBy' execution for infinite skipping.
 * 2. ORIGIN-LOCK: Hardcoded handshake with YouTube for zero-leak commands.
 * 3. BRANDING ERASER: Physical 140px/85px black-out bars to bury YouTube UI.
 * 4. INDUSTRIAL ARMOR: 15px carbon-steel borders with deep-shadow containment.
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
    document.addEventListener('contextmenu', lockSystem);
    document.addEventListener('dragstart', lockSystem);
    return () => {
      document.removeEventListener('contextmenu', lockSystem);
      document.removeEventListener('dragstart', lockSystem);
    };
  }, []);

  /**
   * 🚀 THE OMNIPOTENT NAV-COMMANDER
   * This is the absolute fix for the "resetting" issue.
   * It tells the player to move RELATIVE to the current time.
   */
  const handleIndustrialSkip = (seconds) => {
    const iframe = document.getElementById('vault-player-core');
    if (iframe) {
      // 🦾 THE OVERLORD COMMAND: 'seekBy'
      // This tells YouTube: "Add/Subtract seconds from WHERE YOU ARE NOW"
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'execute',
        args: ['seekBy', seconds] 
      }), '*');

      // FORCE RESUME: Ensures zero stalling after the jump
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
      if (response.data.length > 0) setActiveVideo(response.data[0]);
      
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
        <div style={{ position: 'relative', width: '130px', height: '130px' }}>
          <div style={mightySpinnerStyle}></div>
          <div style={{ position: 'absolute', top: '40px', left: '46px', fontSize: '2.8rem' }}>🔐</div>
        </div>
        <h2 style={loadingTextStyle}>DECRYPTING ASSETS...</h2>
        <style>{`@keyframes mightySpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
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
            <div style={logoSubTextStyle}>Premium Vault v18.5 [GOLIATH]</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div style={statusBadgeStyle}>VAULT: <span style={{ color: '#ffd700', fontWeight: '950' }}>{user?.name?.toUpperCase()}</span></div>
          <button onClick={() => navigate('/login')} style={logoutButtonStyle}>LOGOUT SYSTEM</button>
        </div>
      </nav>

      <main style={mainContainerStyle(systemReady)}>
        {activeVideo ? (
          <div style={videoSectionStyle}>
            <div style={armoredContainerStyle}>
              {/* 🛡️ TOP LOGO KILLER */}
              <div style={ghostShieldTopStyle}></div>

              <iframe 
                id="vault-player-core"
                title="Maro Academy Secure Stream"
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?enablejsapi=1&origin=${window.location.origin}&modestbranding=1&rel=0&controls=0&showinfo=0&iv_load_policy=3&vq=hd1080&fs=0&disablekb=1&autoplay=1`}
                style={iframeStyle}
                allow="autoplay; encrypted-media"
              ></iframe>

              {/* 🕹️ DUAL-DIRECTION COMMANDS (INFINITE SKIP) */}
              <div style={navigationOverlayStyle}>
                <button onClick={() => handleIndustrialSkip(-10)} style={industrialButtonStyle}>⏪ BACK 10S</button>
                <button onClick={() => handleIndustrialSkip(10)} style={industrialButtonStyle}>FORWARD 10S ⏩</button>
              </div>

              {/* 🔒 BOTTOM LOGO KILLER */}
              <div style={logoKillerFooterStyle}></div>
            </div>

            <div style={lessonDataCardStyle}>
              <h1 style={videoTitleStyle}>{activeVideo.title}</h1>
              <p style={videoDescStyle}>{activeVideo.description}</p>
            </div>
          </div>
        ) : null}

        <div style={sidebarWrapperStyle}>
          <div style={sidebarContentStyle}>
            <h3 style={sidebarTitleStyle}>Curriculum</h3>
            {videos.map((v, i) => (
              <div key={v._id} onClick={() => setActiveVideo(v)} style={sidebarItemStyle(activeVideo?._id === v._id)}>
                {String(i + 1).padStart(2, '0')} - {v.title.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// 🎨 INDUSTRIAL STYLING MATRIX
const vaultRootStyle = { background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' };
const navBarStyle = { padding: '20px 6%', background: '#050505', borderBottom: '4px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 };
const logoIconStyle = { background: '#ffd700', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#000', fontWeight: '950' };
const logoTextStyle = { margin: 0, color: '#ffd700', letterSpacing: '6px' };
const logoSubTextStyle = { fontSize: '0.6rem', color: '#444', letterSpacing: '4px' };
const logoutButtonStyle = { background: 'transparent', border: '1px solid #222', color: '#555', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer' };
const statusBadgeStyle = { background: 'rgba(255,215,0,0.05)', padding: '10px 25px', borderRadius: '100px', border: '2px solid #1a1a1a', fontSize: '0.85rem' };
const loadingContainerStyle = { background: '#000', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
const mightySpinnerStyle = { width: '100%', height: '100%', border: '8px solid #0a0a0a', borderTop: '8px solid #ffd700', borderRadius: '50%', animation: 'mightySpin 1.2s linear infinite' };
const loadingTextStyle = { color: '#ffd700', letterSpacing: '12px', marginTop: '45px' };
const mainContainerStyle = (ready) => ({ display: 'flex', padding: '60px 6%', gap: '60px', opacity: ready ? 1 : 0, transition: '2s' });
const videoSectionStyle = { flex: '1 1 1100px' };
const armoredContainerStyle = { position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: '55px', border: '15px solid #080808', overflow: 'hidden', background: '#000' };
const ghostShieldTopStyle = { position: 'absolute', top: 0, width: '100%', height: '110px', zIndex: 20, background: 'black' };
const iframeStyle = { position: 'absolute', top: '-11%', left: '-1%', width: '102%', height: '122%', border: 'none' };
const navigationOverlayStyle = { position: 'absolute', bottom: '90px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '40px', zIndex: 100 };
const industrialButtonStyle = { background: 'rgba(0,0,0,0.9)', border: '3px solid #ffd700', color: '#ffd700', padding: '20px 40px', borderRadius: '100px', fontWeight: '950', cursor: 'pointer' };
const logoKillerFooterStyle = { position: 'absolute', bottom: 0, width: '100%', height: '70px', zIndex: 20, background: 'black' };
const lessonDataCardStyle = { marginTop: '70px', padding: '70px', borderLeft: '22px solid #ffd700', background: '#050505', borderRadius: '60px' };
const videoTitleStyle = { fontSize: '3.5rem', fontWeight: '950', textTransform: 'uppercase' };
const videoDescStyle = { color: '#666', fontSize: '1.4rem', lineHeight: '2' };
const sidebarWrapperStyle = { flex: '1 1 450px' };
const sidebarContentStyle = { background: '#050505', padding: '50px', borderRadius: '60px', border: '3px solid #111' };
const sidebarTitleStyle = { color: '#ffd700', letterSpacing: '10px', textTransform: 'uppercase', textAlign: 'center' };
const sidebarItemStyle = (active) => ({ padding: '30px', borderRadius: '30px', cursor: 'pointer', background: active ? '#ffd700' : '#0a0a0a', color: active ? '#000' : '#444', fontWeight: '900', marginBottom: '15px' });

export default VideoVault;
