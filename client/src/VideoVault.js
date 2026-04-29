import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * 🏛️ MARO ACADEMY VIDEO VAULT
 * Skip works via YouTube IFrame API (window.YT.Player)
 */

const VideoVault = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);

  const navigate = useNavigate();
  const playerRef = useRef(null);      // holds the YT.Player instance
  const playerDivId = 'yt-player';     // div id the API attaches to

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
     LOAD YOUTUBE IFRAME API SCRIPT
     Only loads once. Sets window.onYouTubeIframeAPIReady
  =============================== */
  useEffect(() => {
    if (window.YT && window.YT.Player) return; // already loaded

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
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
     CREATE / RECREATE YT PLAYER
     Runs whenever activeVideo changes
  =============================== */
  useEffect(() => {
    if (!activeVideo) return;

    // Destroy old player if it exists
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch (e) {}
      playerRef.current = null;
    }

    setVideoEnded(false);

    const savedTime = parseFloat(
      localStorage.getItem(`progress_${activeVideo._id}`) || '0'
    );

    const createPlayer = () => {
      playerRef.current = new window.YT.Player(playerDivId, {
        videoId: activeVideo.videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          showinfo: 0,
          color: 'white',
          start: Math.floor(savedTime),
          origin: window.location.origin,
        },
        events: {
          onStateChange: (event) => {
            // 0 = ended
            if (event.data === 0) {
              setVideoEnded(true);
            }
          },
        },
      });
    };

    // If API already ready, create immediately. Otherwise wait.
    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      // cleanup on unmount
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [activeVideo]);

  /* ===============================
     SAVE PROGRESS EVERY 5s
  =============================== */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!playerRef.current || !activeVideo) return;
      try {
        const t = playerRef.current.getCurrentTime();
        if (t) {
          localStorage.setItem(`progress_${activeVideo._id}`, t);
        }
      } catch (e) {}
    }, 5000);
    return () => clearInterval(interval);
  }, [activeVideo]);

  /* ===============================
     SKIP — NOW ACTUALLY WORKS
     Uses YT.Player API directly, no postMessage needed
  =============================== */
  const handleSkip = (deltaSeconds) => {
    if (!playerRef.current) return;
    try {
      const current = playerRef.current.getCurrentTime();
      const newTime = Math.max(current + deltaSeconds, 0);
      playerRef.current.seekTo(newTime, true);
      playerRef.current.playVideo();
    } catch (e) {
      console.error("Skip error:", e);
    }
  };

  /* ===============================
     SELECT VIDEO — blocked if ended
  =============================== */
  const handleSelectVideo = (video) => {
    if (videoEnded) return;
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
              <div style={styles.playerWrapper}>

                {/* YT API attaches to this div — NOT an iframe we create */}
                <div id={playerDivId} style={styles.playerDiv} />

                {/* ── BRANDING BLOCKERS ── */}

                {/* Top-left: hides channel name + avatar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '60%', height: '70px',
                  background: 'linear-gradient(to bottom, #000 30%, transparent 100%)',
                  zIndex: 5, pointerEvents: 'none',
                }} />

                {/* Top-right: hides YouTube icons */}
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: '160px', height: '70px',
                  background: 'linear-gradient(to bottom, #000 30%, transparent 100%)',
                  zIndex: 5, pointerEvents: 'none',
                }} />

                {/* Bottom: hides "More videos" + YouTube logo */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0,
                  width: '100%', height: '46px',
                  background: '#000',
                  zIndex: 5, pointerEvents: 'none',
                }} />

                {/* END SCREEN OVERLAY */}
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
                  style={{
                    ...styles.skipBtn,
                    ...(videoEnded ? styles.skipBtnDisabled : {}),
                  }}
                  onClick={() => handleSkip(-10)}
                  disabled={videoEnded}
                >
                  ⏪ Back 10s
                </button>
                <button
                  style={{
                    ...styles.skipBtn,
                    ...(videoEnded ? styles.skipBtnDisabled : {}),
                  }}
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
  playerDiv: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '10px',
  },
  endOverlay: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.93)',
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
  skipBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
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