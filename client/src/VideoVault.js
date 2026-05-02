import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const VideoVault = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFreeMode, setIsFreeMode] = useState(false);

  const navigate = useNavigate();
  const playerRef = useRef(null);
  const playerDivId = 'mighty-vault-player';
  const API_URL = "https://maro-academy-v2.onrender.com";

  // ===============================
  // 🛡️ 1. THE NUCLEAR KICK FUNCTION
  // ===============================
  const handleInstantKick = (reason) => {
    localStorage.removeItem('maroToken');
    localStorage.removeItem('maroUser');
    window.location.replace(`/login?reason=${encodeURIComponent(reason)}`);
  };

  // ===============================
  // 🌐 2. BROWSER DETECTION
  // ===============================
  useEffect(() => {
    const ua = navigator.userAgent;
    const isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor);
    const isOpera = /OPR/.test(ua) || /Opera/.test(ua);
    const isUC = /UCBrowser/.test(ua);
    const isSamsung = /SamsungBrowser/.test(ua);

    if (!isChrome || isOpera || isUC || isSamsung) {
      navigate('/browser-warning');
    }
  }, [navigate]);

  // ===============================
  // 🛡️ 3. HTTP BACKUP CHECKER (Catches mode switch even if sockets fail)
  // ===============================
  useEffect(() => {
    const checkSystemMode = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/settings`);
        const isNowPaidMode = res.data.paymentRequired;

        if (isNowPaidMode) {
          const savedUser = JSON.parse(localStorage.getItem('maroUser'));
          if (!savedUser || !savedUser.isPaid) {
            handleInstantKick('System locked by Admin. Login again.');
            return;
          } else {
            setIsFreeMode(false);
          }
        } else {
          setIsFreeMode(true);
        }
      } catch (e) {
        console.error("Mode check failed");
      }
    };

    checkSystemMode();
    const backupChecker = setInterval(checkSystemMode, 10000); // Check every 10 seconds
    return () => clearInterval(backupChecker);
  }, []);

  // ===============================
  // ⚡ 4. WEBSOCKET LISTENER (For instant kick if network allows)
  // ===============================
  useEffect(() => {
    if (!user) return;
    
    const socket = io(API_URL, { 
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    socket.on('connect', () => {
      socket.emit('init_vault_session', user._id);
    });

    socket.on('system_broadcast', (data) => {
      if (data.payment === true) {
        handleInstantKick('System locked by Admin. Login again.');
      } else if (data.payment === false) {
        setIsFreeMode(true); 
      }
    });

    socket.on('force_disconnect', (data) => {
      handleInstantKick(data.reason || 'Access revoked.');
    });

    socket.on('security_alert', (data) => {
      if (data.type === 'EXPIRED') {
        handleInstantKick(data.message);
      }
    });

    return () => socket.disconnect();
  }, [user]);

  // ===============================
  // ⏰ 5. MIGHTY EXPIRY WATCHER (Only runs in Paid Mode)
  // ===============================
  useEffect(() => {
    if (isFreeMode) return;

    const checkExpiry = async () => {
      const savedUser = localStorage.getItem('maroUser');
      if (!savedUser) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(savedUser);
      if (!userData.expiryDate || !userData._id) return;

      const now = new Date();
      const expiry = new Date(userData.expiryDate);

      if (now > expiry) {
        try {
          await axios.put(`${API_URL}/api/students/auto-expire/${userData._id}`);
        } catch (e) {
          console.error("Could not update individual status", e);
        }

        handleInstantKick('Your 2-minute access has expired.');
      }
    };

    checkExpiry();
    const expiryWatcher = setInterval(checkExpiry, 1000);
    return () => clearInterval(expiryWatcher);
  }, [navigate, isFreeMode]);

  // ===============================
  // 🛡️ 6. SECURITY & RESPONSIVENESS
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
  // 📺 7. FULLSCREEN TRACKER
  // ===============================
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // ===============================
  // 🔑 8. DATA INITIALIZATION
  // ===============================
  const initializeVault = useCallback(async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('maroToken');
      const headers = token ? { 'x-vault-token': token } : {};
      
      const response = await axios.get(`${API_URL}/api/videos`, { headers });
      
      const data = response.data;
      setVideos(data);
      if (data.length > 0) {
        setActiveVideo(data[0]);
      }
      setTimeout(() => setLoading(false), 1200);
    } catch (error) {
      console.error("🚨 VAULT ERROR:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 402)) {
        handleInstantKick('Access revoked by server.');
      } else {
        setLoading(false);
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    initializeVault();
  }, [initializeVault]);

  // ===============================
  // 🎥 9. THE MIGHTY PLAYER ENGINE
  // ===============================
  useEffect(() => {
    const tryCreatePlayer = () => {
      const el = document.getElementById(playerDivId);
      if (!el) { setTimeout(tryCreatePlayer, 100); return; }
      if (!window.YT || !window.YT.Player) { setTimeout(tryCreatePlayer, 100); return; }
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(playerDivId, {
        videoId: '',
        playerVars: {
          autoplay: 0, controls: 0, modestbranding: 1, showinfo: 0, rel: 0,
          disablekb: 1, iv_load_policy: 3, fs: 0, playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {},
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
    };

    if (!document.getElementById('yt-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    setTimeout(tryCreatePlayer, 300);

    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) {}
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!activeVideo) return;

    setVideoEnded(false);
    setIsPlaying(false);

    const savedTime = parseFloat(localStorage.getItem(`progress_${activeVideo._id}`) || '0');

    const loadVideo = () => {
      if (!playerRef.current || typeof playerRef.current.cueVideoById !== 'function') {
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
  // 🛠️ 10. MIGHTY HANDLERS
  // ===============================
  const togglePlayback = () => {
    if (!playerRef.current) return;
    const state = playerRef.current.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      playerRef.current.pauseVideo();
    } else {
      handleFullscreen(true); 
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
    if (activeVideo?._id === video._id) return;
    setVideoEnded(false);
    setActiveVideo(video);
  };

  const handleFullscreen = (forceEnter = false) => {
    const wrapper = document.getElementById('player-wrapper');
    if (!wrapper) return;

    const isCurrentlyFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);

    if (!isCurrentlyFullscreen) {
      const request = wrapper.requestFullscreen || wrapper.webkitRequestFullscreen || wrapper.msRequestFullscreen;
      if (request) request.call(wrapper);

      try {
        if (window.screen?.orientation?.lock) {
          window.screen.orientation.lock('landscape').catch(() => {});
        }
      } catch (e) {}
    } else if (!forceEnter) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  };

  if (loading) return (
    <div style={styles.loadingWrapper}>
      <div style={styles.loaderSpinner}></div>
      <h2 style={{ color: '#ffd700', marginTop: '20px' }}>🔐 UNLOCKING VAULT...</h2>
    </div>
  );

  return (
    <div style={styles.container}>
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
        <div style={{ ...styles.playerSection, flex: isMobile ? 'none' : 5 }}>
          {activeVideo && (
            <>
              <div 
                id="player-wrapper" 
                style={isFullscreen ? styles.playerWrapperFullscreen : styles.playerWrapper}
              >
                <div id={playerDivId} style={styles.playerDiv} />
                <div style={styles.mightyShield} />
                <div style={styles.topLeftBlocker} />
                <div style={styles.topRightBlocker} />
                <div style={styles.bottomBlocker} />
                <div style={styles.bottomLeftBlocker} />
                <div style={styles.centerTopBlocker} />

                {isMobile && (
                  <button onClick={() => handleFullscreen(false)} style={styles.fullscreenInsideBtn}>
                    {isFullscreen ? '✖' : '⛶'} 
                  </button>
                )}

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

              <div style={{ ...styles.controls, gap: isMobile ? '8px' : '20px', flexWrap: isMobile ? 'wrap' : 'nowrap', padding: isMobile ? '0 10px' : '0' }}>
                <button style={{ ...styles.skipBtn, padding: isMobile ? '10px 12px' : '10px 20px', fontSize: isMobile ? '0.8rem' : '1rem' }} onClick={() => handleSkip(-10)}>⏪ 10s</button>
                <button style={{ ...styles.playBtn, padding: isMobile ? '12px 20px' : '12px 45px', fontSize: isMobile ? '0.85rem' : '1rem', flex: isMobile ? 1 : 'none' }} onClick={togglePlayback}>
                  {isPlaying ? '⏸ PAUSE' : (isMobile ? '▶ PLAY' : '▶ PLAY LESSON')}
                </button>
                <button style={{ ...styles.skipBtn, padding: isMobile ? '10px 12px' : '10px 20px', fontSize: isMobile ? '0.8rem' : '1rem' }} onClick={() => handleSkip(10)}>10s ⏩</button>
                
                {isMobile && (
                  <button onClick={() => handleFullscreen(false)} style={styles.fullscreenControlBtn}>
                    {isFullscreen ? '✖ Exit Fullscreen' : '⛶ Fullscreen'}
                  </button>
                )}
              </div>

              <div style={styles.infoBox}>
                <h2 style={styles.videoTitle}>{activeVideo.title}</h2>
                <div style={styles.divider} />
                <p style={styles.videoDesc}>{activeVideo.description || "Unlock the full potential of your academic journey with this in-depth tutorial."}</p>
              </div>
            </>
          )}
        </div>

        <div style={{ ...styles.sidebar, width: isMobile ? '100%' : '300px', maxHeight: isMobile ? 'none' : '85vh', marginTop: isMobile ? '20px' : '0' }}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.sidebarTitle}>COURSE CURRICULUM</h3>
            <span style={styles.videoCount}>{videos.length} LESSONS</span>
          </div>

          <div style={styles.videoList}>
            {videos.map((v) => (
              <div key={v._id} onClick={() => handleSelectVideo(v)} style={{ ...styles.videoItem, ...(activeVideo?._id === v._id ? styles.videoItemActive : {}) }}>
                <div style={styles.videoItemStatus}>{activeVideo?._id === v._id ? '▶' : '○'}</div>
                <span style={styles.videoItemTitle}>{v.title}</span>
                <div style={styles.lockIcon}>{isFreeMode ? '🔓' : '🔒'}</div>
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

const styles = {
  container: { minHeight: '100vh', background: '#050505', color: '#fff', paddingBottom: '50px' },
  header: { padding: '20px 40px', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111', marginBottom: '30px' },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '15px' },
  logoIcon: { fontSize: '2rem' },
  logo: { color: '#ffd700', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px', margin: 0 },
  userMeta: { display: 'flex', alignItems: 'center', gap: '20px' },
  userName: { color: '#888', fontWeight: '500' },
  logoutBtn: { background: 'transparent', border: '1px solid #333', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  layout: { display: 'flex', gap: '20px', maxWidth: '100%', margin: '0 auto', padding: '0 20px' },
  playerSection: { minWidth: 0 },
  playerWrapper: { position: 'relative', width: '100%', paddingBottom: '56.25%', background: '#000', borderRadius: '24px', overflow: 'visible', boxShadow: '0 30px 60px rgba(0,0,0,0.7)', border: '1px solid #111' },
  playerWrapperFullscreen: { position: 'relative', width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' },
  playerDiv: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  mightyShield: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, background: 'transparent' },
  topRightBlocker: { display: 'none' },
  bottomBlocker: { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60px', background: 'rgba(0,0,0,0.55)', zIndex: 11 },
  topLeftBlocker: { position: 'absolute', top: 0, left: 0, width: '100%', height: '60px', background: 'rgba(0,0,0,0.85)', zIndex: 11 },
  centerTopBlocker: { display: 'none' },
  fullscreenInsideBtn: { position: 'absolute', bottom: '70px', right: '10px', zIndex: 999, background: 'rgba(0,0,0,0.8)', color: '#ffd700', border: '1px solid #ffd700', borderRadius: '8px', padding: '8px 12px', fontSize: '1.3rem', cursor: 'pointer' },
  fullscreenControlBtn: { background: '#111', border: '1px solid #ffd700', color: '#ffd700', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', width: '100%', marginTop: '4px' },
  endOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  endCard: { textAlign: 'center', padding: '40px' },
  endIcon: { fontSize: '4rem', marginBottom: '15px' },
  endTitle: { color: '#ffd700', fontSize: '2rem', marginBottom: '10px' },
  endText: { color: '#888', maxWidth: '350px', margin: '0 auto 20px', lineHeight: '1.6' },
  replayBtn: { background: '#ffd700', color: '#000', padding: '10px 25px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  controls: { display: 'flex', gap: '20px', justifyContent: 'center', margin: '30px 0', alignItems: 'center' },
  playBtn: { background: '#ffd700', border: 'none', color: '#000', padding: '12px 45px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '1rem', textTransform: 'uppercase' },
  skipBtn: { background: '#111', border: '1px solid #222', color: '#fff', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' },
  infoBox: { background: '#0a0a0a', padding: '30px', borderRadius: '20px', border: '1px solid #111' },
  videoTitle: { fontSize: '1.8rem', color: '#fff', margin: '0 0 10px' },
  divider: { height: '3px', width: '40px', background: '#ffd700', marginBottom: '20px' },
  videoDesc: { color: '#888', lineHeight: '1.8' },
  sidebar: { background: '#0a0a0a', borderRadius: '20px', padding: '24px', border: '1px solid #111', overflowY: 'auto' },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' },
  sidebarTitle: { color: '#ffd700', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold' },
  videoCount: { color: '#444', fontSize: '0.7rem' },
  videoList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  videoItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '16px', borderRadius: '12px', cursor: 'pointer', background: '#111', border: '1px solid transparent', transition: '0.2s' },
  videoItemActive: { background: 'rgba(255,215,0,0.1)', borderColor: '#ffd700', color: '#ffd700' },
  videoItemStatus: { color: '#ffd700' },
  videoItemTitle: { fontSize: '0.95rem', fontWeight: '500' },
  lockIcon: { marginLeft: 'auto', color: '#ffd700', fontSize: '0.9rem' },
  lockedNotice: { marginTop: '20px', padding: '15px', background: 'rgba(255,215,0,0.05)', borderRadius: '10px', color: '#ffd700', fontSize: '0.85rem', textAlign: 'center', border: '1px solid rgba(255,215,0,0.1)' },
  loadingWrapper: { height: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  loaderSpinner: { width: '50px', height: '50px', border: '4px solid #111', borderTop: '4px solid #ffd700', borderRadius: '50%', animation: 'spin 1s linear infinite' }
};

export default VideoVault;