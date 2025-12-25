import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api';
import { Mail, Lock, User, Phone, Loader2, AlertCircle } from 'lucide-react';

const CustomerAuth = () => {
    const [activeTab, setActiveTab] = useState('login'); // 'login', 'signup', 'forgot'
    const [userType, setUserType] = useState('customer'); // 'customer' or 'admin'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Form states
    const [loginData, setLoginData] = useState({ identifier: '', password: '' });
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [forgotEmail, setForgotEmail] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = userType === 'admin' ? '/auth/admin/login' : '/auth/customer/login';
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            // Save to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/customer-dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/customer/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Signup failed');

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/customer-dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/customer/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });

            const data = await res.json();
            setSuccess(data.message);
        } catch (err) {
            setError('Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Hygienix Login</h1>
                    <p className="text-gray-600">Sign in with Password</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* User Type Tabs - Only show on login tab */}
                    {activeTab === 'login' && (
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => setUserType('customer')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${userType === 'customer'
                                        ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-600'
                                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                                    }`}
                            >
                                <User size={20} />
                                Customer
                            </button>
                            <button
                                onClick={() => setUserType('admin')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${userType === 'admin'
                                        ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-600'
                                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Admin
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    required
                                    value={loginData.identifier}
                                    onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    placeholder="Email or Phone Number"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    placeholder="Password"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all disabled:opacity-70 flex justify-center items-center"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Login'}
                            </button>

                            {/* Additional Options */}
                            {userType === 'customer' && (
                                <div className="flex justify-between text-sm mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('signup')}
                                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                                    >
                                        Create Account
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('forgot')}
                                        className="text-gray-600 hover:text-gray-700 font-medium"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}
                        </form>
                    )}

                    {/* Signup Form */}
                    {activeTab === 'signup' && (
                        <form onSubmit={handleSignup} className="space-y-5">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    required
                                    value={signupData.name}
                                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={signupData.email}
                                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    placeholder="Email"
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    value={signupData.phone}
                                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    placeholder="Phone (Optional)"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={signupData.password}
                                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    placeholder="Password"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={signupData.confirmPassword}
                                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    placeholder="Confirm Password"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-70 flex justify-center items-center"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('login')}
                                className="w-full text-sm text-gray-600 hover:text-gray-700 font-medium"
                            >
                                Already have an account? Login
                            </button>
                        </form>
                    )}

                    {/* Forgot Password Form */}
                    {activeTab === 'forgot' && (
                        <form onSubmit={handleForgotPassword} className="space-y-5">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    placeholder="Email"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-70 flex justify-center items-center"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('login')}
                                className="w-full text-sm text-gray-600 hover:text-gray-700 font-medium"
                            >
                                Back to Login
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerAuth;
