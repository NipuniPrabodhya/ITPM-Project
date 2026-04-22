import React, { useEffect, useState } from 'react';
import { authAPI } from '../services/api';

const SellerInfoModal = ({ isOpen, onClose, username, buyerUsername }) => {
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRating, setUserRating] = useState(0);

    useEffect(() => {
        if (isOpen && username) {
            setLoading(true);
            authAPI.getUserByUsername(username)
                .then(res => {
                    setSeller(res.data);
                    // Check if buyer has already rated
                    const rating = res.data.ratings?.find(r => r.buyer === buyerUsername);
                    if (rating) setUserRating(rating.rating);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, username, buyerUsername]);

    const handleRate = async (rating) => {
        if (!buyerUsername) return alert("Please login to rate sellers");
        if (buyerUsername === username) return alert("You cannot rate yourself");

        try {
            const res = await authAPI.rateSeller(username, rating);
            setUserRating(rating);
            setSeller(prev => ({ ...prev, trustScore: res.data.trustScore }));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to rate seller");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "500px" }}>
                <div className="modal-header">
                    <h3>Seller Information</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>Loading info...</p>
                ) : seller ? (
                    <div style={{ textAlign: 'center' }}>
                        <div className="avatar avatar-lg" style={{ marginBottom: '15px' }}>
                            {seller.profileImg ? <img src={seller.profileImg} alt={seller.username} className="avatar avatar-lg" /> : seller.username[0].toUpperCase()}
                        </div>
                        <h2 style={{ margin: '0 0 5px 0', color: 'var(--accent-primary)' }}>@{seller.username}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Campus Community Member</p>
                        
                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            padding: '20px', 
                            borderRadius: '12px',
                            marginBottom: '25px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Trust Score</p>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success-color)' }}>
                                    {seller.trustScore ? seller.trustScore.toFixed(1) : '0.0'}
                                </span>
                                <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/ 5.0</span>
                            </div>
                            <div style={{ marginTop: '5px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                Based on {seller.ratings?.length || 0} buyer reviews
                            </div>
                        </div>

                        {buyerUsername && buyerUsername !== username && (
                            <div style={{ marginBottom: '10px' }}>
                                <p style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Rate this seller:</p>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button 
                                            key={star}
                                            onClick={() => handleRate(star)}
                                            style={{
                                                background: 'transparent',
                                                fontSize: '1.8rem',
                                                color: star <= userRating ? '#fbbf24' : '#4b5563',
                                                padding: 0,
                                                transition: 'transform 0.1s'
                                            }}
                                            onMouseOver={e=>e.target.style.transform='scale(1.2)'}
                                            onMouseOut={e=>e.target.style.transform='scale(1)'}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                For security reasons, personal contact details are only shared after a successful purchase.
                            </p>
                        </div>
                    </div>
                ) : (
                    <p>Seller not found</p>
                )}
            </div>
        </div>
    );
};

export default SellerInfoModal;
