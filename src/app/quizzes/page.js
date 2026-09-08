'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '@/utils/axiosInstance';
import { Search, Filter, Clock, Award, Play, ArrowRight } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';

export default function QuizzesPage() {
    const [categories, setCategories] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get('/website/categories');
                if (res.data.status) setCategories(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            try {
                let url = '/website/quizzes?';
                if (selectedCategory) url += `categoryId=${selectedCategory}&`;
                if (selectedDifficulty) url += `difficulty=${selectedDifficulty}&`;
                const res = await axiosInstance.get(url);
                if (res.data.status) setQuizzes(res.data.data);
            } catch (err) {
                console.error(err);
                // Mock fallback
                setQuizzes([
                    { _id: 'q1', quizTitle: 'JavaScript & React Fundamentals', category: { categoryName: 'Web Development' }, difficulty: 'Medium', durationMinutes: 10, totalQuestions: 5 },
                    { _id: 'q2', quizTitle: 'Python Essentials & Data Types', category: { categoryName: 'Python Programming' }, difficulty: 'Easy', durationMinutes: 8, totalQuestions: 3 }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [selectedCategory, selectedDifficulty]);

    const filteredQuizzes = quizzes.filter(q => {
        const quizTitle = q.quizTitle || q.title || q.categoryName || '';
        return quizTitle.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <AuthGuard><div className="space-y-8 py-4">
            <div className="text-center max-w-2xl mx-auto space-y-3">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white font-outfit">
                    Explore <span className="gradient-text">Quizzes</span>
                </h1>
                <p className="text-slate-400 text-sm">
                    Select a quiz topic, test your knowledge against the countdown timer, and claim your instant scorecard.
                </p>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-cyan-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => (
                                <option key={c._id} value={c._id}>{c.categoryName}</option>
                            ))}
                        </select>
                    </div>

                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>

                    {(selectedCategory || selectedDifficulty || searchQuery) && (
                        <button
                            onClick={() => { setSelectedCategory(''); setSelectedDifficulty(''); setSearchQuery(''); }}
                            className="text-xs text-rose-400 underline px-2 hover:text-rose-300"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            </div>

            {/* QUIZZES GRID */}
            {loading ? (
                <div className="text-center py-20 text-slate-400">Loading quizzes...</div>
            ) : filteredQuizzes.length === 0 ? (
                <div className="glass-panel p-12 text-center text-slate-400 rounded-2xl">
                    No quizzes found matching your selected filters.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuizzes.map((q) => (
                        <div key={q._id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-cyan-500/50 transition-all">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                                        {q.category?.categoryName || 'General'}
                                    </span>
                                    <span className={`badge badge-${q.difficulty?.toLowerCase() || 'medium'}`}>
                                        {q.difficulty || 'Medium'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white font-outfit">{q.quizTitle || q.title || q.categoryName || 'Untitled Quiz'}</h3>
                                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                                    {q.description || 'Interactive technical assessment test with automatic timer and scorecard.'}
                                </p>
                            </div>

                            <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-400" /> {q.durationMinutes} Mins</span>
                                    <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-indigo-400" /> {q.totalQuestions || 5} Qs</span>
                                </div>
                                <Link href={`/quiz/${q._id}`} className="btn-primary text-xs py-2 px-4">
                                    Start Quiz <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div></AuthGuard>
    );
}
