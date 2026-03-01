import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const RequestHelp = ({ currentUserId }) => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [skills, setSkills] = useState([]);

    const [giverId, setGiverId] = useState('');
    const [skillId, setSkillId] = useState('');
    const [credits, setCredits] = useState('');
    const [loading, setLoading] = useState(false);

    // Load users and skills on startup
    useEffect(() => {
        // Fetch users (excluding myself)
        api.get('/users').then(res => {
            setUsers(res.data.filter(u => u.id !== currentUserId));
        });

        // Fetch skills
        api.get('/skills').then(res => setSkills(res.data));
    }, [currentUserId]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // When requesting help: I am the RECEIVER, they are the GIVER
        const iouData = {
            giverId: giverId, // The person I'm asking for help
            receiverId: currentUserId, // Me (I'll owe them)
            skillId: skillId,
            credits: parseFloat(credits)
        };

        try {
            await api.post('/ious', iouData);
            alert('Success! Help request sent.');
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Error creating request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>🙏 Request Help</h2>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                    Need help learning a skill? Request it here.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Select User to Ask */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                            Who do you want help from?
                        </label>
                        <select 
                            style={inputStyle} 
                            value={giverId} 
                            onChange={e => setGiverId(e.target.value)}
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

                    {/* Select Skill Needed */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                            What skill do you need?
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
                            Credits You'll Owe
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
                        {loading ? 'Sending...' : 'Send Request'}
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

export default RequestHelp;
