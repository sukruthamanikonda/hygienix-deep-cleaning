import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES_DATA } from '../constants';
import { API_BASE } from '../api';
import { Calendar, MapPin, User, Phone, CheckCircle, Sparkles, Loader2, ChevronRight } from 'lucide-react';

export default function BookNow() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [bookingForm, setBookingForm] = useState({
        name: '',
        phone: '',
        date: '',
        address: '',
        propertyType: 'home',
        bhkCategory: '1 BHK Furnished',
        notes: ''
    });

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (!storedUser || !storedToken) {
            // Redirect to login if not authenticated
            alert('Please login to book a service');
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);

        setBookingForm(prev => ({
            ...prev,
            name: parsedUser.name || '',
            phone: parsedUser.phone || ''
        }));
    }, [navigate]);

    const getCategoryOptions = (propertyType) => {
        switch (propertyType) {
            case 'home':
                return ['1 BHK Furnished', '2 BHK Furnished', '3 BHK Furnished', '1 BHK Unfurnished', '2 BHK Unfurnished', '3 BHK Unfurnished'];
            case 'villa':
                return ['Villa Furnished', 'Villa Unfurnished'];
            case 'commercial':
                return ['Office Cleaning', 'Flooring Scrub', 'Carpet Wash'];
            case 'kitchen':
                return ['Occupied Kitchen (No Chimney)', 'Occupied Kitchen + Chimney', 'Empty Kitchen (No Chimney)', 'Empty Kitchen + Chimney', 'Chimney Cleaning'];
            case 'specality':
                return ['Bathroom Descaling', 'Sofa Cleaning', 'Carpet Washing', 'Window Cleaning', 'Mattress Washing'];
            default:
                return [];
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const matchedService = SERVICES_DATA.find(s => s.bhkCategory === bookingForm.bhkCategory) || {};
        const serviceId = matchedService.id || 'generic-booking';
        const basePrice = matchedService.basePrice || 0;

        const payload = {
            items: [{
                serviceId: serviceId,
                serviceName: bookingForm.bhkCategory,
                ...bookingForm
            }],
            total: basePrice,
            customer_name: bookingForm.name,
            customer_phone: bookingForm.phone,
            address: bookingForm.address,
            service_date: bookingForm.date
        };

        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Server rejected booking');

            alert(`Booking confirmed! You will receive a WhatsApp confirmation shortly.`);
            navigate('/customer-dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                        <Sparkles className="text-emerald-500" />
                        Book Your Service
                    </h2>
                    <p className="text-slate-500 font-medium">Quick & secure booking in Bengaluru</p>
                </div>

                <form className="space-y-6" onSubmit={handleBookingSubmit}>
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Property Type</label>
                            <select
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                                value={bookingForm.propertyType}
                                onChange={e => {
                                    const newType = e.target.value;
                                    const newCats = getCategoryOptions(newType);
                                    setBookingForm({
                                        ...bookingForm,
                                        propertyType: newType,
                                        bhkCategory: newCats.length > 0 ? newCats[0] : ''
                                    });
                                }}
                            >
                                <option value="home">Home</option>
                                <option value="villa">Villa</option>
                                <option value="commercial">Commercial</option>
                                <option value="kitchen">Kitchen</option>
                                <option value="specality">Specialty</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                            <select
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                                value={bookingForm.bhkCategory}
                                onChange={e => setBookingForm({ ...bookingForm, bhkCategory: e.target.value })}
                            >
                                {getCategoryOptions(bookingForm.propertyType).map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
                            <input
                                required
                                type="text"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                                value={bookingForm.name}
                                onChange={e => setBookingForm({ ...bookingForm, name: e.target.value.replace(/[^A-Za-z ]/g, "") })}
                                placeholder="Your Name"
                            />
                        </div>

                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
                            <input
                                required
                                type="tel"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                                value={bookingForm.phone}
                                onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value.replace(/[^0-9]/g, "").slice(0, 10) })}
                                placeholder="Phone Number"
                            />
                        </div>

                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
                            <input
                                required
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                                value={bookingForm.date}
                                onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                            />
                        </div>

                        <div className="relative group">
                            <MapPin className="absolute left-4 top-4 text-slate-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
                            <textarea
                                required
                                rows="3"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                                value={bookingForm.address}
                                onChange={e => setBookingForm({ ...bookingForm, address: e.target.value })}
                                placeholder="Service Address (Bengaluru Only)"
                            ></textarea>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                        Confirm Booking
                    </button>

                    <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest pt-4 italic">
                        No prepayment required. Pay after service.
                    </p>
                </form>
            </div>
        </div>
    );
}
