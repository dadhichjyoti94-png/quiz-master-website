'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '@/utils/axiosInstance';
import { Play, Award, Clock, Zap, CheckCircle2, ArrowRight, Code, Terminal, Cpu, Coffee } from 'lucide-react';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, quizRes] = await Promise.all([
                    axiosInstance.get('/website/categories'),
                    axiosInstance.get('/website/quizzes')
                ]);
                if (catRes.data.status) setCategories(catRes.data.data);
                if (quizRes.data.status) setQuizzes(quizRes.data.data);
            } catch (err) {
                console.error("Failed to fetch homepage data:", err);
                // Fallback mock data if API server isn't running yet
                setCategories([
                    { _id: '1', categoryName: 'Web Development', categoryDescription: 'HTML, CSS, JavaScript & React', categoryIcon: 'code' },
                    { _id: '2', categoryName: 'Python Programming', categoryDescription: 'Python syntax, Data structures & OOP', categoryIcon: 'terminal' },
                    { _id: '3', categoryName: 'Java & OOPs', categoryDescription: 'Core Java, Classes, Inheritance & Threads', categoryIcon: 'coffee' },
                    { _id: '4', categoryName: 'Computer Science Core', categoryDescription: 'DBMS, Operating Systems & Networks', categoryIcon: 'cpu' }
                ]);
                setQuizzes([
                    { _id: 'q1', quizTitle: 'JavaScript & React Fundamentals', category: { categoryName: 'Web Development' }, difficulty: 'Medium', durationMinutes: 10, totalQuestions: 5 },
                    { _id: 'q2', quizTitle: 'Python Essentials & Data Types', category: { categoryName: 'Python Programming' }, difficulty: 'Easy', durationMinutes: 8, totalQuestions: 3 }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'terminal': return <Terminal className="w-6 h-6 text-cyan-400" />;
            case 'coffee': return <Coffee className="w-6 h-6 text-amber-400" />;
            case 'cpu': return <Cpu className="w-6 h-6 text-purple-400" />;
            default: return <Code className="w-6 h-6 text-blue-400" />;
        }
    };

    return (
        <div className="space-y-16 py-4">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden rounded-3xl p-8 md:p-14 glass-panel border border-cyan-500/30 bg-gradient-to-r from-[#0B132B]/90 via-[#1C2541]/80 to-[#0B132B]/90 shadow-2xl shadow-cyan-950/50">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide">
                            <Zap className="w-4 h-4 fill-cyan-400" /> Smart Online Quiz Platform
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white font-outfit">
                            Master Coding Skills with <span className="gradient-text">QuizMaster</span>
                        </h1>

                        <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
                            Challenge yourself with interactive quizzes, real-time timer countdowns, category filtering, instant automated scorecards, and performance analytics.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link href="/quizzes" className="btn-primary text-base py-3 px-8">
                                <Play className="w-5 h-5 fill-current" /> Start Quiz Now
                            </Link>
                        </div>

                        <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center md:text-left">
                            <div>
                                <h3 className="text-2xl font-bold text-cyan-400 font-outfit">100+</h3>
                                <p className="text-xs text-slate-400">Curated Questions</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-indigo-400 font-outfit">Real-Time</h3>
                                <p className="text-xs text-slate-400">Live Timer Engine</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-emerald-400 font-outfit">Instant</h3>
                                <p className="text-xs text-slate-400">Detailed Scorecard</p>
                            </div>
                        </div>
                    </div>

                    {/* HERO PREVIEW CARD */}
                    <div className="lg:col-span-5">
                        <div className="glass-panel p-6 rounded-2xl border border-white/15 bg-slate-900/90 shadow-2xl relative">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" /> Live Demo Question
                                </span>
                                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                                    09:45
                                </span>
                            </div>

                            <h4 className="text-base font-semibold text-white mb-4">
                                Which language is used for web development interactivity?
                            </h4>

                            <div className="space-y-2.5 mb-6">
                                <div className="p-3 rounded-xl border border-white/10 bg-slate-800/50 text-slate-300 text-sm flex items-center justify-between">
                                    <span>A. Python</span>
                                </div>
                                <div className="p-3 rounded-xl border border-emerald-500/50 bg-emerald-500/20 text-emerald-300 text-sm font-semibold flex items-center justify-between">
                                    <span>B. JavaScript</span>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div className="p-3 rounded-xl border border-white/10 bg-slate-800/50 text-slate-300 text-sm">
                                    <span>C. Java</span>
                                </div>
                            </div>

                            <div className="bg-slate-950 p-3.5 rounded-xl border border-white/10 text-xs text-slate-400 flex items-center justify-between">
                                <span>Categories • Timer • Instant Results</span>
                                <span className="text-cyan-400 font-semibold">100% Dynamic</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED CATEGORIES */}
            <section className="space-y-6">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white font-outfit">Explore Quiz Categories</h2>
                        <p className="text-slate-400 text-sm">Select your favorite technology topic and test your knowledge.</p>
                    </div>
                    <Link href="/quizzes" className="text-cyan-400 text-sm font-semibold hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <Link href={`/quizzes?category=${cat._id}`} key={cat._id} className="glass-card p-6 block text-decoration-none group">
                            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-cyan-400 transition-all">
                                {getIcon(cat.categoryIcon)}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 font-outfit group-hover:text-cyan-400 transition-colors">
                                {cat.categoryName}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                {cat.categoryDescription || 'Test your proficiency with curated multiple choice questions.'}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* POPULAR QUIZZES */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white font-outfit">Popular Quizzes</h2>
                    <p className="text-slate-400 text-sm">Pick a quiz, beat the timer, and claim your scorecard.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizzes.map((q) => (
                        <div key={q._id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                                        {q.category?.categoryName || 'General'}
                                    </span>
                                    <span className={`badge badge-${q.difficulty?.toLowerCase() || 'medium'}`}>
                                        {q.difficulty || 'Medium'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white font-outfit">{q.quizTitle}</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    {q.description || 'Test your knowledge with single choice MCQ questions and live timer countdown.'}
                                </p>
                            </div>

                            <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-400" /> {q.durationMinutes} Mins</span>
                                    <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-indigo-400" /> {q.totalQuestions || 5} Questions</span>
                                </div>
                                <Link href={`/quiz/${q._id}`} className="btn-primary text-xs py-2 px-4">
                                    Start Quiz <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
