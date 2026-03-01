import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Search = ({ currentUserId }) => {
    const [skills, setSkills] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadData = React.useCallback(async () => {
        try {
            const [skillsRes, usersRes] = await Promise.all([
                api.get('/skills'),
                api.get('/users')
            ]);
            setSkills(skillsRes.data);
            setUsers(usersRes.data.filter(u => u.id !== currentUserId));
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Filter skills based on search term
    const filteredSkills = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get users who can teach a specific skill (simplified - shows all users)
    const getUsersForSkill = (skillId) => {
        // In a real app, you'd filter users based on skills they've taught/have
        // For now, show all users as potential helpers
        return users;
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <div className="card">
                <h2>🔍 Search Skills & Users</h2>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                    Find skills you want to learn and people who can help.
                </p>

                {/* Search Bar */}
                <input 
                    type="text" 
                    placeholder="Search by skill name or category..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '1rem',
                        marginBottom: '20px',
                        boxSizing: 'border-box'
                    }}
                />
            </div>

            {/* Skills List */}
            {filteredSkills.length === 0 ? (
                <div className="card">
                    <p style={{ color: '#9ca3af', textAlign: 'center' }}>
                        No skills found matching "{searchTerm}"
                    </p>
                </div>
            ) : (
                filteredSkills.map(skill => (
                    <div 
                        key={skill.id} 
                        className="card" 
                        style={{ 
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            border: selectedSkill?.id === skill.id ? '2px solid #4f46e5' : '1px solid #e5e7eb'
                        }}
                        onClick={() => setSelectedSkill(selectedSkill?.id === skill.id ? null : skill)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{skill.name}</h3>
                                <span style={{
                                    display: 'inline-block',
                                    marginTop: '8px',
                                    padding: '4px 12px',
                                    background: '#e0e7ff',
                                    color: '#4f46e5',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: '500'
                                }}>
                                    {skill.category}
                                </span>
                            </div>
                            <div style={{ fontSize: '1.5rem' }}>
                                {selectedSkill?.id === skill.id ? '▼' : '▶'}
                            </div>
                        </div>

                        {/* Show Users for Selected Skill */}
                        {selectedSkill?.id === skill.id && (
                            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                                <h4 style={{ margin: '0 0 15px 0', color: '#6b7280' }}>
                                    👥 People who might help:
                                </h4>
                                {getUsersForSkill(skill.id).length === 0 ? (
                                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                                        No users available
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {getUsersForSkill(skill.id).map(user => (
                                            <div 
                                                key={user.id} 
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '12px',
                                                    background: '#f9fafb',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{user.name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                                        {user.email} • Trust: {user.trustScore}
                                                    </div>
                                                </div>
                                                <button 
                                                    style={{
                                                        padding: '8px 16px',
                                                        fontSize: '0.9rem',
                                                        background: '#4f46e5'
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.location.href = '/request-help';
                                                    }}
                                                >
                                                    Request
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* All Users Section */}
            <div className="card" style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '15px' }}>👥 All Users</h3>
                {users.length === 0 ? (
                    <p style={{ color: '#9ca3af' }}>No other users found</p>
                ) : (
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {users.map(user => (
                            <div 
                                key={user.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px',
                                    background: '#f9fafb',
                                    borderRadius: '8px'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: '600' }}>{user.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                        {user.email}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '6px 12px',
                                    background: '#e0e7ff',
                                    color: '#4f46e5',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600'
                                }}>
                                    Trust: {user.trustScore}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
