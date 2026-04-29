import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://maro-academy-v2.onrender.com";

const VideoVault = ({ user }) => {
    const [videos, setVideos] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    // 📥 1. FETCH VIDEOS FROM DATABASE
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/videos`);
                setVideos(res.data);
                if (res.data.length > 0) {
                    setActiveVideo(res.data[0]); // Start with the first video
                }
                setLoading(false);
            } catch (err) {
                console.error("Vault Error:", err);
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    // 🔒 2. SECURITY BOUNCER
    if (!user) return <div style={{textAlign:'center', padding:'50px'}}><h2>Please Login to Enter the Vault 🔐</h2></div>;

    if (loading) return <div style={{textAlign:'center', padding:'50px'}}><h2>Opening the Gold Vault... 🦾</h2></div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#111', minHeight: '100vh', color: '#fff' }}>
            
            {/* 👑 HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h2 style={{ margin: 0, color: '#ffd700' }}>🎬 MARO ACADEMY VAULT</h2>
                <div style={{textAlign: 'right'}}>
                    <span style={{fontSize: '0.9rem'}}>Welcome, <b>{user.name.toUpperCase()}</b></span> <br/>
                    <span style={{color: '#28a745', fontSize: '0.8rem'}}>● PREMIUM ACCESS ACTIVE</span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', flexWrap: 'wrap' }}>
                
                {/* 📽️ LEFT: THE STAGE (Video Player) */}
                <div style={{ flex: '2.5', minWidth: '350px' }}>
                    {activeVideo ? (
                        <>
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '15px', background: '#000', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                <iframe 
                                    src={`https://youtube.com{activeVideo.videoId}?modestbranding=1&rel=0&showinfo=0`}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen>
                                </iframe>
                            </div>
                            <div style={{ marginTop: '25px', background: '#222', padding: '25px', borderRadius: '12px', borderLeft: '5px solid #ffd700' }}>
                                <h1 style={{ margin: '0 0 10px 0', fontSize: '1.8rem' }}>{activeVideo.title}</h1>
                                <p style={{ color: '#aaa', lineHeight: '1.6' }}>{activeVideo.description || "No description provided."}</p>
                            </div>
                        </>
                    ) : (
                        <div style={{ padding: '50px', textAlign: 'center', background: '#222', borderRadius: '15px' }}>
                            <h3>Vault is Empty. 🏜️</h3>
                            <p>Oga is preparing your math tutorials. Stay tuned!</p>
                        </div>
                    )}
                </div>

                {/* 📜 RIGHT: THE CURRICULUM (Playlist) */}
                <div style={{ flex: '1', minWidth: '320px', background: '#222', padding: '20px', borderRadius: '15px', height: 'fit-content' }}>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px' }}>Your Lessons</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {videos.map((v, index) => (
                            <div 
                                key={v._id}
                                onClick={() => setActiveVideo(v)}
                                style={{ 
                                    padding: '15px', 
                                    borderRadius: '10px', 
                                    cursor: 'pointer', 
                                    background: activeVideo?._id === v._id ? '#333' : '#2a2a2a',
                                    border: activeVideo?._id === v._id ? '1px solid #ffd700' : '1px solid #333',
                                    transition: '0.3s'
                                }}>
                                <span style={{ color: '#ffd700', fontWeight: 'bold', marginRight: '10px' }}>{index + 1}.</span>
                                <span style={{ fontWeight: 'bold' }}>{v.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VideoVault;
