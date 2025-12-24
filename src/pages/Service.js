import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SERVICES_DATA, EXCLUDED_ITEMS } from '../constants';
import { API_BASE } from '../api';
import { Lock, Sparkles, X, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';

export default function Services() {
  const { user, bLogin, token } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingForm, setBookingForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    date: '',
    address: '',
    propertyType: 'home',
    bhkCategory: '1 BHK Furnished',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      setBookingForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  const categories = ['All', ...new Set(SERVICES_DATA.map(s => s.category))];

  const filteredServices = activeCategory === 'All'
    ? SERVICES_DATA
    : SERVICES_DATA.filter(s => s.category === activeCategory);

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

  const openBooking = (service) => {
    const propertyType = service.propertyType || 'home';
    const bhkCategory = service.bhkCategory || '1 BHK Furnished';

    setSelectedService(service);
    setBookingForm(prev => ({
      ...prev,
      propertyType,
      bhkCategory,
    }));
  };

  const closeBooking = () => {
    setSelectedService(null);
    setError('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        items: [{
          serviceId: selectedService.id,
          serviceName: selectedService.title,
          ...bookingForm
        }],
        total: selectedService.basePrice || 0,
        customer_name: bookingForm.name,
        customer_phone: bookingForm.phone,
        address: bookingForm.address,
        service_date: bookingForm.date
      };

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');

      alert(`Booking confirmed! You will receive a WhatsApp confirmation shortly.`);

      if (token) {
        navigate('/my-orders');
      } else {
        navigate('/');
      }
      closeBooking();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-emerald-500" />
            Our Professional Services
          </h1>
          <p className="text-gray-600">Transparent pricing. No hidden charges. Bengaluru's #1 Deep Cleaning.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeCategory === cat
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105'
                : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map(service => (
            <div key={service.id} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-300">
              <div className="h-60 relative overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{service.category}</span>
                </div>
              </div>

              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-emerald-600 font-extrabold text-xl mb-6">{service.priceDescription}</p>

                <div className="space-y-3 mb-8 flex-grow">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start text-sm text-slate-600 font-medium">
                      <div className="bg-emerald-100 text-emerald-600 rounded-full p-0.5 mr-3 mt-0.5">
                        <CheckCircle size={14} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => openBooking(service)}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group-hover:translate-y-[-2px]"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Excluded Items */}
        <div className="mt-24 bg-red-50 p-10 rounded-[2.5rem] border border-red-100 shadow-inner">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <X className="text-red-500 bg-red-100 rounded-full p-1" />
            What's Excluded
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {EXCLUDED_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center text-slate-700 font-medium text-sm">
                <span className="text-red-400 mr-3 text-lg">×</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-slide-up relative overflow-y-auto max-h-[90vh] border border-slate-100">
            <button onClick={closeBooking} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 p-2 rounded-full">
              <X size={24} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Book Service</h2>
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <Sparkles size={18} />
                {selectedService.title}
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                      value={bookingForm.name}
                      onChange={e => setBookingForm({ ...bookingForm, name: e.target.value.replace(/[^A-Za-z ]/g, "") })}
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                    <input
                      required
                      type="tel"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                      value={bookingForm.phone}
                      onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value.replace(/[^0-9]/g, "").slice(0, 10) })}
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Property Type</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                      value={bookingForm.propertyType}
                      onChange={e => setBookingForm({ ...bookingForm, propertyType: e.target.value })}
                    >
                      <option value="home">Home</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="specality">Specialty</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                      value={bookingForm.bhkCategory}
                      onChange={e => setBookingForm({ ...bookingForm, bhkCategory: e.target.value })}
                    >
                      {getCategoryOptions(bookingForm.propertyType).map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Date</label>
                  <input
                    required
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                    value={bookingForm.date}
                    onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Address</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Street, Apartment, Landmark..."
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
                    value={bookingForm.address}
                    onChange={e => setBookingForm({ ...bookingForm, address: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                Confirm Booking
              </button>
            </form>
            <p className="text-xs text-center text-slate-400 mt-6 font-bold uppercase tracking-widest italic">Pay after service completion</p>
          </div>
        </div>
      )}
    </div>
  );
}
