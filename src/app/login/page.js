'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { Lock, Mail, User } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('mode') === 'register') {
            setIsRegister(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint = isRegister ? '/website/register' : '/website/login';
            const res = await axiosInstance.post(endpoint, formData);
            if (res.data.status) {
                toast.success(isRegister ? "Registration successful!" : "Login successful!");
                localStorage.setItem('qm_token', res.data.token);
                localStorage.setItem('qm_user', JSON.stringify(res.data.data));
                const nextPath = new URLSearchParams(window.location.search).get('next');
                router.push(nextPath?.startsWith('/') ? nextPath : '/dashboard');
            } else {
                toast.error(res.data.message || "Authentication failed.");
            }
        } catch (err) {
            console.error("Auth error:", err);
            toast.error(err.response?.data?.message || 'Unable to sign in. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-8 space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-extrabold text-white font-outfit">
                    {isRegister ? 'Create Your Account' : 'Welcome Back'}
                </h1>
                <p className="text-xs text-slate-400">Sign in to access quizzes, scorecards, and your performance dashboard.</p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-4 border-cyan-500/30">
                {isRegister && (
                    <div className="space-y-1">
                        <label className="text-xs text-slate-300 font-medium">Full Name</label>
                        <div className="relative">
                            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                required
                                placeholder="Rahul Sharma"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">Email Address</label>
                    <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="email"
                            required
                                placeholder="Enter your email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">Password</label>
                    <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-2.5 text-xs justify-center font-semibold mt-2"
                >
                    {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
                </button>

                <div className="text-center pt-2 border-t border-white/10">
                    <button
                        type="button"
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-xs text-cyan-400 hover:underline"
                    >
                        {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register now"}
                    </button>
                </div>
            </form>
        </div>
    );
}
