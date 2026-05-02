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
  const API_URL = "https://onrender.com";

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
  // ⏰ MIGHTY EXPIRY WATCHER
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
        console.log("🔴 EXPIRED! Kicking you out! GBAMA! 💥");

        try {
          await axios.put(`${API_URL}/api/students/auto-expire/${userData._id}`);
          console.log("✅ Your status flipped to PENDING!");
        } catch (e) {
          console.error("Could not update individual status", e);
        }

        localStorage.removeItem('maroUser');
        navigate('/access-denied', { state: { expired: true } });
      }
    };

    checkExpiry();
    const expiryWatcher = setInterval(checkExpiry, 1000);
    return () => clearInterval(expiryWatcher);
  }, [navigate]);

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
  // 🎥 THE MIGHTY PLAYER ENGINE
  // ===============================
  useEffect(() => {
    const tryCreatePlayer = () => {
      const el = document.getElementById(playerDivId);
      if (!el) { setTimeout(tryCreatePlayer, 100); return; }
      if (!window.YT || !window.YT.Player) { setTimeout(tryCreatePlayer, 100); return; }
      if (playerRef.current) return;

      console.log("🏛️ CREATING PLAYER...");

      playerRef.current = new window.YT.Player(playerDivId, {
        videoId: '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          disablekb: 1,
          iv_load_policy: 3,
          fs: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            console.log("🏛️ MIGHTY ENGINE READY!");
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
    };

    if (!document.getElementById('yt-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api';
      tag.src = 'https://youtube.com';
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

    const savedTime = parseFloat(
      localStorage.getItem(`progress_${activeVideo._id}`) || '0'
    );

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
    if (activeVideo?._id === video._id) return;
    setVideoEnded(false);
    setActiveVideo(video);
  };

  // 🆕 THE FULLSCREEN FLIP HANDLER
  const handleFullscreen = async () => {
    const wrapper = document.getElementById('player-wrapper');
    if (!wrapper) return;

    try {
      // Step 1: Request Fullscreen for all engines
      if (wrapper.requestFullscreen) {
        await wrapper.requestFullscreen();
      } else if (wrapper.webkitRequestFullscreen) {
        await wrapper.webkitRequestFullscreen();
      } else if (wrapper.mozRequestFullScreen) {
        await wrapper.mozRequestFullScreen();
      } else if (wrapper.msRequestFullscreen) {
        await wrapper.msRequestFullscreen();
      }

      // Step 2: Lock to Horizontal (Landscape)
      if (window.screen.orientation && window.screen.orientation.lock) {
        await window.screen.orientation.lock('landscape').catch((err) => {
          console.log("Orientation lock ignored by browser:", err.message);
        });
      }
    } catch (error) {
      console.error("Mighty Fullscreen error:", error);
    }
  };

  // Reset orientation when exiting
  useEffect(() => {
    const handleExit = () => {
      if (!document.fullscreenElement && window.screen.orientation?.unlock) {
        window.screen.orientation.unlock();
      }
    };
    document.addEventListener('fullscreenchange', handleExit);
    document.addEventListener('webkitfullscreenchange', handleExit);
    return () => {
      document.removeEventListener('fullscreenchange', handleExit);
      document.removeEventListener('webkitfullscreenchange', handleExit);
    };
  }, []);

  if (loading) return <div>Vault Initializing...</div>;

  return (
    <div className="vault-main-container">
      <div id="player-wrapper" className="player-container">
        <div id={playerDivId}></div>
        
        {/* BUTTON INTERFACE */}
        <div className="custom-player-controls">
          <button onClick={togglePlayback}>{isPlaying ? 'Pause' : 'Play'}</button>
          <button onClick={() => handleSkip(-10)}>-10s</button>
          <button onClick={() => handleSkip(10)}>+10s</button>
          <button onClick={handleFullscreen} className="mighty-flip-button">⛶ FLIP TO LANDSCAPE</button>
        </div>
      </div>

      <div className="vault-sidebar">
        {videos.map((vid) => (
          <div 
            key={vid._id} 
            className={`video-item ${activeVideo?._id === vid._id ? 'active' : ''}`}
            onClick={() => handleSelectVideo(vid)}
          >
            {vid.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoVault;
