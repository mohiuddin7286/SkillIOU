import React, { useState } from 'react';
import api from '../services/api';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Get all users
            const res = await api.get('/users');
            // 2. Find the one with this email
            const user = res.data.find(u => u.email === email);

            if (user) {
                onLogin(user); // Success! Send user data up to App.js
            } else {
                setError('User not found. Try "odin@test.com"');
            }
        } catch (err) {
            setError('Server error. Is Backend running?');
        }
    };

    return (
        <div style={styles.container}>
            {/* Animated background circles */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '40%',
                height: '40%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-10%',
                width: '50%',
                height: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 8s ease-in-out infinite reverse'
            }}></div>
            
            <div className="card" style={styles.card}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <div style={{ 
                        fontSize: '3rem', 
                        marginBottom: '10px',
                        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                    }}>🤝</div>
                    <h1 style={{ 
                        textAlign: 'center', 
                        marginBottom: '10px',
                        fontSize: '2rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '800',
                        letterSpacing: '-1px'
                    }}>Skill IOU</h1>
                </div>
                <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '35px', fontSize: '1.05rem' }}>
                    Trade skills, build trust, grow together.
                </p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email..." 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', background: '#fee2e2', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>{error}</p>}

                    <button type="submit" style={{ marginBottom: '20px' }}>Login →</button>
                </form>

                <div style={{ 
                    marginTop: '25px', 
                    fontSize: '0.9rem', 
                    color: '#6b7280', 
                    textAlign: 'center',
                    padding: '15px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
                    borderRadius: '12px',
                    border: '1px solid rgba(99, 102, 241, 0.1)'
                }}>
                    <div style={{ marginBottom: '8px', fontWeight: '600', color: '#4b5563' }}>Try Demo Accounts:</div>
                    <div><strong style={{ color: '#6366f1' }}>odin@test.com</strong> or <strong style={{ color: '#6366f1' }}>shrey@test.com</strong></div>
                </div>
            </div>
            
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(20px, 20px) scale(1.05); }
                }
            `}</style>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        padding: '50px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        zIndex: 1,
        animation: 'slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '2px solid #e5e7eb',
        fontSize: '1rem',
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
};

export default Login;