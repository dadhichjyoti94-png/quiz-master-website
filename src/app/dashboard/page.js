'use client';
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import Link from 'next/link';
import { User, Trophy, CheckCircle, Clock, Award, ArrowRight, Play } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';

export default function UserDashboard() {
    const [user, setUser] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('qm_user');
        const userObj = storedUser ? JSON.parse(storedUser) : { id: '660000000000000000000001', name: 'Rahul Sharma', email: 'user@quizmaster.com' };
        setUser(userObj);

        const fetchHistory = async () => {
            try {
                const res = await axiosInstance.get(`/website/attempt/user/${userObj.id}`);
                if (res.data.status) {
                    setAttempts(res.data.data);
                }
            } catch (err) {
                console.error("Error loading user attempts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter(a => a.passed).length;
    const avgScore = totalAttempts > 0 ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts) : 0;

    return (
        <AuthGuard>
        <div className="space-y-8 py-4">
            {/* USER PROFILE HEADER */}
            <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 border-cyan-500/30">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-cyan-500/20">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white font-outfit">{user?.name || 'Learner Dashboard'}</h1>
                        <p className="text-xs text-slate-400">{user?.email || 'user@quizmaster.com'}</p>
                    </div>
                </div>

                <Link href="/quizzes" className="btn-primary text-xs py-2.5 px-6">
                    <Play className="w-4 h-4 fill-current" /> Browse New Quizzes
                </Link>
            </div>

            {/* STATS OVERVIEW CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl space-y-2 border-cyan-500/20">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Quizzes Attempted</span>
                    <h3 className="text-3xl font-extrabold text-white font-outfit">{totalAttempts}</h3>
                    <p className="text-xs text-cyan-400">Recorded on platform</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl space-y-2 border-emerald-500/20">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quizzes Passed</span>
                    <h3 className="text-3xl font-extrabold text-emerald-400 font-outfit">{passedAttempts}</h3>
                    <p className="text-xs text-emerald-300">Passing criteria met</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl space-y-2 border-indigo-500/20">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Score</span>
                    <h3 className="text-3xl font-extrabold text-indigo-400 font-outfit">{avgScore}%</h3>
                    <p className="text-xs text-indigo-300">Overall accuracy rate</p>
                </div>
            </div>

            {/* PAST ATTEMPTS TABLE */}
            <div className="glass-panel p-6 rounded-2xl space-y-6">
                <h3 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" /> Recent Quiz Attempts
                </h3>

                {loading ? (
                    <div className="text-center py-10 text-slate-400">Loading history...</div>
                ) : attempts.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-3">
                        <p>No past quiz attempts found.</p>
                        <Link href="/quizzes" className="btn-primary text-xs py-2 px-4 inline-flex">
                            Take Your First Quiz
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="p-3.5">Quiz Title</th>
                                    <th className="p-3.5">Score</th>
                                    <th className="p-3.5">Status</th>
                                    <th className="p-3.5">Date</th>
                                    <th className="p-3.5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {attempts.map((att) => (
                                    <tr key={att._id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="p-3.5 font-semibold text-white">
                                            {att.quiz?.quizTitle || 'Quiz Test'}
                                        </td>
                                        <td className="p-3.5 font-mono font-bold text-cyan-400">
                                            {att.score}%
                                        </td>
                                        <td className="p-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${att.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                                }`}>
                                                {att.passed ? 'Passed' : 'Failed'}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-slate-400">
                                            {new Date(att.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-3.5 text-right">
                                            <Link href={`/quiz/${att.quiz?._id || att.quiz}/result?attemptId=${att._id}`} className="text-cyan-400 font-semibold hover:underline">
                                                View Solution
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
        </AuthGuard>
    );
}
