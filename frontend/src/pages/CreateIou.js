import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateIou = ({ currentUserId }) => { // <--- 1. Receiving prop
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [skills, setSkills] = useState([]);

    const [receiverId, setReceiverId] = useState('');
    const [skillId, setSkillId] = useState('');
    const [credits, setCredits] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. Load Data on Startup
    useEffect(() => {
        // Fetch users
        api.get('/users').then(res => {
            // Filter out MYSELF (using currentUserId)
            setUsers(res.data.filter(u => u.id !== currentUserId));
        });

        // Fetch skills
        api.get('/skills').then(res => setSkills(res.data));
    }, [currentUserId]);

    // 3. Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const iouData = {
            giverId: currentUserId, // <--- Using the logged-in user ID
            receiverId: receiverId,
            skillId: skillId,
            credits: parseFloat(credits)
        };

        try {
            await api.post('/ious', iouData);
            alert('Success! IOU Created.');
            navigate('/'); 
        } catch (error) {
            console.error(error);
            alert('Error creating IOU');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>🤝 Record New Help</h2>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                    You helped someone? Record it here.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Select User */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                            Who did you help?
                        </label>
                        <select 
                            style={inputStyle} 
                            value={receiverId} 
                            onChange={e => setReceiverId(e.target.value)}
                            required
                        >
                            <option value="">Select a User...</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.name} ({u.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Select Skill */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                            What did you teach?
                        </label>
                        <select 
                            style={inputStyle} 
                            value={skillId} 
                            onChange={e => setSkillId(e.target.value)}
                            required
                        >
                            <option value="">Select a Skill...</option>
                            {skills.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.category})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Input Credits */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                            Credits Value
                        </label>
                        <input 
                            type="number" 
                            style={inputStyle} 
                            placeholder="e.g. 2.5" 
                            step="0.5"
                            value={credits}
                            onChange={e => setCredits(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Create IOU'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
};

export default CreateIou;