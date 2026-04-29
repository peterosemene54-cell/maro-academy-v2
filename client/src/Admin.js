import React, { useEffect, useState } from 'react';
import axios from 'axios';

// YOUR LIVE RENDER LINK
const API_URL = "https://maro-academy-v2.onrender.com";

const Admin = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🎥 NEW STATE FOR VIDEO UPLOAD
    const [videoData, setVideoData] = useState({ title: '', videoId: '', description: '' });
    const [uploading, setUploading] = useState(false);

    // 📥 1. FETCH ALL STUDENTS
    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/students`);
            setStudents(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching students", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // ✅ 2. APPROVE/DISAPPROVE LOGIC
    const toggleApproval = async (id) => {
        try {
            await axios.put(`${API_URL}/api/students/${id}/approve`);
            fetchStudents(); 
        } catch (error) {
            alert("Error updating status");
        }
    };

    // 🎬 3. NEW: PUBLISH VIDEO LOGIC
    const handleVideoUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            await axios.post(`${API_URL}/api/videos/upload`, videoData);
            alert("Tutorial Published Successfully! 🚀🎬");
            setVideoData({ title: '', videoId: '', description: '' }); // Clear form
        } catch (error) {
            alert("Error publishing video. Check your server connection.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <h2 style={{textAlign: 'center'}}>Opening the Vault... 🦾</h2>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ color: '#333' }}>Oga's Admin Dashboard 💰</h1>
            
            {/* --- STUDENT SECTION --- */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h3>Registered Students ({students.length})</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#333', color: 'white' }}>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => (
                                <tr key={s._id} style={{ background: s.isPaid ? '#eaffea' : '#fff' }}>
                                    <td>{s.name}</td>
                                    <td>{s.email}</td>
                                    <td style={{ fontWeight: 'bold', color: s.isPaid ? 'green' : 'red' }}>
                                        {s.isPaid ? "APPROVED ✅" : "PENDING ⏳"}
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => toggleApproval(s._id)}
                                            style={{ 
                                                padding: '8px 12px', 
                                                cursor: 'pointer',
                                                background: s.isPaid ? '#ff4d4d' : '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px'
                                            }}>
                                            {s.isPaid ? "Disapprove" : "Approve Student"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- 📤 NEW: THE PUBLISH MENU --- */}
            <div style={{ marginTop: '50px', padding: '30px', border: '2px solid #333', borderRadius: '15px', background: '#f9f9f9' }}>
                <h2 style={{ color: '#333', margin: '0 0 10px 0' }}>📤 Publish Math Tutorial</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>This sends the video straight to the Student Video Vault.</p>

                <form onSubmit={handleVideoUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px' }}>
                    <input 
                        type="text" 
                        placeholder="Video Title (e.g. Simultaneous Equations Part 1)" 
                        value={videoData.title}
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                        onChange={(e) => setVideoData({...videoData, title: e.target.value})}
                        required 
                    />
                    <input 
                        type="text" 
                        placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" 
                        value={videoData.videoId}
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                        onChange={(e) => setVideoData({...videoData, videoId: e.target.value})}
                        required 
                    />
                    <textarea 
                        placeholder="Describe what they will learn in this math lesson..." 
                        value={videoData.description}
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '100px' }}
                        onChange={(e) => setVideoData({...videoData, description: e.target.value})}
                    />
                    <button 
                        type="submit" 
                        disabled={uploading}
                        style={{ 
                            background: uploading ? '#888' : '#333', 
                            color: '#fff', 
                            padding: '15px', 
                            border: 'none', 
                            borderRadius: '6px', 
                            fontWeight: 'bold', 
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}>
                        {uploading ? "Publishing... 🦾" : "PUBLISH TO VIDEO VAULT 🚀"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Admin;
