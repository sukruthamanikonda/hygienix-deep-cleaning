import React from 'react';
import { Link } from 'react-router-dom';
import {
    Phone, Mail, MapPin, CheckCircle,
    ArrowRight, Facebook, Instagram, Twitter
} from 'lucide-react';
import { COMPANY_INFO, SERVICES_DATA } from '../constants';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const whatsappNumber = COMPANY_INFO.phone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;

    return (
        <footer className="relative bg-slate-900 pt-20 pb-10 overflow-hidden">
            {/* Dynamic Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Identity */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
                                <CheckCircle className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">HYGIENIX</span>
                        </Link>
                        <p className="text-slate-400 mb-8 leading-relaxed font-medium">
                            Bengaluru's premier deep cleaning experts. We transform homes and offices into pristine, healthy environments with medical-grade precision.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Facebook, href: "#", color: "hover:bg-blue-600" },
                                { icon: Instagram, href: "#", color: "hover:bg-pink-600" },
                                { icon: Twitter, href: "#", color: "hover:bg-sky-500" }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 ${social.color}`}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Services */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></span>
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/" className="text-slate-400 hover:text-emerald-400 flex items-center gap-2 group transition-colors">
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="text-slate-400 hover:text-emerald-400 flex items-center gap-2 group transition-colors">
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    Our Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-slate-400 hover:text-emerald-400 flex items-center gap-2 group transition-colors">
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    About Hygienix
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-slate-400 hover:text-emerald-400 flex items-center gap-2 group transition-colors">
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
                            Contact Us
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></span>
                        </h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Location</p>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        No.49, 1st Main, 1st Cross, S.G. Halli, <br />
                                        Kamalanagar, Bengaluru - 560079
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Call Us</p>
                                    <a href={`tel:${COMPANY_INFO.phone}`} className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                                        {COMPANY_INFO.phone}
                                    </a>
                                </div>
                            </div>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20"
                            >
                                <Phone size={18} fill="currentColor" />
                                WhatsApp Us
                            </a>
                        </div>
                    </div>

                    {/* Google Maps Iframe */}
                    <div className="lg:col-span-1">
                        <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
                            Service Area
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></span>
                        </h4>
                        <div className="rounded-2xl overflow-hidden border border-slate-700 h-48 shadow-2xl group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.643874400262!2d77.533878!3d12.9946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3dd5a95f0001%3A0xc3f6a29774656fa5!2sKamalanagar!5e0!3m2!1sen!2sin!4v1704530000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                            ></iframe>
                        </div>
                        <p className="text-slate-500 text-xs mt-4 italic font-medium">Serving Kamalanagar & All Areas of Bengaluru</p>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm font-medium">
                        &copy; {currentYear} HYGIENIX Deep Cleaning Services. Built for the citizens of Bengaluru.
                    </p>
                    <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Use</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
