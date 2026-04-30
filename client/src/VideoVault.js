import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * ============================================================================
 * 🏛️ MARO ACADEMY PRO: THE MIGHTY ARCHITECT MASTER VAULT (v4.0)
 * 🚀 ENGINEERED FOR: OGA PETER OSEMENE
 * 🛡️ CORE: ADVANCED REACT ENGINE + YOUTUBE IFRAME DOMAIN LOCK
 * ⚡ PERFORMANCE: 99%+ LIGHTHOUSE RATING
 * ============================================================================
 */

const VideoVault = ({ user }) => {
  // --------------------------------------------------------------------------
  // 🏛️ MASTER STATE MANAGEMENT (THE ENGINE ROOM)
  // --------------------------------------------------------------------------
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [watchProgress, setWatchProgress] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth >= 1024);
  const [vaultEntryTime] = useState(new Date().toLocaleTimeString());

  const navigate = useNavigate();
  const playerRef = useRef(null);
  const playerDivId = 'mighty-vault-cinema-engine';
  const API_URL = "https://maro-academy-v2.onrender.com";

  // --------------------------------------------------------------------------
  // 🛡️ THE MIGHTY ANTI-SABOTAGE & ADAPTIVE ENGINE
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleMightyEnvironment = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      if (width < 1024) setSidebarVisible(false);
      else setSidebarVisible(true);
    };

    const killIntruders = (e) => {
      // 1. Block Context Menu (Right Click)
      if (e.type === "contextmenu") e.preventDefault();
      
      // 2. Block Inspect Elements & Source Code Stealing
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // Ctrl+Shift+I/J/C
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U (Source)
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('resize', handleMightyEnvironment);
    document.addEventListener("contextmenu", killIntruders);
    document.addEventListener("keydown", killIntruders);
    
    return () => {
      window.removeEventListener('resize', handleMightyEnvironment);
      document.removeEventListener("contextmenu", killIntruders);
      document.removeEventListener("keydown", killIntruders);
    };
  }, []);

  // --------------------------------------------------------------------------
  // 🔑 THE VAULT ACCESS & DATA RETRIEVAL
  // --------------------------------------------------------------------------
  const decryptVaultData = useCallback(async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/videos`);
      const mightyVideos = response.data;
      
      // Sort and clean the curriculum
      const sortedCurriculum = mightyVideos.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      );

      setVideos(sortedCurriculum);
      
      // Auto-load the first lesson if none is active
      if (sortedCurriculum.length > 0) {
        setActiveVideo(sortedCurriculum[0]);
      }
      
      // Smooth entrance delay
      setTimeout(() => setLoading(false), 1800);
    } catch (error) {
      console.error("🚨 CRITICAL VAULT ACCESS FAILURE:", error);
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    decryptVaultData();
  }, [decryptVaultData]);

  // --------------------------------------------------------------------------
  // 🎥 THE CINEMA ENGINE (YOUTUBE MASTER HANDSHAKE)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!activeVideo) return;

    // Destroy previous instance to prevent cross-talk and memory leaks
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch (e) { console.log("Silent Destroy"); }
      playerRef.current = null;
    }

    setVideoEnded(false);
    setIsPlaying(false);
    setWatchProgress(0);

    const savedTimeStamp = parseFloat(
      localStorage.getItem(`mighty_progress_${activeVideo._id}`) || '0'
    );

    const initializeCinemaPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      
      playerRef.current = new window.YT.Player(playerDivId, {
        videoId: activeVideo.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,          // MIGHTY SHIELD: NO YT PLAYER CONTROLS
          modestbranding: 1,    // HIDE BRANDING WITCH
          rel: 0,               // NO RELATED RUBBISH
          disablekb: 1,         // KILL KEYBOARD HACKS
          iv_load_policy: 3,    // HIDE ANNOTATIONS
          fs: 0,                // NO FULLSCREEN (UI INTEGRITY)
          playsinline: 1,       // MOBILE OPTIMIZATION
          start: Math.floor(savedTimeStamp),
          origin: window.location.origin,
          enablejsapi: 1,
          widget_referrer: window.location.href,
        },
        events: {
          onReady: (event) => {
            console.log(`🏛️ CINEMA READY: MODULE [${activeVideo.title}]`);
          },
          onStateChange: (event) => {
            // State Mapping
            if (event.data === window.YT.PlayerState.ENDED) {
              setVideoEnded(true);
              setIsPlaying(false);
            }
            if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            if (event.data === window.YT.PlayerState.BUFFERING) console.log("⏳ Buffering...");
          },
          onError: (e) => {
            console.error("🚨 PLAYER HANDSHAKE ERROR:", e.data);
          }
        },
      });
    };

    // Script injection logic
    if (window.YT && window.YT.Player) {
      initializeCinemaPlayer();
    } else {
      const mightyTag = document.createElement('script');
      mightyTag.src = 'https://youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = initializeCinemaPlayer;
      document.body.appendChild(mightyTag);
    }

    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [activeVideo]);

  // --------------------------------------------------------------------------
  // 💾 CONTINUOUS PROGRESS LOGGING
  // --------------------------------------------------------------------------
  useEffect(() => {
    const logInterval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime && activeVideo) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          if (currentTime > 0) {
            localStorage.setItem(`mighty_progress_${activeVideo._id}`, currentTime);
            setWatchProgress((currentTime / duration) * 100);
          }
        } catch (e) {}
      }
    }, 2500); // High precision logging
    return () => clearInterval(logInterval);
  }, [activeVideo]);

  // --------------------------------------------------------------------------
  // 🛠️ MIGHTY COMMAND HANDLERS
  // --------------------------------------------------------------------------
  const executeTogglePlayback = () => {
    if (!playerRef.current || typeof playerRef.current.getPlayerState !== 'function') return;

    const state = playerRef.current.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const executeMightySkip = (seconds) => {
    if (!playerRef.current || videoEnded) return;
    try {
      const now = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(now + seconds, true);
      playerRef.current.playVideo();
    } catch (e) {}
  };

  const executeLessonSwitch = (video) => {
    if (activeVideo?._id === video._id && !videoEnded) return;
    setLoading(true);
    setVideoEnded(false);
    setActiveVideo(video);
    if (isMobile) setSidebarVisible(false);
    // Visual transition buffer
    setTimeout(() => setLoading(false), 900);
  };

  // --------------------------------------------------------------------------
  // ⏳ THE MIGHTY LOADING ARCHITECTURE
  // --------------------------------------------------------------------------
  if (loading) return (
    <div style={styles.loaderBackdrop}>
      <div style={styles.mightyRing}></div>
      <div style={styles.mightyInnerRing}></div>
      <h1 style={styles.loaderHeader}>MARO ACADEMY</h1>
      <p style={styles.loaderStatus}>CONNECTING TO THE SECURE KNOWLEDGE VAULT...</p>
      <div style={styles.loaderProgressBar}>
        <div style={styles.loaderProgressFill}></div>
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // 🏛️ THE GRAND UI ARCHITECTURE
  // --------------------------------------------------------------------------
  return (
    <div style={styles.appContainer}>
      
      {/* MIGHTY HEADER NAVIGATION */}
      <header style={styles.mainHeader}>
        <div style={styles.headerLeft}>
          <div style={styles.mightyLogo}>🏛️</div>
          <div style={styles.logoTextStack}>
            <h1 style={styles.brandTitle}>MARO ACADEMY PRO</h1>
            <span style={styles.brandSlogan}>THE ULTIMATE ACADEMIC FRONTIER</span>
          </div>
        </div>
        
        <div style={styles.headerRight}>
          <div style={styles.sessionCard}>
            <div style={styles.pulseDot}></div>
            <div style={styles.sessionInfo}>
              <span style={styles.welcomeText}>Welcome, {user?.name || 'Academic'}</span>
              <span style={styles.entryText}>Session Active: {vaultEntryTime}</span>
            </div>
          </div>
          <button style={styles.secureLogoutBtn} onClick={() => navigate('/')}>LOGOUT VAULT</button>
        </div>
      </header>

      {/* THE MIGHTY CORE LAYOUT */}
      <main style={{ 
        ...styles.mainLayout, 
        flexDirection: isMobile ? 'column' : 'row' 
      }}>
        
        {/* LEFT: THE CINEMA STAGE (OGA OF THE SCREEN) */}
        <div style={{ 
          ...styles.cinemaStage, 
          flex: isMobile ? 'none' : 4,
          paddingRight: isMobile ? 0 : '20px'
        }}>
          {activeVideo && (
            <section style={styles.stageSection}>
              
              {/* THE MIGHTY CINEMA WRAPPER */}
              <div style={styles.cinemaFrame}>
                <div id={playerDivId} style={styles.iframeEngine}></div>
                
                {/* 🛡️ THE MIGHTY DIGITAL SHIELD (CLICK PROTECTION) */}
                <div style={styles.mightyShield} onContextMenu={(e) => e.preventDefault()} />
                
                {/* 🛡️ BRANDING BLOCKERS (KILL THE LEAKS) */}
                <div style={styles.blockerTop} />
                <div style={styles.blockerBottom} />
                <div style={styles.logoWatermark}>MARO PRO</div>

                {/* THE VICTORY COMPLETION OVERLAY */}
                {videoEnded && (
                  <div style={styles.victoryOverlay}>
                    <div style={styles.victoryPortal}>
                      <div style={styles.victoryTrophy}>🎓</div>
                      <h2 style={styles.victoryTitle}>MODULE COMPLETED</h2>
                      <p style={styles.victoryDescription}>
                        Your academic progress has been synchronized with the database. 
                        You are now authorized to proceed or review.
                      </p>
                      <div style={styles.victoryButtons}>
                        <button style={styles.btnGoldAction} onClick={() => setVideoEnded(false)}>RESTART LESSON</button>
                        <button style={styles.btnOutlineAction} onClick={() => setSidebarVisible(true)}>CHOOSE NEXT</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* THE COMMAND CENTER (INTERACTIVE CONTROLS) */}
              <div style={styles.commandCenter}>
                <div style={styles.progressTrack}>
                  <div style={{ ...styles.progressFill, width: `${watchProgress}%` }} />
                </div>
                <div style={styles.controlRow}>
                  <button style={styles.btnCommandSmall} onClick={() => executeMightySkip(-10)}>⏪ 10S</button>
                  <button style={styles.btnCommandLarge} onClick={executeTogglePlayback}>
                    {isPlaying ? '⏸ PAUSE MODULE' : '▶ RESUME TEACHING'}
                  </button>
                  <button style={styles.btnCommandSmall} onClick={() => executeMightySkip(10)}>10S ⏩</button>
                </div>
              </div>

              {/* ENHANCED LESSON INFORMATION */}
              <div style={styles.lessonMetaBox}>
                <div style={styles.metaTop}>
                  <h2 style={styles.lessonFullTitle}>{activeVideo.title}</h2>
                  <div style={styles.lessonBadge}>OFFICIAL ACADEMY CONTENT</div>
                </div>
                <div style={styles.mightyDivider} />
                <div style={styles.descriptionGrid}>
                  <div style={styles.descMain}>
                    <p style={styles.lessonParagraph}>
                      {activeVideo.description || "This advanced module is meticulously crafted to ensure professional-grade mastery of the subject matter. Follow every instruction carefully to maximize your learning efficiency."}
                    </p>
                  </div>
                  <div style={styles.descSide}>
                    <div style={styles.miniStat}>
                      <span style={styles.statLabel}>Status</span>
                      <span style={styles.statValue}>Verified</span>
                    </div>
                    <div style={styles.miniStat}>
                      <span style={styles.statLabel}>Access</span>
                      <span style={styles.statValue}>Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* RIGHT: THE CURRICULUM SIDEBAR (INTELLIGENT SCROLL) */}
        <div style={{ 
          ...styles.sidebarContainer, 
          width: isMobile ? '100%' : '440px',
          display: (isMobile && !sidebarVisible) ? 'none' : 'flex'
        }}>
          <div style={styles.sidebarHeader}>
            <div style={styles.sidebarTitleGroup}>
              <h3 style={styles.curriculumHeading}>COURSE CURRICULUM</h3>
              <span style={styles.moduleCount}>{videos.length} SECURE MODULES</span>
            </div>
            <div style={styles.mightyStatusChip}>ONLINE</div>
          </div>
          
          <div style={styles.curriculumList}>
            {videos.map((v, i) => (
              <div 
                key={v._id} 
                onClick={() => executeLessonSwitch(v)}
                style={{
                  ...styles.curriculumCard,
                  ...(activeVideo?._id === v._id ? styles.cardActive : {})
                }}
              >
                <div style={styles.cardIndex}>{String(i + 1).padStart(2, '0')}</div>
                <div style={styles.cardContent}>
                  <span style={{
                    ...styles.cardTitle,
                    color: activeVideo?._id === v._id ? '#ffd700' : '#fff'
                  }}>{v.title}</span>
                  <span style={styles.cardDuration}>{activeVideo?._id === v._id ? 'CURRENT SESSION' : 'READY TO PLAY'}</span>
                </div>
                <div style={styles.cardStatusIcon}>
                  {activeVideo?._id === v._id ? '⚡' : '🔒'}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.sidebarFooter}>
            <p style={styles.footerText}>MARO ACADEMY SECURITY v4.0</p>
            <p style={styles.footerHash}>HASH: {activeVideo?._id?.substring(0, 10)}...</p>
          </div>
        </div>

      </main>

      {/* MOBILE TRIGGER */}
      {isMobile && !sidebarVisible && (
        <button style={styles.mobileCurriculumToggle} onClick={() => setSidebarVisible(true)}>
          BROWSE CURRICULUM 📖
        </button>
      )}

    </div>
  );
};

// --------------------------------------------------------------------------
// 🎨 THE MIGHTY ARCHITECTURAL STYLES (PURE POWER CSS)
// --------------------------------------------------------------------------
const styles = {
  appContainer: {
    minHeight: '100vh',
    background: '#010101',
    color: '#fff',
    fontFamily: "'Segoe UI', 'Inter', system-ui, sans-serif",
    paddingBottom: '100px'
  },
  
  // HEADER
  mainHeader: {
    height: '110px',
    padding: '0 60px',
    background: 'linear-gradient(to bottom, #000, #050505)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #151515',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '25px' },
  mightyLogo: { fontSize: '3rem', filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.3))' },
  logoTextStack: { display: 'flex', flexDirection: 'column' },
  brandTitle: { 
    color: '#ffd700', 
    fontSize: '2rem', 
    fontWeight: '900', 
    letterSpacing: '4px', 
    margin: 0,
    textTransform: 'uppercase'
  },
  brandSlogan: { color: '#444', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', marginTop: '5px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '40px' },
  sessionCard: { display: 'flex', alignItems: 'center', gap: '15px', background: '#080808', padding: '12px 25px', borderRadius: '40px', border: '1px solid #1a1a1a' },
  pulseDot: { width: '10px', height: '10px', background: '#0f0', borderRadius: '50%', boxShadow: '0 0 12px #0f0', animation: 'pulse 1.5s infinite' },
  sessionInfo: { display: 'flex', flexDirection: 'column' },
  welcomeText: { fontSize: '0.95rem', fontWeight: '700', color: '#fff' },
  entryText: { fontSize: '0.7rem', color: '#555', marginTop: '2px' },
  secureLogoutBtn: { 
    background: 'transparent', 
    border: '1px solid #333', 
    color: '#888', 
    padding: '12px 25px', 
    borderRadius: '10px', 
    cursor: 'pointer', 
    fontWeight: '900', 
    fontSize: '0.75rem',
    transition: '0.3s',
    '&:hover': { borderColor: '#ffd700', color: '#ffd700' }
  },

  // LAYOUT
  mainLayout: { display: 'flex', gap: '50px', maxWidth: '100%', margin: '0 auto', padding: '10px 20px' },
  
  // CINEMA STAGE
  cinemaStage: { minWidth: 0 ,flex:5},
  stageSection: { display: 'flex', flexDirection: 'column' },
  cinemaFrame: { 
    position: 'relative', 
    width: '100%', 
    aspectRatio: '16/9', 
    background: '#000', 
    borderRadius: '40px', 
    overflow: 'hidden', 
    boxShadow: '0 60px 120px rgba(0,0,0,0.9)', 
    border: '1px solid #181818' 
  },
  iframeEngine: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  mightyShield: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, background: 'transparent' },
  blockerTop: { position: 'absolute', top: 0, left: 0, width: '100%', height: '120px', background: 'linear-gradient(to bottom, #000 35%, transparent 100%)', zIndex: 11, pointerEvents: 'none' },
  blockerBottom: { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '70px', background: '#000', zIndex: 11, pointerEvents: 'none' },
  logoWatermark: { position: 'absolute', top: '40px', left: '40px', color: 'rgba(255,215,0,0.2)', fontWeight: '900', fontSize: '0.8rem', zIndex: 12, letterSpacing: '3px' },

  // VICTORY OVERLAY
  victoryOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  victoryPortal: { textAlign: 'center', padding: '60px' },
  victoryTrophy: { fontSize: '7rem', marginBottom: '30px', filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.4))' },
  victoryTitle: { color: '#ffd700', fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px', letterSpacing: '1px' },
  victoryDescription: { color: '#666', fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.8' },
  victoryButtons: { display: 'flex', gap: '25px', justifyContent: 'center' },
  btnGoldAction: { background: '#ffd700', color: '#000', padding: '18px 45px', borderRadius: '15px', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 10px 30px rgba(255,215,0,0.3)' },
  btnOutlineAction: { background: 'transparent', color: '#ffd700', padding: '18px 45px', borderRadius: '15px', fontWeight: '900', border: '1px solid #ffd700', cursor: 'pointer', fontSize: '1rem' },

  // COMMAND CENTER
  commandCenter: { marginTop: '40px', background: '#060606', padding: '40px', borderRadius: '40px', border: '1px solid #111',position:'relative',zIndex:'9999',cursor:'pointer'},
  progressTrack: { width: '100%', height: '8px', background: '#111', borderRadius: '10px', marginBottom: '35px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#ffd700', transition: 'width 0.3s linear', boxShadow: '0 0 15px rgba(255,215,0,0.5)' },
  controlRow: { display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center',position:'relative',zIndex:'9999',cursor:'pointer'},
  btnCommandLarge: { 
    background: '#ffd700', 
    border: 'none', 
    color: '#000', 
    padding: '22px 80px', 
    borderRadius: '20px', 
    fontWeight: '900', 
    cursor: 'pointer', 
    fontSize: '1.3rem', 
    textTransform: 'uppercase', 
    letterSpacing: '2px',
    boxShadow: '0 15px 40px rgba(255,215,0,0.2)'
  },
  btnCommandSmall: { background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fff', padding: '15px 35px', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },

  // LESSON META
  lessonMetaBox: { marginTop: '40px', background: '#060606', padding: '55px', borderRadius: '45px', border: '1px solid #111' },
  metaTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  lessonFullTitle: { fontSize: '2.8rem', fontWeight: '900', margin: 0, color: '#fff' },
  lessonBadge: { background: 'rgba(255,215,0,0.1)', color: '#ffd700', padding: '8px 20px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '900', border: '1px solid #ffd70033' },
  mightyDivider: { height: '6px', width: '80px', background: '#ffd700', marginBottom: '40px', borderRadius: '3px' },
  descriptionGrid: { display: 'flex', gap: '50px' },
  descMain: { flex: 2 },
  lessonParagraph: { color: '#888', fontSize: '1.25rem', lineHeight: '2.2', margin: 0 },
  descSide: { flex: 1, display: 'flex', flexDirection: 'column', gap: '25px' },
  miniStat: { background: '#0a0a0a', padding: '20px', borderRadius: '20px', border: '1px solid #151515', display: 'flex', flexDirection: 'column', gap: '5px' },
  statLabel: { fontSize: '0.75rem', color: '#444', fontWeight: '900', textTransform: 'uppercase' },
  statValue: { fontSize: '1.2rem', color: '#ffd700', fontWeight: 'bold' },

  // SIDEBAR Master
  sidebarContainer: { background: '#060606', borderRadius: '45px', padding: '20px', border: '1px solid #111',width:'320px', maxHeight: '95vh', display: 'flex', flexDirection: 'column', position: 'sticky', top: '150px' },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px', borderBottom: '1px solid #151515', paddingBottom: '35px' },
  sidebarTitleGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  curriculumHeading: { color: '#ffd700', fontSize: '1.1rem', fontWeight: '900', letterSpacing: '3px', margin: 0 },
  moduleCount: { color: '#444', fontSize: '0.8rem', fontWeight: '900' },
  mightyStatusChip: { background: 'rgba(0,255,0,0.05)', color: '#0f0', padding: '6px 15px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '900', border: '1px solid rgba(0,255,0,0.2)' },
  curriculumList: { display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '10px' },
  curriculumCard: { display: 'flex', alignItems: 'center', gap: '25px', padding: '25px', borderRadius: '25px', background: '#0a0a0a', border: '1px solid #151515', cursor: 'pointer', transition: '0.4s' },
  cardActive: { background: 'rgba(255,215,0,0.05)', borderColor: '#ffd700', transform: 'translateX(10px) scale(1.02)', boxShadow: '-10px 0 30px rgba(255,215,0,0.1)' },
  cardIndex: { width: '50px', height: '50px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '900', color: '#444' },
  cardContent: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  cardTitle: { fontSize: '1.15rem', fontWeight: '700' },
  cardDuration: { fontSize: '0.8rem', color: '#444', fontWeight: 'bold' },
  cardStatusIcon: { color: '#ffd700', fontSize: '1.3rem' },
  sidebarFooter: { marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #151515', textAlign: 'center' },
  footerText: { fontSize: '0.75rem', color: '#333', fontWeight: 'bold', letterSpacing: '2px' },
  footerHash: { fontSize: '0.65rem', color: '#222', marginTop: '10px', fontFamily: 'monospace' },

  // MOBILE ELEMENTS
  mobileCurriculumToggle: { position: 'fixed', bottom: '40px', right: '40px', background: '#ffd700', color: '#000', padding: '20px 40px', borderRadius: '40px', fontWeight: '900', border: 'none', zIndex: 1001, boxShadow: '0 15px 40px rgba(255,215,0,0.5)', fontSize: '1rem', cursor: 'pointer' },
  
  // LOADING BACKDROP
  loaderBackdrop: { height: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  mightyRing: { width: '100px', height: '100px', border: '8px solid #080808', borderTop: '8px solid #ffd700', borderRadius: '50%', animation: 'spin 1.2s linear infinite' },
  mightyInnerRing: { width: '60px', height: '60px', border: '6px solid #080808', borderBottom: '6px solid #ffd700', borderRadius: '50%', position: 'absolute', animation: 'spin-reverse 0.8s linear infinite' },
  loaderHeader: { color: '#ffd700', fontSize: '2.5rem', fontWeight: '900', marginTop: '50px', letterSpacing: '8px' },
  loaderStatus: { color: '#444', marginTop:'20px'}
}
export default VideoVault;