import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VideoVault = ({ user }) => {
  // ===============================
  // STATE & REFS
  // ===============================
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const navigate = useNavigate();
  const playerRef = useRef(null);      // Holds the YT.Player instance
  const playerDivId = 'mighty-vault-player';
  const API_URL = "https://maro-academy-v2.onrender.com";

  // ===============================
  // 🛡️ MIGHTY SECURITY LAYER
  // Blocks Right-Click, F12, and Inspect Element
  // ===============================
  useEffect(() => {
    const preventSabotage = (e) => {
      // Block Right Click
      if (e.type === "contextmenu") e.preventDefault();
      
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || 
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", preventSabotage);
    document.addEventListener("keydown", preventSabotage);
    
    return () => {
      document.removeEventListener("contextmenu", preventSabotage);
      document.removeEventListener("keydown", preventSabotage);
    };
  }, []);

  // ===============================
  // DATA INITIALIZATION
  // ===============================
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
      setTimeout(() => setLoading(false), 1200);
    } catch (error) {
      console.error("🚨 VAULT ERROR:", error);
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    initializeVault();
  }, [initializeVault]);

  // ===============================
  // 🎥 THE MIGHTY PLAYER ENGINE
  // Handles YouTube API & Security
  // ===============================
  useEffect(() => {
    if (!activeVideo) return;

    // 1. Destroy old player to prevent memory leaks
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch (e) {}
      playerRef.current = null;
    }

    setVideoEnded(false);
    setIsPlaying(false);

    const savedTime = parseFloat(
      localStorage.getItem(`progress_${activeVideo._id}`) || '0'
    );

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player(playerDivId, {
        videoId: activeVideo.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,          // NO RUBBISH YT CONTROLS
          modestbranding: 1,    // HIDE LOGO
          rel: 0,               // NO SUGGESTED VIDEOS
          disablekb: 1,         // DISABLE KEYBOARD HACKS
          iv_load_policy: 3,    // HIDE ANNOTATIONS
          fs: 0,                // DISABLE FULLSCREEN (Protects UI)
          playsinline: 1,       // FOR MOBILE USERS
          start: Math.floor(savedTime),
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
          onStateChange: (event) => {
            // 0 = Ended
            if (event.data === window.YT.PlayerState.ENDED) {
              setVideoEnded(true);
              setIsPlaying(false);
            }
            // 1 = Playing
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            }
            // 2 = Paused
            if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    // Load API if not present, else just create
    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://youtube.com';
      window.onYouTubeIframeAPIReady = createPlayer;
      document.body.appendChild(tag);
    }

    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [activeVideo]);

  // ===============================
  // 💾 PROGRESS PERSISTENCE
  // Saves time every 5 seconds
  // ===============================
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime && activeVideo) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          if (currentTime > 0) {
            localStorage.setItem(`progress_${activeVideo._id}`, currentTime);
          }
        } catch (e) {}
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeVideo]);

  // ===============================
  // HANDLERS (BACK/FORWARD/PLAY)
  // ===============================
  const handleSkip = (delta) => {
    if (!playerRef.current || videoEnded) return;
    try {
      const current = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(current + delta, true);
      playerRef.current.playVideo();
    } catch (e) {}
  };

  const togglePlayback = () => {
  if (!playerRef.current) return;

  if (isPlaying) {
    playerRef.current.pauseVideo(); // If playing, then PAUSE
    setIsPlaying(false);
  } else {
    playerRef.current.playVideo();  // If paused, then PLAY
    setIsPlaying(true);
  }
};


  const handleSelectVideo = (video) => {
    if (videoEnded) return; // Locked navigation
    setActiveVideo(video);
  };

  // ===============================
  // LOADING UI
  // ===============================
  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.loaderSpinner}></div>
        <h2 style={{ color: '#ffd700', marginTop: '20px' }}>🔐 UNLOCKING VAULT...</h2>
      </div>
    );
  }

  // ===============================
  // THE GREAT UI RETURN
  // ===============================
  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logoGroup}>
          <span style={styles.logoIcon}>🏛️</span>
          <h1 style={styles.logo}>MARO ACADEMY PRO</h1>
        </div>
        <div style={styles.userMeta}>
          <span style={styles.userName}>{user?.name || 'Academic'}</span>
          <button style={styles.logoutBtn} onClick={() => navigate('/login')}>Logout</button>
        </div>
      </div>

      <div style={styles.layout}>
        {/* LEFT — THE MIGHTY PLAYER SECTION */}
        <div style={styles.playerSection}>
          {activeVideo && (
            <>
              <div style={styles.playerWrapper}>
                {/* 1. THE ACTUAL PLAYER DIV */}
                <div id={playerDivId} style={styles.playerDiv} />

                {/* 2. THE MIGHTY SHIELD (Click-Jacking Protection) */}
                <div style={styles.mightyShield} onContextMenu={(e) => e.preventDefault()} />

                {/* 3. BRANDING BLOCKERS */}
                <div style={styles.topLeftBlocker} />
                <div style={styles.topRightBlocker} />
                <div style={styles.bottomBlocker} />

                {/* 4. END SCREEN OVERLAY */}
                {videoEnded && (
                  <div style={styles.endOverlay}>
                    <div style={styles.endCard}>
                      <div style={styles.endIcon}>🎓</div>
                      <h2 style={styles.endTitle}>Lesson Complete!</h2>
                      <p style={styles.endText}>You have completed this stage. Contact your instructor to unlock the next vault.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* MIGHTY CONTROLS */}
              <div style={styles.controls}>
                <button 
                  style={{...styles.skipBtn, ...(videoEnded ? styles.disabledBtn : {})}} 
                  onClick={() => handleSkip(-10)}
                  disabled={videoEnded}
                >
                  ⏪ 10s
                </button>

                <button 
                  style={{...styles.playBtn, ...(videoEnded ? styles.disabledBtn : {})}} 
                  onClick={togglePlayback}
                  disabled={videoEnded}
                >
                  {isPlaying ? '⏸ PAUSE' : '▶ PLAY LESSON'}
                </button>

                <button 
                  style={{...styles.skipBtn, ...(videoEnded ? styles.disabledBtn : {})}} 
                  onClick={() => handleSkip(10)}
                  disabled={videoEnded}
                >
                  10s ⏩
                </button>
              </div>

              {/* VIDEO INFO */}
              <div style={styles.infoBox}>
                <h2 style={styles.videoTitle}>{activeVideo.title}</h2>
                <div style={styles.divider}></div>
                <p style={styles.videoDesc}>{activeVideo.description}</p>
              </div>
            </>
          )}
        </div>

        {/* RIGHT — MIGHTY SIDEBAR */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.sidebarTitle}>COURSE CURRICULUM</h3>
            <span style={styles.videoCount}>{videos.length} LESSONS</span>
          </div>

          <div style={styles.videoList}>
            {videos.map((video) => {
              const isActive = activeVideo?._id === video._id;
              return (
                <div
                  key={video._id}
                  onClick={() => handleSelectVideo(video)}
                  style={{
                    ...styles.videoItem,
                    ...(isActive ? styles.videoItemActive : {}),
                    ...(videoEnded ? styles.videoItemLocked : {}),
                  }}
                >
                  <div style={styles.videoItemStatus}>
                    {isActive ? '▶' : '○'}
                  </div>
                  <div style={styles.videoItemInfo}>
                    <span style={styles.videoItemTitle}>{video.title}</span>
                  </div>
                  {videoEnded && <span style={styles.lockIcon}>🔒</span>}
                </div>
              );
            })}
          </div>

          {videoEnded && (
            <div style={styles.lockedNotice}>
              ⚠️ Navigation is locked while lesson is completed. Refresh to restart or proceed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===============================
// MIGHTY STYLES (500+ LINES READY)
// ===============================
const styles = {
  loadingWrapper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#050505',
  },
  loaderSpinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #111',
    borderTop: '5px solid #ffd700',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  container: {
    background: '#050505',
    minHeight: '100vh',
    color: '#fff',
    padding: '24px 40px',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    borderBottom: '1px solid #1a1a1a',
    paddingBottom: '20px',
  },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { fontSize: '2rem' },
  logo: {
    color: '#ffd700',
    margin: 0,
    fontSize: '1.4rem',
    letterSpacing: '3px',
    fontWeight: '800',
  },
  userMeta: { display: 'flex', alignItems: 'center', gap: '20px' },
  userName: { color: '#888', fontSize: '0.9rem', fontWeight: '500' },
  logoutBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid #333',
    color: '#aaa',
    padding: '8px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: '0.3s',
  },
  layout: {
    display: 'flex',
    gap: '40px',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  playerSection: { flex: 1, minWidth: 0 },
  playerWrapper: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
    borderRadius: '16px',
    marginBottom: '24px',
    background: '#000',
    boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
    border: '1px solid #1a1a1a',
  },
  playerDiv: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    pointerEvents: 'none', // THE MIGHTY DIGITAL LOCK
  },
  mightyShield: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    zIndex: 10,
    background: 'transparent', // THE MIGHTY PHYSICAL WALL
  },
  topLeftBlocker: {
    position: 'absolute', top: 0, left: 0,
    width: '50%', height: '80px',
    background: 'linear-gradient(to bottom, #000 30%, transparent 100%)',
    zIndex: 11, pointerEvents: 'none',
  },
  topRightBlocker: {
    position: 'absolute', top: 0, right: 0,
    width: '150px', height: '80px',
    background: 'linear-gradient(to bottom, #000 30%, transparent 100%)',
    zIndex: 11, pointerEvents: 'none',
  },
  bottomBlocker: {
    position: 'absolute', bottom: 0, left: 0,
    width: '100%', height: '55px',
    background: '#000',
    zIndex: 11, pointerEvents: 'none',
  },
  endOverlay: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.96)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  endCard: { textAlign: 'center', padding: '40px' },
  endIcon: { fontSize: '5rem', marginBottom: '20px' },
  endTitle: { color: '#ffd700', fontSize: '2.4rem', marginBottom: '15px' },
  endText: { color: '#888', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto', lineHeight: '1.7' },
  controls: { display: 'flex', gap: '16px', marginBottom: '30px' },
  skipBtn: {
    background: '#111',
    border: '1px solid #222',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: '0.2s',
  },
  playBtn: {
    background: '#ffd700',
    border: 'none',
    color: '#000',
    padding: '12px 40px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '800',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: '0.2s',
  },
  disabledBtn: { opacity: 0.2, cursor: 'not-allowed' },
  infoBox: { background: '#0a0a0a', padding: '30px', borderRadius: '16px', border: '1px solid #111' },
  videoTitle: { color: '#fff', margin: '0 0 15px', fontSize: '1.8rem', fontWeight: '700' },
  divider: { height: '2px', width: '60px', background: '#ffd700', marginBottom: '20px' },
  videoDesc: { color: '#888', fontSize: '1rem', lineHeight: '1.8' },
  sidebar: { width: '350px', flexShrink: 0, background: '#0a0a0a', borderRadius: '16px', padding: '24px', border: '1px solid #111', maxHeight: '85vh', overflowY: 'auto' },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' },
  sidebarTitle: { color: '#ffd700', margin: 0, fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold' },
  videoCount: { color: '#444', fontSize: '0.7rem', fontWeight: 'bold' },
  videoList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  videoItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '16px', borderRadius: '10px', cursor: 'pointer', background: '#111', border: '1px solid transparent', transition: '0.2s' },
  videoItemActive: { background: '#1e1e00', borderColor: '#ffd70033', color: '#ffd700' },
  videoItemLocked: { opacity: 0.4, cursor: 'not-allowed' },
  videoItemStatus: { fontSize: '0.9rem', color: '#ffd700' },
  videoItemTitle: { fontSize: '0.95rem', fontWeight: '500' },
  lockIcon: { marginLeft: 'auto', fontSize: '0.9rem', color: '#ffd700' },
  lockedNotice: { marginTop: '20px', padding: '15px', background: '#200', borderRadius: '8px', color: '#f55', fontSize: '0.85rem', textAlign: 'center', border: '1px solid #400' },
};

export default VideoVault;
