import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * 🏛️ MARO ACADEMY VIDEO VAULT
 */

const VideoVault = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const playerReadyRef = useRef(false);

  const API_URL = "https://maro-academy-v2.onrender.com";

  /* ===============================
     SECURITY LOCK
  =============================== */
  useEffect(() => {
    const preventMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", preventMenu);
    return () => document.removeEventListener("contextmenu", preventMenu);
  }, []);

  /* ===============================
     FETCH VIDEOS
  =============================== */
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
      console.error("🚨 VIDEO LOAD ERROR:", error);
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    initializeVault();
  }, [initializeVault]);

  /* ===============================
     YOUTUBE MESSAGE LISTENER
     Handles: currentTime polling, state changes (ended = 0)
  =============================== */
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Track current time for progress saving
        if (data?.info?.currentTime !== undefined && activeVideo) {
          const t = data.info.currentTime;
          setCurrentTime(t);
          localStorage.setItem(`progress_${activeVideo._id}`, t);
        }

        // Detect player state: 0 = ended
        if (data?.info?.playerState === 0) {
          setVideoEnded(true);
        }

        // Detect player ready
        if (data?.event === 'onReady' || data?.info?.playerState !== undefined) {
          playerReadyRef.current = true;
        }

      } catch (err) {}
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activeVideo]);

  /* ===============================
     SKIP FUNCTION — RELIABLE
     Reads currentTime from state (kept live by interval),
     then seeks directly.
  =============================== */
  const handleSkip = (deltaSeconds) => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const newTime = Math.max(currentTime + deltaSeconds, 0);

    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: 'seekTo', args: [newTime, true] }),
      '*'
    );
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
      '*'
    );
  };

  /* ===============================
     POLL CURRENT TIME EVERY 1s
  =============================== */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!iframeRef.current) return;
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'getCurrentTime', args: [] }),
        '*'
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ===============================
     RESUME PROGRESS ON VIDEO CHANGE
  =============================== */
  const resumeVideo = useCallback(() => {
    if (!activeVideo) return;
    const savedTime = localStorage.getItem(`progress_${activeVideo._id}`);
    if (savedTime && iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [parseFloat(savedTime), true] }),
        '*'
      );
    }
  }, [activeVideo]);

  useEffect(() => {
    // Reset ended state when switching videos
    setVideoEnded(false);
    setCurrentTime(0);
    const timer = setTimeout(() => resumeVideo(), 2500);
    return () => clearTimeout(timer);
  }, [activeVideo, resumeVideo]);

  /* ===============================
     SELECT VIDEO — blocked if ended
  =============================== */
  const handleSelectVideo = (video) => {
    if (videoEnded) return; // Locked out — do nothing
    setActiveVideo(video);
  };

  /* ===============================
     LOADING
  =============================== */
  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <h2 style={{ color: '#ffd700' }}>🔐 Loading Vault...</h2>
      </div>
    );
  }

  /* ===============================
     BUILD YOUTUBE EMBED URL
     - youtube-nocookie.com → no tracking, suppresses related videos
     - rel=0 → no related videos at end
     - modestbranding=1 → minimal branding
     - disablekb=0 → allow keyboard
     - iv_load_policy=3 → no annotations
     - fs=0 → no fullscreen button (optional, remove if you want it)
     - enablejsapi=1 → required for postMessage API
     - origin → required for postMessage security
  =============================== */
  const buildEmbedUrl = (videoId) => {
    const params = new URLSearchParams({
      enablejsapi: '1',
      rel: '0',
      modestbranding: '1',
      iv_load_policy: '3',
      disablekb: '0',
      autoplay: '1',
      controls: '1',
      origin: window.location.origin,
    });
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.logo}>🏛️ MARO ACADEMY</h1>
        <button style={styles.logoutBtn} onClick={() => navigate('/login')}>
          Logout
        </button>
      </div>

      <div style={styles.layout}>

        {/* LEFT — VIDEO PLAYER */}
        <div style={styles.playerSection}>
          {activeVideo && (
            <>
              {/* Player wrapper with end screen blocker */}
              <div style={styles.playerWrapper}>
                <iframe
                  ref={iframeRef}
                  title="Video Player"
                  src={buildEmbedUrl(activeVideo.videoId)}
                  style={styles.iframe}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />

                {/* END SCREEN OVERLAY — blocks clicking YouTube end cards */}
                {videoEnded && (
                  <div style={styles.endOverlay}>
                    <div style={styles.endCard}>
                      <div style={styles.endIcon}>🎓</div>
                      <h2 style={styles.endTitle}>Lesson Complete!</h2>
                      <p style={styles.endText}>
                        Great work. Contact your instructor to unlock the next lesson.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* SKIP CONTROLS */}
              <div style={styles.controls}>
                <button
                  style={styles.skipBtn}
                  onClick={() => handleSkip(-10)}
                  disabled={videoEnded}
                >
                  ⏪ Back 10s
                </button>
                <button
                  style={styles.skipBtn}
                  onClick={() => handleSkip(10)}
                  disabled={videoEnded}
                >
                  Forward 10s ⏩
                </button>
              </div>

              {/* VIDEO INFO */}
              <h2 style={styles.videoTitle}>{activeVideo.title}</h2>
              <p style={styles.videoDesc}>{activeVideo.description}</p>
            </>
          )}
        </div>

        {/* RIGHT — VIDEO LIST */}
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Course Videos</h3>
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
                title={videoEnded ? 'Lesson ended — cannot navigate' : video.title}
              >
                <span style={styles.videoItemDot}>
                  {isActive ? '▶' : '○'}
                </span>
                <span>{video.title}</span>
                {videoEnded && <span style={styles.lockIcon}>🔒</span>}
              </div>
            );
          })}

          {videoEnded && (
            <div style={styles.lockedNotice}>
              🔒 Navigation locked after lesson ends.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===============================
   STYLES
=============================== */
const styles = {
  loadingWrapper: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#0a0a0a',
  },
  container: {
    background: '#0a0a0a',
    minHeight: '100vh',
    color: '#fff',
    padding: '24px',
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    borderBottom: '1px solid #222',
    paddingBottom: '16px',
  },
  logo: {
    color: '#ffd700',
    margin: 0,
    fontSize: '1.6rem',
    letterSpacing: '2px',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #444',
    color: '#aaa',
    padding: '8px 18px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  layout: {
    display: 'flex',
    gap: '28px',
    alignItems: 'flex-start',
  },
  playerSection: {
    flex: 1,
    minWidth: 0,
  },
  playerWrapper: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
    borderRadius: '10px',
    marginBottom: '16px',
    background: '#000',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '10px',
  },
  endOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.92)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: '10px',
  },
  endCard: {
    textAlign: 'center',
    padding: '40px',
  },
  endIcon: {
    fontSize: '4rem',
    marginBottom: '16px',
  },
  endTitle: {
    color: '#ffd700',
    fontSize: '2rem',
    marginBottom: '12px',
  },
  endText: {
    color: '#aaa',
    fontSize: '1rem',
    maxWidth: '320px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  controls: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  skipBtn: {
    background: '#1a1a1a',
    border: '1px solid #333',
    color: '#ffd700',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'background 0.2s',
  },
  videoTitle: {
    color: '#fff',
    margin: '0 0 8px',
    fontSize: '1.3rem',
  },
  videoDesc: {
    color: '#888',
    fontSize: '0.9rem',
    lineHeight: '1.6',
  },
  sidebar: {
    width: '280px',
    flexShrink: 0,
    background: '#111',
    borderRadius: '10px',
    padding: '16px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  sidebarTitle: {
    color: '#ffd700',
    margin: '0 0 16px',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  videoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#ccc',
    marginBottom: '4px',
    transition: 'background 0.2s',
  },
  videoItemActive: {
    background: '#1e1e00',
    color: '#ffd700',
  },
  videoItemLocked: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  videoItemDot: {
    fontSize: '0.8rem',
    color: '#ffd700',
    flexShrink: 0,
  },
  lockIcon: {
    marginLeft: 'auto',
    fontSize: '0.8rem',
  },
  lockedNotice: {
    marginTop: '16px',
    padding: '12px',
    background: '#1a0a0a',
    border: '1px solid #400',
    borderRadius: '6px',
    color: '#e55',
    fontSize: '0.8rem',
    textAlign: 'center',
  },
};

export default VideoVault;
