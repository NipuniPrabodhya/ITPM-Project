import React, { useState, useEffect, useCallback } from "react";
import { orderAPI } from "../services/api";
import { useNotification, useCart } from "../App";
import ConfirmModal from "../components/ConfirmModal";

export default function SellerOrders({ user }) {
    const { showToast } = useNotification();
    const { refreshCounts } = useCart();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [orderToVerify, setOrderToVerify] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await orderAPI.getSellerOrders();
            setOrders(response.data);
        } catch (error) {
            showToast("Failed to fetch orders", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleVerify = async () => {
        if (!orderToVerify) return;
        
        setIsVerifying(true);
        try {
            await orderAPI.verifyOrder(orderToVerify._id);
            showToast("Order verified successfully!");
            setSelectedOrder(null);
            setOrderToVerify(null);
            fetchOrders();
            refreshCounts();
        } catch (error) {
            showToast(error.response?.data?.message || "Verification failed", "error");
        } finally {
            setIsVerifying(false);
        }
    };

    if (loading) return <p style={{ textAlign: "center", marginTop: "100px", color: "white" }}>Loading Orders...</p>;

    return (
        <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>
            <h2 style={{ color: "var(--text-primary)", marginBottom: "30px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span>💰</span> Manage Sales & Payments
            </h2>

            <div style={{ display: "grid", gap: "20px" }}>
                {orders.length === 0 ? (
                    <div className="card" style={{ padding: "40px", textAlign: "center" }}>
                        <p style={{ color: "var(--text-secondary)" }}>No orders found for your products.</p>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="card" style={{ padding: "25px", border: "1px solid var(--border-color)", transition: "transform 0.2s" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                                <div>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                                        <span style={{ 
                                            padding: "4px 12px", 
                                            borderRadius: "20px", 
                                            fontSize: "0.75rem", 
                                            fontWeight: "bold",
                                            textTransform: "uppercase",
                                            background: order.status === 'completed' ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 171, 0, 0.1)',
                                            color: order.status === 'completed' ? '#00c853' : '#ffab00',
                                            border: `1px solid ${order.status === 'completed' ? '#00c853' : '#ffab00'}`
                                        }}>
                                            {order.status}
                                        </span>
                                        <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                                            ID: {order._id.substring(order._id.length - 8)}
                                        </span>
                                    </div>
                                    <h4 style={{ margin: "5px 0", color: "var(--text-primary)" }}>Buyer: {order.buyer}</h4>
                                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                        Ordered on: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold", color: "var(--accent-primary)" }}>
                                        Rs. {order.totalAmount.toLocaleString()}
                                    </p>
                                    {order.status === 'processing' && (
                                        <button 
                                            className="btn-primary" 
                                            style={{ marginTop: "10px", padding: "8px 20px" }}
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            View Slip
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={{ background: "rgba(0,0,0,0.1)", borderRadius: "12px", padding: "15px" }}>
                                <p style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "600" }}>Items Ordered:</p>
                                <div style={{ display: "grid", gap: "8px" }}>
                                    {order.products.map(item => (
                                        <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                                            <span style={{ color: "var(--text-primary)" }}>{item.title}</span>
                                            <span style={{ color: "var(--text-secondary)" }}>Rs. {item.price.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Slip Viewer Modal */}
            {selectedOrder && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
                    <div className="card" style={{ maxWidth: "600px", width: "100%", maxHeight: "90vh", overflow: "auto", position: "relative", padding: "30px" }}>
                        <button 
                            onClick={() => setSelectedOrder(null)}
                            style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", color: "var(--text-secondary)", fontSize: "1.5rem", cursor: "pointer" }}
                        >
                            ✕
                        </button>
                        <h3 style={{ color: "var(--text-primary)", marginBottom: "20px" }}>Payment Slip Verification</h3>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>Order total: <strong style={{ color: "var(--accent-primary)" }}>Rs. {selectedOrder.totalAmount.toLocaleString()}</strong></p>
                        
                        <div style={{ width: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)", marginBottom: "25px" }}>
                            <img src={selectedOrder.slipImage} alt="Bank Slip" style={{ width: "100%", height: "auto", display: "block" }} />
                        </div>

                        <div style={{ display: "flex", gap: "15px" }}>
                            <button 
                                className="btn-primary" 
                                style={{ flex: 1, padding: "12px" }}
                                onClick={() => setOrderToVerify(selectedOrder)}
                                disabled={isVerifying}
                            >
                                {isVerifying ? "Verifying..." : "Confirm Payment & Process Order"}
                            </button>
                            <button 
                                className="btn-secondary" 
                                style={{ flex: 1, padding: "12px" }}
                                onClick={() => setSelectedOrder(null)}
                                disabled={isVerifying}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal 
                isOpen={!!orderToVerify}
                title="Verify Payment"
                message={`Are you sure you want to verify this payment of Rs. ${orderToVerify?.totalAmount.toLocaleString()}? This will update your product stock and mark items as sold.`}
                onConfirm={handleVerify}
                onCancel={() => setOrderToVerify(null)}
                confirmText="Confirm Verification"
                confirmColor="var(--success-color)"
            />
        </div>
    );
}
