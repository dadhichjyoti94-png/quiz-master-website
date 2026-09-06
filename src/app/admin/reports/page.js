'use client';
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { Users, Shield, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';

export default function AdminReports() {
    const [users, setUsers] = useState([]);
    const [recentAttempts, setRecentAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const [userRes, statRes] = await Promise.all([
                    axiosInstance.get('/admin/users'),
                    axiosInstance.get('/admin/dashboard-stats')
                ]);
                if (userRes.data.status) setUsers(userRes.data.data);
                if (statRes.data.status) setRecentAttempts(statRes.data.data.recentAttempts || []);
            } catch (err) {
                console.error(err);
                setUsers([{ _id: 'u1', name: 'Rahul Sharma', email: 'user@quizmaster.com', role: 'user' }]);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    return (
        <AuthGuard adminOnly>
        <div className="space-y-8 py-4">
            <div>
                <Link href="/admin" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mb-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin
                </Link>
                <h1 className="text-3xl font-extrabold text-white font-outfit">User & Performance Reports</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* REGISTERED USERS */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                        <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2 border-b border-white/10 pb-3">
                            <Users className="w-4 h-4 text-cyan-400" /> Registered Learners ({users.length})
                        </h3>

                        <div className="space-y-3">
                            {users.map(u => (
                                <div key={u._id} className="p-3.5 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold text-white">{u.name}</h4>
                                        <p className="text-[11px] text-slate-400">{u.email}</p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                                        {u.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SUBMISSION ATTEMPTS REPORT */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                        <h3 className="text-lg font-bold text-white font-outfit border-b border-white/10 pb-3">
                            Recent Test Submissions
                        </h3>

                        {recentAttempts.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-6">No test submissions logged yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {recentAttempts.map(att => (
                                    <div key={att._id} className="p-4 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs">
                                        <div>
                                            <h4 className="font-bold text-white">{att.quiz?.quizTitle || 'Quiz Test'}</h4>
                                            <p className="text-[11px] text-slate-400">User: {att.user?.name || 'Rahul Sharma'}</p>
                                        </div>

                                        <div className="text-right space-y-1">
                                            <span className="font-mono font-bold text-cyan-400 block">{att.score}%</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${att.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                                                {att.passed ? 'Passed' : 'Failed'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </AuthGuard>
    );
}
