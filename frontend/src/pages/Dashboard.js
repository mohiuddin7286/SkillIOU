import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaArrowDown, FaHistory, FaHandHoldingHeart, FaHandHoldingUsd } from 'react-icons/fa';
import api from '../services/api';

const Dashboard = ({ currentUserId }) => {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0);
    const [history, setHistory] = useState([]);
    const [pending, setPending] = useState([]);

    useEffect(() => {
        if (currentUserId) loadData();
    }, [currentUserId]);

    const loadData = () => {
        api.get(`/users/${currentUserId}`).then(res => setUser(res.data));
        api.get(`/ledger/balance/${currentUserId}`).then(res => setBalance(res.data.balance));
        api.get(`/ledger/history/${currentUserId}`).then(res => setHistory(res.data));
        api.get(`/ious/owed/${currentUserId}`).then(res => {
            setPending(res.data.filter(iou => iou.status === 'PENDING'));
        });
    };

    const handleConfirm = async (iouId) => {
        try {
            await api.post(`/ious/${iouId}/confirm`);
            loadData();
        } catch (error) {
            alert("Error confirming IOU");
        }
    };

    const addTestCredits = async () => {
        const amount = prompt("How many test credits to add?", "50");
        if (!amount || isNaN(amount)) return;
        
        try {
            await api.post('/ledger/add', {
                userId: currentUserId,
                creditChange: parseFloat(amount),
                reason: `Test credits added (${new Date().toLocaleString()})`
            });
            loadData();
            alert(`Successfully added ${amount} test credits!`);
        } catch (error) {
            alert("Error adding test credits");
        }
    };

    if (!user) return <div className="container" style={{textAlign:'center', marginTop: '100px'}}>Loading...</div>;

    return (
        <div className="container">
            {/* 1. Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Hello, {user.name.split(' ')[0]}</h1>
                    <p style={{ margin: '5px 0 0', opacity: 0.7 }}>Welcome back to your community</p>
                </div>
                
                {/* Trust Score Badge */}
                <div style={{ 
                    background: 'rgba(255,255,255,0.1)', 
                    padding: '10px 20px', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Trust Score</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#4ade80' }}>{user.trustScore}</div>
                </div>
            </div>

            {/* 2. Balance Card */}
            <div className="card balance-box">
                <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Total Balance</div>
                <div className="balance-amount">{balance.toFixed(1)}</div>
                <div style={{ 
                    background: 'rgba(255,255,255,0.15)', 
                    display: 'inline-block', 
                    padding: '5px 15px', 
                    borderRadius: '20px', 
                    fontSize: '0.9rem' 
                }}>
                    Skill Credits Available
                </div>
                
                {/* Test Credits Button */}
                <button 
                    onClick={addTestCredits}
                    style={{ 
                        marginTop: '20px',
                        padding: '10px 20px',
                        width: 'auto',
                        background: 'rgba(34, 211, 238, 0.2)',
                        border: '1px solid #22d3ee',
                        color: '#22d3ee',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        justifyContent: 'center',
                        margin: '20px auto 0'
                    }}
                >
                    🧪 Add Test Credits
                </button>
            </div>

            {/* 3. Pending Requests (Yellow Alert Box) */}
            {pending.length > 0 && (
                <div className="card" style={{ border: '1px solid #facc15', background: 'rgba(250, 204, 21, 0.1)' }}>
                    <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#facc15' }}>
                        ⚠️ Pending Confirmations
                    </h3>
                    {pending.map(iou => (
                        <div key={iou.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <div>
                                <strong style={{fontSize: '1.1rem'}}>{iou.giver.name}</strong>
                                <div style={{opacity: 0.7}}>Helped you with: {iou.skill.name}</div>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                <span style={{fontWeight: 'bold', color: '#f87171'}}>-{iou.credits} Credits</span>
                                <button 
                                    onClick={() => handleConfirm(iou.id)}
                                    style={{ padding: '8px 20px', fontSize: '0.9rem', width: 'auto', background: '#10b981' }}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 4. Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                <button 
                    onClick={() => window.location.href='/create-iou'}
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <FaHandHoldingHeart size={24} /> 
                        <span>Give Help (Earn)</span>
                    </div>
                </button>
                <button 
                    onClick={() => window.location.href='/request-help'}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <FaHandHoldingUsd size={24} /> 
                        <span>Request Help (Spend)</span>
                    </div>
                </button>
            </div>

            {/* 5. History Section */}
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <FaHistory /> Recent Transactions
            </h3>
            
            <div className="card" style={{ padding: '10px 20px' }}>
                {history.length === 0 ? (
                    <p style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>No transactions yet.</p>
                ) : (
                    history.map((item) => (
                        <div key={item.id} className="history-item">
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>{item.reason}</div>
                                <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>{new Date(item.timestamp).toLocaleDateString()}</div>
                            </div>
                            <div style={{ 
                                fontSize: '1.2rem', 
                                fontWeight: 'bold', 
                                color: item.creditChange > 0 ? '#4ade80' : '#f87171',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                {item.creditChange > 0 ? <FaArrowUp size={14}/> : <FaArrowDown size={14}/>}
                                {Math.abs(item.creditChange)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;