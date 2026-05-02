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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const navigate = useNavigate();
  const playerRef = useRef(null);
  const playerDivId = 'mighty-vault-player';
  const API_URL = "https://maro-academy-v2.onrender.com";

  // ===============================
  // 🌐 BROWSER DETECTION
  // ===============================
  useEffect(() => {
    const ua = navigator.userAgent;
    const isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor);
    const isOpera = /OPR/.test(ua) || /Opera/.test(ua);
    const isUC = /UCBrowser/.test(ua);
    const isSamsung = /SamsungBrowser/.test(ua);

    if (!isChrome || isOpera || isUC || isSamsung) {
      navigate('/browser-warning');
      return;
    }
  }, [navigate]);

  // ===============================
  // ⏰ EXPIRY SYSTEM (UNCHANGED LOGIC)
  // ===============================
  useEffect(() => {
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
        } catch (e) {}

        localStorage.removeItem('maroUser');
        navigate('/access-denied', { state: { expired: true } });
      }
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  // ===============================
  // 📱 RESIZE LISTENER
  // ===============================
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ===============================
  // 📦 LOAD VIDEOS
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

      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      console.error("VAULT ERROR:", error);
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    initializeVault();
  }, [initializeVault]);

  // ===============================
  // 🎥 YOUTUBE PLAYER ENGINE
  // ===============================
  useEffect(() => {
    const initPlayer = () => {
      const el = document.getElementById(playerDivId);

      if (!el || !window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 200);
        return;
      }

      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(playerDivId, {
        videoId: '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          playsinline: 1,
          disablekb: 1,
          iv_load_policy: 3,
        },
        events: {
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

    if (!document.getElementById('yt-api')) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = "yt-api";
      document.body.appendChild(tag);
    }

    setTimeout(initPlayer, 400);

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy?.();
        playerRef.current = null;
      }
    };
  }, []);

  // ===============================
  // 🎬 LOAD ACTIVE VIDEO
  // ===============================
  useEffect(() => {
    if (!activeVideo) return;

    const loadVideo = () => {
      if (!playerRef.current?.cueVideoById) {
        setTimeout(loadVideo, 200);
        return;
      }

      const savedTime = parseFloat(
        localStorage.getItem(`progress_${activeVideo._id}`) || '0'
      );

      playerRef.current.cueVideoById({
        videoId: activeVideo.videoId,
        startSeconds: Math.floor(savedTime),
      });
    };

    setVideoEnded(false);
    setIsPlaying(false);
    setTimeout(loadVideo, 300);
  }, [activeVideo]);

  // ===============================
  // 💾 SAVE PROGRESS
  // ===============================
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && activeVideo) {
        try {
          const time = playerRef.current.getCurrentTime();
          if (time > 0) {
            localStorage.setItem(`progress_${activeVideo._id}`, time);
          }
        } catch {}
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeVideo]);

  // ===============================
  // ▶ PLAY / PAUSE
  // ===============================
  const togglePlayback = () => {
    if (!playerRef.current) return;

    const state = playerRef.current.getPlayerState();

    if (state === window.YT.PlayerState.PLAYING) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
      handleFullscreen();
    }
  };

  // ===============================
  // ⏭ SKIP
  // ===============================
  const handleSkip = (sec) => {
    if (!playerRef.current) return;

    const current = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(current + sec, true);
  };

  // ===============================
  // 📺 FULLSCREEN (FIXED PROPERLY)
  // ===============================
  const handleFullscreen = () => {
    const wrapper = document.getElementById('player-wrapper');
    if (!wrapper) return;

    const request =
      wrapper.requestFullscreen ||
      wrapper.webkitRequestFullscreen ||
      wrapper.msRequestFullscreen;

    request?.call(wrapper);

    setIsFullscreen(true);

    document.onfullscreenchange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    try {
      window.screen.orientation?.lock?.('landscape').catch(() => {});
    } catch {}
  };

  // ===============================
  // LOADING UI
  // ===============================
  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <h2 style={{ color: '#ffd700' }}>UNLOCKING VAULT...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1>MARO ACADEMY PRO</h1>
        <button onClick={() => navigate('/login')}>Logout</button>
      </div>

      <div style={{ ...styles.layout, flexDirection: isMobile ? 'column' : 'row' }}>

        {/* PLAYER SECTION */}
        <div style={styles.playerSection}>

          <div
            id="player-wrapper"
            style={{
              ...styles.playerWrapper,
              ...(isFullscreen ? styles.fullscreen : {})
            }}
          >
            <div id={playerDivId} style={styles.player} />
          </div>

          {/* CONTROLS */}
          <div style={styles.controls}>
            <button onClick={() => handleSkip(-10)}>⏪</button>
            <button onClick={togglePlayback}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={() => handleSkip(10)}>⏩</button>

            {isMobile && (
              <button onClick={handleFullscreen}>Fullscreen</button>
            )}
          </div>

        </div>

        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          {videos.map(v => (
            <div key={v._id} onClick={() => setActiveVideo(v)}>
              {v.title}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// ===============================
// 🎨 STYLES (UNCHANGED STRUCTURE FIXED)
// ===============================
const styles = {
  container: { background: '#000', color: '#fff', minHeight: '100vh' },

  header: {
    padding: 20,
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #222'
  },

  layout: {
    display: 'flex',
    gap: 20,
    padding: 20
  },

  playerSection: { flex: 1 },

  playerWrapper: {
    width: '100%',
    aspectRatio: '16 / 9',
    position: 'relative',
    background: '#000',
    borderRadius: 20,
    overflow: 'hidden'
  },

  fullscreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 99999,
    borderRadius: 0
  },

  player: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  },

  controls: {
    display: 'flex',
    gap: 10,
    marginTop: 15
  },

  sidebar: {
    width: 280,
    background: '#111',
    padding: 15,
    borderRadius: 10
  },

  loading: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  spinner: {
    width: 40,
    height: 40,
    border: '3px solid #333',
    borderTop: '3px solid #ffd700',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

export default VideoVault;