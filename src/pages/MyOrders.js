import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, MapPin, Calendar, CreditCard } from 'lucide-react';
import { API_BASE } from '../api';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please login to view your orders');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_BASE}/orders/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to fetch orders');
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="text-center py-20">Loading your bookings...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Package className="w-8 h-8 text-emerald-600" />
                My Bookings
            </h1>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500">You haven't made any bookings yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Booking ID: #{order.id}</div>
                                        <div className="font-semibold text-lg">{order.items[0]?.service || 'Cleaning Service'}</div>
                                    </div>
                                    <div className={`px-4 py-1 rounded-full text-sm font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>Scheduled: {order.service_date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{order.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium text-gray-900">Total: ₹{order.total}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>Booked on: {new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
