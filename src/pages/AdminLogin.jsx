import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api';
import { Mail, Lock, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            // Save to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to admin dashboard
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-2xl mb-4">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">
                        Admin Portal
                    </h2>
                    <p className="text-slate-400 mt-2">Hygienix Deep Cleaning</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6">
                        <h3 className="text-xl font-bold text-white text-center">Administrator Login</h3>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                                    placeholder="Email or Phone"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                                    placeholder="Password"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all disabled:opacity-70 flex justify-center items-center"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Admin Login'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-slate-500 text-sm">
                                Authorized personnel only
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="text-slate-400 text-sm">
                        Customer? <a href="/login" className="text-emerald-400 font-bold hover:underline">Login here</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
