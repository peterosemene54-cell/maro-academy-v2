import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VideoVault = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const navigate = useNavigate();
  const playerRef = useRef(null);
  const playerDivId = 'mighty-vault-player';
  const API_URL = "https://maro-academy-v2.onrender.com";

  // ===============================
  // 🛡️ SECURITY & RESPONSIVENESS
  // ===============================
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);

    const preventSabotage = (e) => {
      if (e.type === "contextmenu") e.preventDefault();
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
      window.removeEventListener('resize', handleResize);
      document.removeEventListener("contextmenu", preventSabotage);
      document.removeEventListener("keydown", preventSabotage);
    };
  }, []);

  // ===============================
  // 🔑 DATA INITIALIZATION
  // ===============================
  const initializeVault = useCallback(async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/videos`);
      const data = response.data;
      setVideos(data);
      if (data.length > 0) {
        setActiveVideo(data[0]);
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
  // 🎥 THE MIGHTY PLAYER ENGINE (FINAL FIX)
  // ===============================

  // Step 1 — Create the player ONCE on mount, never destroy it
  useEffect(() => {
    const createPlayer = () => {
      setTimeout(() => {
        const el = document.getElementById(playerDivId);
        if (!el || !window.YT || !window.YT.Player) return;
        if (playerRef.current) return; // already created, don't recreate

        playerRef.current = new window.YT.Player(playerDivId, {
          videoId: '', // start empty, video loaded in Step 2
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            disablekb: 1,
            iv_load_policy: 3,
            fs: 0,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              console.log("🏛️ MIGHTY ENGINE READY");
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                setVideoEnded(true);
                setIsPlaying(false);
              }
              if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
              if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            },
          },
        });
      }, 200);
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      if (!document.getElementById('yt-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) {}
        playerRef.current = null;
      }
    };
  }, []); // ✅ runs ONCE only on mount

  // Step 2 — When activeVideo changes, just load the new video into existing player
  useEffect(() => {
    if (!activeVideo) return;

    setVideoEnded(false);
    setIsPlaying(false);

    const savedTime = parseFloat(
      localStorage.getItem(`progress_${activeVideo._id}`) || '0'
    );

    // ✅ KEY FIX: use cueVideoById instead of destroying/recreating player
    // This swaps the video WITHOUT touching the player instance at all
    const loadVideo = () => {
      if (!playerRef.current || typeof playerRef.current.cueVideoById !== 'function') {
        // Player not ready yet, wait and retry
        setTimeout(loadVideo, 300);
        return;
      }
      try {
        playerRef.current.cueVideoById({
          videoId: activeVideo.videoId,
          startSeconds: Math.floor(savedTime),
        });
      } catch (e) {
        console.error("Load video error:", e);
      }
    };

    setTimeout(loadVideo, 250);
  }, [activeVideo]);

  // Progress Save
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
  // 🛠️ MIGHTY HANDLERS
  // ===============================
  const togglePlayback = () => {
    if (!playerRef.current) return;
    if (typeof playerRef.current.getPlayerState !== 'function') return;
    const state = playerRef.current.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSkip = (delta) => {
    if (!playerRef.current || videoEnded) return;
    try {
      const current = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(current + delta, true);
      playerRef.current.playVideo();
    } catch (e) {}
  };

  const handleSelectVideo = (video) => {
    if (activeVideo?._id === video._id) return; // already selected
    setLoading(true);
    setVideoEnded(false);
    setActiveVideo(video);
    setTimeout(() => setLoading(false), 800);
  };

  if (loading) return (
    <div style={styles.loadingWrapper}>
      <div style={styles.loaderSpinner}></div>
      <h2 style={{ color: '#ffd700', marginTop: '20px' }}>🔐 UNLOCKING VAULT...</h2>
    </div>
  );

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

      <div style={{ ...styles.layout, flexDirection: isMobile ? 'column' : 'row' }}>

        {/* LEFT — THE MIGHTY PLAYER SECTION */}
        <div style={{ ...styles.playerSection, flex: isMobile ? 'none' : 3.5 }}>
          {activeVideo && (
            <>
              <div style={styles.playerWrapper}>
                <div id={playerDivId} style={styles.playerDiv} />
                <div style={styles.mightyShield} />
                <div style={styles.topLeftBlocker} />
                <div style={styles.topRightBlocker} />
                <div style={styles.bottomBlocker} />

                {videoEnded && (
                  <div style={styles.endOverlay}>
                    <div style={styles.endCard}>
                      <div style={styles.endIcon}>🎓</div>
                      <h2 style={styles.endTitle}>Lesson Complete!</h2>
                      <p style={styles.endText}>Ready for the next challenge? Select the next lesson from the curriculum.</p>
                      <button style={styles.replayBtn} onClick={() => {
                        setVideoEnded(false);
                        if (playerRef.current) {
                          try {
                            playerRef.current.seekTo(0, true);
                            playerRef.current.playVideo();
                          } catch (e) {}
                        }
                      }}>Replay Lesson</button>
                    </div>
                  </div>
                )}
              </div>

              {/* CONTROLS */}
              <div style={styles.controls}>
                <button style={styles.skipBtn} onClick={() => handleSkip(-10)}>⏪ 10s</button>
                <button style={styles.playBtn} onClick={togglePlayback}>
                  {isPlaying ? '⏸ PAUSE' : '▶ PLAY LESSON'}
                </button>
                <button style={styles.skipBtn} onClick={() => handleSkip(10)}>10s ⏩</button>
              </div>

              {/* INFO BOX */}
              <div style={styles.infoBox}>
                <h2 style={styles.videoTitle}>{activeVideo.title}</h2>
                <div style={styles.divider} />
                <p style={styles.videoDesc}>{activeVideo.description || "Unlock the full potential of your academic journey with this in-depth tutorial."}</p>
              </div>
            </>
          )}
        </div>

        {/* RIGHT — SIDEBAR CURRICULUM */}
        <div style={{ ...styles.sidebar, width: isMobile ? '100%' : '380px' }}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.sidebarTitle}>COURSE CURRICULUM</h3>
            <span style={styles.videoCount}>{videos.length} LESSONS</span>
          </div>

          <div style={styles.videoList}>
            {videos.map((v) => (
              <div
                key={v._id}
                onClick={() => handleSelectVideo(v)}
                style={{
                  ...styles.videoItem,
                  ...(activeVideo?._id === v._id ? styles.videoItemActive : {})
                }}
              >
                <div style={styles.videoItemStatus}>
                  {activeVideo?._id === v._id ? '▶' : '○'}
                </div>
                <span style={styles.videoItemTitle}>{v.title}</span>
                <div style={styles.lockIcon}>🔒</div>
              </div>
            ))}
          </div>

          {videoEnded && (
            <div style={styles.lockedNotice}>
              ✅ Current lesson completed! <br />
              <b>You can now click the next lesson below.</b>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===============================
// 🎨 MIGHTY STYLES
// ===============================
const styles = {
  container: { minHeight: '100vh', background: '#050505', color: '#fff', paddingBottom: '50px' },
  header: { padding: '20px 40px', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111', marginBottom: '30px' },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '15px' },
  logoIcon: { fontSize: '2rem' },
  logo: { color: '#ffd700', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px', margin: 0 },
  userMeta: { display: 'flex', alignItems: 'center', gap: '20px' },
  userName: { color: '#888', fontWeight: '500' },
  logoutBtn: { background: 'transparent', border: '1px solid #333', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  layout: { display: 'flex', gap: '30px', maxWidth: '100%', margin: '0 auto', padding: '0 40px' },
  playerSection: { minWidth: 0 },

  // ✅ FIX: use paddingBottom % trick for true responsive 16:9
  // and slightly increased size by bumping paddingBottom from 56.25% to 58%
  playerWrapper: {
    position: 'relative',
    width: '100%',
    paddingBottom: '58%',   // slightly taller than 16:9 (56.25%) for a bigger feel
    background: '#000',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 30px 60px rgba(0,0,0,0.7)',
    border: '1px solid #111',
  },

  playerDiv: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  mightyShield: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, background: 'transparent' },
  topLeftBlocker: { position: 'absolute', top: 0, left: 0, width: '50%', height: '80px', background: 'linear-gradient(to bottom, #000 40%, transparent 100%)', zIndex: 11 },
  topRightBlocker: { position: 'absolute', top: 0, right: 0, width: '150px', height: '80px', background: 'linear-gradient(to bottom, #000 40%, transparent 100%)', zIndex: 11 },
  bottomBlocker: { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '55px', background: '#000', zIndex: 11 },
  endOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  endCard: { textAlign: 'center', padding: '40px' },
  endIcon: { fontSize: '4rem', marginBottom: '15px' },
  endTitle: { color: '#ffd700', fontSize: '2rem', marginBottom: '10px' },
  endText: { color: '#888', maxWidth: '350px', margin: '0 auto 20px', lineHeight: '1.6' },
  replayBtn: { background: '#ffd700', color: '#000', padding: '10px 25px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  controls: { display: 'flex', gap: '20px', justifyContent: 'center', margin: '30px 0' },
  playBtn: { background: '#ffd700', border: 'none', color: '#000', padding: '12px 45px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '1rem', textTransform: 'uppercase' },
  skipBtn: { background: '#111', border: '1px solid #222', color: '#fff', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' },
  infoBox: { background: '#0a0a0a', padding: '30px', borderRadius: '20px', border: '1px solid #111' },
  videoTitle: { fontSize: '1.8rem', color: '#fff', margin: '0 0 10px' },
  divider: { height: '3px', width: '40px', background: '#ffd700', marginBottom: '20px' },
  videoDesc: { color: '#888', lineHeight: '1.8' },
  sidebar: { background: '#0a0a0a', borderRadius: '20px', padding: '24px', border: '1px solid #111', maxHeight: '85vh', overflowY: 'auto' },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' },
  sidebarTitle: { color: '#ffd700', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold' },
  videoCount: { color: '#444', fontSize: '0.7rem' },
  videoList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  videoItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '16px', borderRadius: '12px', cursor: 'pointer', background: '#111', border: '1px solid transparent', transition: '0.2s' },
  videoItemActive: { background: 'rgba(255,215,0,0.1)', borderColor: '#ffd700', color: '#ffd700' },
  videoItemTitle: { fontSize: '0.95rem', fontWeight: '500' },
  lockIcon: { marginLeft: 'auto', color: '#ffd700', fontSize: '0.9rem' },
  lockedNotice: { marginTop: '20px', padding: '15px', background: 'rgba(255,215,0,0.05)', borderRadius: '10px', color: '#ffd700', fontSize: '0.85rem', textAlign: 'center', border: '1px solid rgba(255,215,0,0.1)' },
  loadingWrapper: { height: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  loaderSpinner: { width: '50px', height: '50px', border: '4px solid #111', borderTop: '4px solid #ffd700', borderRadius: '50%', animation: 'spin 1s linear infinite' }
};

export default VideoVault;