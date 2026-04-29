import React, { useEffect, useState } from 'react';
import axios from 'axios';

// YOUR LIVE RENDER LINK
const API_URL = "https://onrender.com";

const Admin = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // 📥 1. FETCH ALL STUDENTS FROM DATABASE
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

    // ✅ 2. FUNCTION TO APPROVE/DISAPPROVE
    const toggleApproval = async (id) => {
        try {
            await axios.put(`${API_URL}/api/students/${id}/approve`);
            fetchStudents(); // Refresh the list after clicking
        } catch (error) {
            alert("Error updating status");
        }
    };

    if (loading) return <h2 style={{textAlign: 'center'}}>Opening the Vault... 🦾</h2>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#333' }}>Oga's Admin Dashboard 💰</h1>
            <p>Total Students Registered: {students.length}</p>
            
            <div style={{ overflowX: 'auto' }}>
                <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#333', color: 'white' }}>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Payment Status</th>
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
            {students.length === 0 && <p style={{textAlign: 'center', marginTop: '20px'}}>No students registered yet. 🏜️</p>}
        </div>
    );
};

export default Admin;
