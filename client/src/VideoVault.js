import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * 🏛️ MARO ACADEMY VIDEO VAULT [STABLE PRODUCTION VERSION]
 */

const VideoVault = ({ user }) => {

  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);


  const navigate = useNavigate();
  const iframeRef = useRef(null);

  const API_URL = "https://maro-academy-v2.onrender.com";

  /* ===============================
     SECURITY LOCK (Safe Version)
  =============================== */

  useEffect(() => {

    const preventMenu = (e) => e.preventDefault();

    document.addEventListener("contextmenu", preventMenu);

    return () => {
      document.removeEventListener("contextmenu", preventMenu);
    };

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

      const response =
        await axios.get(`${API_URL}/api/videos`);

      setVideos(response.data);

      if (response.data.length > 0) {
        setActiveVideo(response.data[0]);
      }

      setTimeout(() => {
        setLoading(false);
      }, 1200);

    } catch (error) {

      console.error(
        "🚨 VIDEO LOAD ERROR:",
        error
      );

      setLoading(false);
    }

  }, [user, navigate]);

  useEffect(() => {
    initializeVault();
  }, [initializeVault]);

  /* ===============================
     PLAYER MESSAGE LISTENER
  =============================== */

  useEffect(() => {

    const handleMessage = (event) => {

      try {

        const data =
          JSON.parse(event.data);

        if (
          data?.info?.currentTime !== undefined &&
          activeVideo
        ) {

          localStorage.setItem(
            `progress_${activeVideo._id}`,
            data.info.currentTime
          );

        }

      } catch (err) {}

    };

    window.addEventListener(
      "message",
      handleMessage
    );

    return () => {

      window.removeEventListener(
        "message",
        handleMessage
      );

    };

  }, [activeVideo]);

  /* ===============================
     SKIP FUNCTION (REAL WORKING)
  =============================== */

  const handleIndustrialSkip = (deltaSeconds) => {

    const iframe = iframeRef.current;

    if (!iframe) return;

    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'getCurrentTime',
        args: []
      }),
      '*'
    );

    const handler = (event) => {

      try {

        const data =
          JSON.parse(event.data);

        if (
          data?.info?.currentTime !== undefined
        ) {

          const currentTime =
            data.info.currentTime;

          const newTime =
            Math.max(
              currentTime + deltaSeconds,
              0
            );

          iframe.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'seekTo',
              args: [newTime, true]
            }),
            '*'
          );

          iframe.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'playVideo',
              args: []
            }),
            '*'
          );

          window.removeEventListener(
            "message",
            handler
          );

        }

      } catch (err) {}

    };

    window.addEventListener(
      "message",
      handler
    );

  };

  /* ===============================
     RESUME PROGRESS
  =============================== */

  const resumeVideo = () => {

    if (!activeVideo) return;

    const savedTime =
      localStorage.getItem(
        `progress_${activeVideo._id}`
      );

    if (savedTime && iframeRef.current) {

      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [parseFloat(savedTime), true]
        }),
        '*'
      );

    }

  };
const resumeVideo = useCallback(() => {

  if (!activeVideo) return;

  const savedTime =
    localStorage.getItem(
      `progress_${activeVideo._id}`
    );

  if (savedTime && iframeRef.current) {

    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "seekTo",
        args: [parseFloat(savedTime), true]
      }),
      "*"
    );

  }

}, [activeVideo]);
 useEffect(() => {

  const timer = setTimeout(() => {

    resumeVideo();

  }, 2000);

  return () => clearTimeout(timer);

}, [resumeVideo]);


  /* ===============================
     SAVE PROGRESS INTERVAL
  =============================== */

  useEffect(() => {

    const interval = setInterval(() => {

      if (!iframeRef.current) return;

      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'getCurrentTime',
          args: []
        }),
        '*'
      );

    }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  /* ===============================
     LOADING
  =============================== */

  if (loading) {

    return (

      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#000',
          color: '#ffd700'
        }}
      >

        <h2>
          🔐 Loading Vault...
        </h2>

      </div>

    );

  }

  /* ===============================
     UI
  =============================== */

  return (

    <div
      style={{
        background: '#000',
        minHeight: '100vh',
        color: '#fff',
        padding: '30px'
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '30px'
        }}
      >

        <h1
          style={{
            color: '#ffd700'
          }}
        >
          MARO ACADEMY
        </h1>

        <button
          onClick={() => navigate('/login')}
        >
          Logout
        </button>

      </div>

      {/* VIDEO */}

      {activeVideo && (

        <div>

          <div
            style={{
              position: 'relative',
              paddingBottom: '56.25%',
              marginBottom: '20px'
            }}
          >

            <iframe
              ref={iframeRef}
              title="Video Player"
              src={`https://www.youtube.com/embed/${activeVideo.videoId}?enablejsapi=1&modestbranding=1&rel=0&controls=1&autoplay=1`}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="autoplay"
            />

          </div>

          {/* SKIP CONTROLS */}

          <div
            style={{
              display: 'flex',
              gap: '20px'
            }}
          >

            <button
              onClick={() =>
                handleIndustrialSkip(-10)
              }
            >
              ⏪ Back 10s
            </button>

            <button
              onClick={() =>
                handleIndustrialSkip(10)
              }
            >
              Forward 10s ⏩
            </button>

          </div>

          {/* TITLE */}

          <h2>
            {activeVideo.title}
          </h2>

          <p>
            {activeVideo.description}
          </p>

        </div>

      )}

      {/* VIDEO LIST */}

      <div
        style={{
          marginTop: '40px'
        }}
      >

        {videos.map((video) => (

          <div
            key={video._id}
            onClick={() =>
              setActiveVideo(video)
            }
            style={{
              padding: '15px',
              borderBottom: '1px solid #222',
              cursor: 'pointer'
            }}
          >

            {video.title}

          </div>

        ))}

      </div>

    </div>

  );

};

export default VideoVault;