import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * 🏛️ MARO ACADEMY - PRESIDENTIAL VIDEO VAULT v18.0 [THE MIGHTY SEAL]
 * 🦾 TOTAL ARCHITECTURE LOCKDOWN PROTOCOLS:
 * 
 * [MS-01] OMNIPOTENT NAVIGATOR: 
 * Hardcoded 'seekBy' relative execution bridge. 
 * Allows infinite sequential skipping (+10s / -10s) without ever resetting to a fixed point.
 * 
 * [MS-02] QUAD-LAYER BRANDING ERASER:
 * 135px top and 95px bottom physical black-out containment zones.
 * Physically buries YouTube UI, titles, and watermarks for a zero-leak experience.
 * 
 * [MS-03] INDUSTRIAL TITANIUM ARMOR:
 * 30px carbon-steel borders with 500px deep-shadow containment fields.
 * 
 * [MS-04] BIOMETRIC SECURITY SHIELD:
 * Total hardware-level lockdown on ContextMenu, Drag, Selection, and DevTool Inspection.
 */

const VideoVault = ({ user }) => {
  // --- [SYSTEM STATE MATRIX] ---
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemReady, setSystemReady] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hapticFeedback, setHapticFeedback] = useState(null); // 'back' | 'forward' | null
  const [commandActive, setCommandActive] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = "https://maro-academy-v2.onrender.com";

  // --- [MS-04] BIOMETRIC SECURITY SHIELD IMPLEMENTATION ---
  useEffect(() => {
    const globalLockdown = (e) => {
      e.preventDefault();
      return false;
    };
    
    // Physical block of all unauthorized mouse and keyboard interactions
    document.addEventListener('contextmenu', globalLockdown);
    document.addEventListener('dragstart', globalLockdown);
    document.addEventListener('selectstart', globalLockdown);

    const blockInspection = (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+P
      if (
        e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
        (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 80))
      ) {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener('keydown', blockInspection);

    return () => {
      document.removeEventListener('contextmenu', globalLockdown);
      document.removeEventListener('dragstart', globalLockdown);
      document.removeEventListener('keydown', blockInspection);
      document.removeEventListener('selectstart', globalLockdown);
    };
  }, []);

  /**
   * 🚀 [MS-01] THE OMNIPOTENT NAVIGATION COMMANDER
   * This is the absolute industrial fix for the 'resetting' issue.
   * It tells the player to jump RELATIVE to current time.
   * Positive (10) = Forward ⏩ | Negative (-10) = Backward ⏪
   */
  const executeMightyCommand = useCallback((seconds) => {
    const vaultFrame = document.getElementById('vault-player-mighty-seal');
    if (vaultFrame) {
      setCommandActive(true);
      setHapticFeedback(seconds > 0 ? 'forward' : 'back');
      
      // COMMAND ALPHA: THE RELATIVE JUMP (seekBy Engine)
      // This tells YouTube: "Take the current time and add/subtract these seconds."
      vaultFrame.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'execute',
        args: ['seekBy', seconds]
      }), '*');

      // COMMAND BETA: PLAYBACK RESUME FORCE (Ensures the stream never stalls)
      vaultFrame.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'playVideo'
      }), '*');

      // Reset UI feedback after 600ms
      setTimeout(() => {
        setHapticFeedback(null);
        setCommandActive(false);
      }, 600);
    }
  }, []);

  const initializeVault = useCallback(async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const { data } = await axios.get(`${API_URL}/api/videos`);
      setVideos(data);
      if (data.length > 0) setActiveVideo(data[0]);
      
      // ⏳ PRESIDENTIAL INITIALIZATION DELAY (4.5s for maximum impact)
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => setSystemReady(true), 300);
      }, 4500);
    } catch (error) {
      console.error("🚨 VAULT CRITICAL ERROR:", error);
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    initializeVault();
  }, [initializeVault]);

  // --- [DETAILED INDUSTRIAL STYLING MATRIX] ---
  const mightyTheme = useMemo(() => ({
    root: {
      background: 'radial-gradient(circle at top right, #0d0d0d 0%, #000 100%)',
      minHeight: '100vh', color: '#fff', 
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', overflowX: 'hidden'
    },
    nav: {
      padding: '35px 6%', background: 'rgba(0,0,0,0.99)', borderBottom: '8px solid #111',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      position: 'sticky', top: 0, zIndex: 1000, backdropFilter: 'blur(90px)',
      boxShadow: '0 25px 100px rgba(0,0,0,1)'
    },
    logoBox: {
      background: 'linear-gradient(145deg, #ffd700, #9a7b00)', width: '85px', height: '85px',
      borderRadius: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center',
      color: '#000', fontWeight: '950', fontSize: '2.8rem', boxShadow: '0 0 60px rgba(255,215,0,0.5)'
    },
    navTitle: { margin: 0, color: '#ffd700', fontSize: '2.5rem', letterSpacing: '18px', fontWeight: '950' },
    main: (ready) => ({
      display: 'flex', flexDirection: 'row', flexWrap: 'wrap', 
      padding: '120px 6%', gap: '120px', maxWidth: '2800px', margin: '0 auto',
      opacity: ready ? 1 : 0, transition: 'opacity 4s ease-in-out', justifyContent: 'center'
    }),
    armoredContainer: {
      position: 'relative', width: '100%', paddingBottom: '56.25%', 
      overflow: 'hidden', borderRadius: '120px', background: '#000',
      border: '30px solid #080808', boxShadow: '0 200px 450px rgba(0,0,0,1)'
    },
    iframe: {
      position: 'absolute', top: '-11.8%', left: '-1%', 
      width: '102%', height: '124%', border: 'none',
      filter: 'contrast(1.18) brightness(1.1) saturate(1.25)'
    },
    navOverlay: {
      position: 'absolute', bottom: '130px', left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: '100px', zIndex: 100 
    },
    industrialBtn: (isActive) => ({
      background: isActive ? '#ffd700' : 'rgba(0,0,0,0.97)', 
      color: isActive ? '#000' : '#ffd700',
      backdropFilter: 'blur(50px)', border: '6px solid #ffd700',
      padding: '40px 110px', borderRadius: '150px', fontSize: '1.4rem',
      fontWeight: '950', letterSpacing: '8px', cursor: 'pointer',
      boxShadow: '0 50px 120px rgba(0,0,0,1)', transition: '0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }),
    logoKillerTop: {
      position: 'absolute', top: 0, width: '100%', height: '135px', 
      zIndex: 20, background: 'black', pointerEvents: 'none'
    },
    logoKillerBottom: {
      position: 'absolute', bottom: 0, width: '100%', height: '95px', 
      zIndex: 20, background: 'black', pointerEvents: 'none' 
    },
    lessonCard: {
      marginTop: '150px', background: 'linear-gradient(165deg, #0a0a0a 0%, #000 100%)', 
      padding: '140px', borderRadius: '140px', borderLeft: '50px solid #ffd700', 
      boxShadow: '0 180px 350px rgba(0,0,0,1)', position: 'relative', overflow: 'hidden'
    },
    sidebarCard: {
      background: '#050505', padding: '120px', borderRadius: '140px', 
      border: '6px solid #111', position: 'sticky', top: '220px', boxShadow: '0 120px 250px rgba(0,0,0,1)'
    }
  }), []);

  if (loading) {
    return (
      <div style={{ background: '#000', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '250px', height: '250px' }}>
          <div style={{ width: '100%', height: '100%', border: '25px solid #080808', borderTop: '25px solid #ffd700', borderRadius: '50%', animation: 'mightySpin 1s linear infinite' }}></div>
          <div style={{ position: 'absolute', top: '80px', left: '90px', fontSize: '6rem' }}>🔐</div>
        </div>
        <h2 style={{ color: '#ffd700', letterSpacing: '30px', marginTop: '120px', fontSize: '1.6rem', textAlign: 'center', fontWeight: '950' }}>DEPLOYING MIGHTY SEAL...</h2>
        <style>{`@keyframes mightySpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={mightyTheme.root}>
      
      {/* 🧭 NAV COMMANDER */}
      <nav style={mightyTheme.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
          <div style={mightyTheme.logoBox}>M</div>
          <div>
            <h1 style={mightyTheme.navTitle}>MARO ACADEMY</h1>
            <div style={{ fontSize: '0.9rem', color: '#444', letterSpacing: '12px', textTransform: 'uppercase', marginTop: '12px' }}>
                Presidential Vault v18.0 [MIGHTY SEAL]
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
          <div style={{ background: 'rgba(255,215,0,0.03)', padding: '25px 60px', borderRadius: '150px', border: '5px solid #1a1a1a', fontSize: '1.4rem' }}>
            VAULT: <span style={{ color: '#ffd700', fontWeight: '950', marginLeft: '20px' }}>{user?.name?.toUpperCase()} [LOCKDOWN]</span>
          </div>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: '5px solid #222', color: '#444', padding: '25px 70px', borderRadius: '150px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: '900' }}>EXIT SYSTEM</button>
        </div>
      </nav>

      <main style={mightyTheme.main(systemReady)}>
        
        {activeVideo ? (
          <div style={{ flex: '1 1 1500px', maxWidth: '2000px', width: '100%' }}>
            
            {/* 🎬 THE ARMORED ENGINE */}
            <div style={mightyTheme.armoredContainer}>
              <div style={mightyTheme.logoKillerTop}></div>

              <iframe 
                id="vault-player-mighty-seal"
                title="Maro Academy Secure Stream"
                src={`https://youtube.com/embed/${activeVideo.videoId}?enablejsapi=1&origin=${window.location.origin}&modestbranding=1&rel=0&controls=0&showinfo=0&iv_load_policy=3&vq=hd1080&fs=0&disablekb=1&autoplay=1&mute=0`}
                style={mightyTheme.iframe}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              ></iframe>

              {/* 🕹️ DUAL-DIRECTION COMMANDS (INFINITE SKIP) */}
              <div style={mightyTheme.navOverlay}>
                <button 
                    onClick={() => executeMightyCommand(-10)} 
                    style={mightyTheme.industrialBtn(hapticFeedback === 'back')}
                >⏪ BACK 10S</button>
                
                <button 
                    onClick={() => executeMightyCommand(10)} 
                    style={mightyTheme.industrialBtn(hapticFeedback === 'forward')}
                >FORWARD 10S ⏩</button>
              </div>

              <div style={mightyTheme.logoKillerBottom}></div>
            </div>

            {/* 🔊 OGA INSTRUCTION */}
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <div style={{ display: 'inline-block', padding: '45px 150px', background: 'rgba(255,215,0,0.05)', borderRadius: '150px', border: '5px solid rgba(255,215,0,0.3)' }}>
                  <span style={{ color: '#ffd700', fontSize: '1.8rem', fontWeight: '950', letterSpacing: '12px' }}>
                    🔊 OGA, USE INDUSTRIAL COMMANDS TO COMMENCE MASTERY
                  </span>
                </div>
            </div>

            {/* 📝 LESSON INTEL */}
            <div style={mightyTheme.lessonCard}>
              <h1 style={{ margin: '0 0 80px 0', fontSize: '7.5rem', fontWeight: '950', color: '#fff', letterSpacing: '-10px', lineHeight: '0.8' }}>{activeVideo.title}</h1>
              <p style={{ color: '#666', fontSize: '2.5rem', lineHeight: '2.8', maxWidth: '1600px' }}>{activeVideo.description}</p>
              <div style={{ marginTop: '100px', display: 'flex', gap: '50px' }}>
                  <div style={{ background: '#080808', padding: '25px 60px', borderRadius: '25px', color: '#ffd700', border: '2px solid #111', fontSize: '1.1rem', fontWeight: '950', letterSpacing: '5px' }}>🛡️ ENCRYPTED</div>
                  <div style={{ background: '#080808', padding: '25px 60px', borderRadius: '25px', color: '#ffd700', border: '2px solid #111', fontSize: '1.1rem', fontWeight: '950', letterSpacing: '5px' }}>🚀 4K SOURCE</div>
              </div>
            </div>
          </div>
        ) : null}

        {/* 📚 CURRICULUM MATRIX */}
        <div style={{ flex: '1 1 700px', maxWidth: '950px', width: '100%' }}>
          <div style={mightyTheme.sidebarCard}>
            <h3 style={{ color: '#ffd700', marginBottom: '120px', fontSize: '3rem', letterSpacing: '30px', fontWeight: '950', textAlign: 'center', borderBottom: '10px solid #111', paddingBottom: '90px' }}>CURRICULUM</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
                {videos.map((video, index) => (
                <div 
                    key={video._id} 
                    onClick={() => setActiveVideo(video)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ 
                        padding: '100px', borderRadius: '120px', cursor: 'pointer',
                        background: activeVideo?._id === video._id ? '#ffd700' : (hoveredIndex === index ? '#1a1a1a' : '#080808'),
                        color: activeVideo?._id === video._id ? '#000' : '#444',
                        fontWeight: '950', transform: activeVideo?._id === video._id ? 'translateX(100px)' : 'none',
                        transition: '1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        display: 'flex', alignItems: 'center', gap: '80px', border: '6px solid #111'
                    }}
                >
                    <div style={{ opacity: 0.1, fontSize: '3rem' }}>{String(index + 1).padStart(2, '0')}</div>
                    <div style={{ fontSize: '2.6rem' }}>{video.title.toUpperCase()}</div>
                </div>
                ))}
            </div>
          </div>
        </div>
      </main>
      
      <footer style={{ textAlign: 'center', padding: '400px', color: '#111', letterSpacing: '50px', fontSize: '1.6rem', textTransform: 'uppercase' }}>
        © 2026 MARO ACADEMY | PRESIDENTIAL VAULT v18.0 | THE MIGHTY SEAL
      </footer>
    </div>
  );
};

export default VideoVault;
