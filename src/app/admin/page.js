'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '@/utils/axiosInstance';
import { Shield, Layers, HelpCircle, Users, Award, PlusCircle, List, ArrowRight } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalCategories: 4,
        totalQuizzes: 2,
        totalQuestions: 8,
        totalUsers: 1,
        totalAttempts: 5,
        recentAttempts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get('/admin/dashboard-stats');
                if (res.data.status) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch admin stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <AuthGuard adminOnly>
        <div className="space-y-8 py-4">
            {/* ADMIN HEADER BANNER */}
            <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 border-indigo-500/40 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Admin Control Panel</span>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white font-outfit">QuizMaster Admin Center</h1>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link href="/admin/quizzes" className="btn-primary text-xs py-2 px-4">
                        <PlusCircle className="w-4 h-4" /> Add New Quiz
                    </Link>
                    <Link href="/admin/questions" className="btn-secondary text-xs py-2 px-4">
                        <PlusCircle className="w-4 h-4 text-cyan-400" /> Add Questions
                    </Link>
                </div>
            </div>

            {/* METRICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/admin/categories" className="glass-panel p-6 rounded-2xl border-cyan-500/20 hover:border-cyan-500/50 transition-colors block text-decoration-none">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-400">Categories</span>
                        <Layers className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-white font-outfit">{stats.totalCategories}</h3>
                    <p className="text-xs text-cyan-400 mt-2 font-semibold">Manage Categories →</p>
                </Link>

                <Link href="/admin/quizzes" className="glass-panel p-6 rounded-2xl border-indigo-500/20 hover:border-indigo-500/50 transition-colors block text-decoration-none">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-400">Total Quizzes</span>
                        <Award className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-white font-outfit">{stats.totalQuizzes}</h3>
                    <p className="text-xs text-indigo-400 mt-2 font-semibold">Manage Quizzes →</p>
                </Link>

                <Link href="/admin/questions" className="glass-panel p-6 rounded-2xl border-purple-500/20 hover:border-purple-500/50 transition-colors block text-decoration-none">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-400">Question Bank</span>
                        <HelpCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-white font-outfit">{stats.totalQuestions}</h3>
                    <p className="text-xs text-purple-400 mt-2 font-semibold">Manage Questions →</p>
                </Link>

                <Link href="/admin/reports" className="glass-panel p-6 rounded-2xl border-emerald-500/20 hover:border-emerald-500/50 transition-colors block text-decoration-none">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-400">Submissions</span>
                        <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-white font-outfit">{stats.totalAttempts}</h3>
                    <p className="text-xs text-emerald-400 mt-2 font-semibold">View Reports →</p>
                </Link>
            </div>

            {/* NAVIGATION MODULES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl space-y-3 border-cyan-500/30">
                    <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                        <Layers className="w-5 h-5 text-cyan-400" /> Quiz Categories
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Create, edit and organize technology domains like Web Dev, Python, Java, and CS Core.
                    </p>
                    <Link href="/admin/categories" className="btn-primary text-xs py-2 px-4 w-full justify-center">
                        Open Category Manager <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="glass-panel p-6 rounded-2xl space-y-3 border-indigo-500/30">
                    <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                        <Award className="w-5 h-5 text-indigo-400" /> Quiz Setup
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Set quiz titles, duration timer (minutes), passing percentages, and difficulty levels.
                    </p>
                    <Link href="/admin/quizzes" className="btn-primary text-xs py-2 px-4 w-full justify-center bg-gradient-to-r from-indigo-600 to-purple-600">
                        Open Quiz Manager <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="glass-panel p-6 rounded-2xl space-y-3 border-purple-500/30">
                    <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-purple-400" /> MCQ Question Builder
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Add questions with 4 options (A, B, C, D), specify correct option key and explanations.
                    </p>
                    <Link href="/admin/questions" className="btn-primary text-xs py-2 px-4 w-full justify-center bg-gradient-to-r from-purple-600 to-pink-600">
                        Open Question Builder <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
        </AuthGuard>
    );
}
