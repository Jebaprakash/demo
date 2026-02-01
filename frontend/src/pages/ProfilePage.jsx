import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';

export const ProfilePage = () => {
    const { user, userLogout, isAuthenticated, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
        }
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }

        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                address: user.address || {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: ''
                }
            });
        }
    }, [user, isAuthenticated, authLoading, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: { ...formData[parent], [child]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await usersAPI.updateProfile(formData);

            if (res.data.success) {
                toast.success('Profile updated successfully!');
            } else {
                toast.error(res.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            toast.error(error.response?.data?.message || 'Connection failed');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-80"
                    >
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50">
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                                    <span className="text-3xl font-black text-primary-600">
                                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                    </span>
                                </div>
                                <h2 className="text-xl font-black text-slate-900">{user?.firstName} {user?.lastName}</h2>
                                <p className="text-slate-400 font-bold text-sm tracking-tight">{user?.email}</p>
                            </div>

                            <nav className="space-y-2">
                                <button className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl bg-primary-50 text-primary-600 font-black transition-all">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Personal Info</span>
                                </button>
                                <button
                                    onClick={userLogout}
                                    className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 font-black transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </nav>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1"
                    >
                        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-slate-200/50">
                            <h1 className="text-3xl font-black text-slate-900 mb-8">Account Settings</h1>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <h3 className="text-lg font-black text-slate-900 mb-6">Shipping Address</h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                                            <input
                                                type="text"
                                                name="address.street"
                                                value={formData.address.street}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                                                <input
                                                    type="text"
                                                    name="address.city"
                                                    value={formData.address.city}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                                                <input
                                                    type="text"
                                                    name="address.state"
                                                    value={formData.address.state}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Zip Code</label>
                                                <input
                                                    type="text"
                                                    name="address.zipCode"
                                                    value={formData.address.zipCode}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg tracking-widest shadow-xl shadow-slate-900/20 hover:bg-primary-600 hover:shadow-primary-500/40 transition-all uppercase mt-8 flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <span>Save Changes</span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
