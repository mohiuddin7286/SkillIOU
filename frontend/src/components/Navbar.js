import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    return (
        <nav className="navbar">
            <div style={{ maxWidth: '800px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '800', 
                        background: 'linear-gradient(135deg, #4f46e5 0%, #c850c0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginRight: '15px',
                        letterSpacing: '-1px'
                    }}>
                        🤝 Skill IOU
                    </div>
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/create-iou" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        Give Help
                    </NavLink>
                    <NavLink to="/search" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        Explore
                    </NavLink>
                </div>
                <button 
                    onClick={onLogout} 
                    style={{ 
                        width: 'auto', 
                        padding: '10px 20px', 
                        fontSize: '0.9rem', 
                        background: '#ef4444',
                        boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;