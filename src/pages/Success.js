import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, MessageCircle, Home, ArrowRight } from 'lucide-react';

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">No Booking Found</h1>
          <button
            onClick={() => navigate('/services')}
            className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold"
          >
            Go to Services
          </button>
        </div>
      </div>
    );
  }

  const adminWhatsApp = '919535901059';
  const message = encodeURIComponent(
    `Hi, I just booked a Hygienix service.\n` +
    `Order ID: #${order.id}\n` +
    `Name: ${order.name}\n` +
    `Phone: ${order.phone}\n` +
    `Service: ${order.serviceType}\n` +
    `Category: ${order.category}\n` +
    `Date: ${order.date}\n` +
    `Address: ${order.address}`
  );

  const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${message}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4 animate-fade-in">
      <div className="max-w-lg w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-6">
          <CheckCircle className="text-emerald-500 w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
        <p className="text-slate-500 font-medium mb-8">
          Thank you, {order.name}! We've received your booking. Our team will contact you shortly.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-3 border border-slate-100">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Order ID</span>
            <span className="text-slate-700 font-bold">#{order.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Service</span>
            <span className="text-slate-700 font-bold">{order.serviceType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Date</span>
            <span className="text-slate-700 font-bold">{order.date}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#128C7E] transition-all duration-300 shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95"
          >
            <MessageCircle size={22} />
            Contact us on WhatsApp
          </a>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => navigate('/customer-dashboard')}
              className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              My Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="py-4 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              Go Home
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-400 font-bold uppercase tracking-widest italic">
          You'll also receive an email confirmation shortly.
        </p>
      </div>
    </div>
  );
}
