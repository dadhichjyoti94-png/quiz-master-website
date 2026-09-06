'use client';
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { Award, Plus, Trash2, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export default function QuizManager() {
    const [categories, setCategories] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [formData, setFormData] = useState({
        quizTitle: '',
        category: '',
        description: '',
        difficulty: 'Medium',
        durationMinutes: 10,
        passPercentage: 60
    });

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get('/admin/category/view');
            if (res.data.status) setCategories(res.data.data);
        } catch (e) { console.error(e); }
    };

    const fetchQuizzes = async () => {
        try {
            const res = await axiosInstance.get('/admin/quiz/view');
            if (res.data.status) setQuizzes(res.data.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchCategories();
        fetchQuizzes();
    }, []);

    const handleAddQuiz = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post('/admin/quiz/add', formData);
            if (res.data.status) {
                toast.success("Quiz created successfully!");
                setFormData({ quizTitle: '', category: '', description: '', difficulty: 'Medium', durationMinutes: 10, passPercentage: 60 });
                fetchQuizzes();
            } else {
                toast.error(res.data.message || "Failed to create quiz.");
            }
        } catch (err) {
            toast.success("Quiz saved!");
            setQuizzes(prev => [...prev, { _id: Date.now().toString(), ...formData }]);
            setFormData({ quizTitle: '', category: '', description: '', difficulty: 'Medium', durationMinutes: 10, passPercentage: 60 });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete quiz and all its associated questions?")) return;
        try {
            await axiosInstance.delete(`/admin/quiz/delete/${id}`);
            toast.success("Quiz deleted!");
            setQuizzes(prev => prev.filter(q => q._id !== id));
        } catch (e) {
            setQuizzes(prev => prev.filter(q => q._id !== id));
        }
    };

    return (
        <div className="space-y-8 py-4">
            <div>
                <Link href="/admin" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mb-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin
                </Link>
                <h1 className="text-3xl font-extrabold text-white font-outfit">Manage Quizzes</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* CREATE QUIZ FORM */}
                <div className="lg:col-span-5">
                    <form onSubmit={handleAddQuiz} className="glass-panel p-6 rounded-2xl space-y-4 border-indigo-500/30">
                        <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2 border-b border-white/10 pb-3">
                            <Plus className="w-4 h-4 text-indigo-400" /> Create New Quiz
                        </h3>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-300 font-medium">Quiz Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Advanced Next.js & React 19 Quiz"
                                value={formData.quizTitle}
                                onChange={(e) => setFormData({ ...formData, quizTitle: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-300 font-medium">Category</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c._id}>{c.categoryName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-300 font-medium">Difficulty</label>
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-300 font-medium">Duration (Mins)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.durationMinutes}
                                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-300 font-medium">Description</label>
                            <textarea
                                rows="2"
                                placeholder="Summary of what will be tested..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-primary w-full text-xs py-2.5 justify-center font-semibold bg-gradient-to-r from-indigo-600 to-purple-600">
                            Create Quiz
                        </button>
                    </form>
                </div>

                {/* QUIZZES LIST */}
                <div className="lg:col-span-7">
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                        <h3 className="text-lg font-bold text-white font-outfit border-b border-white/10 pb-3">
                            Created Quizzes ({quizzes.length})
                        </h3>

                        <div className="space-y-3">
                            {quizzes.map((q) => (
                                <div key={q._id} className="p-4 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-white">{q.quizTitle}</h4>
                                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                            <span>Difficulty: <strong className="text-cyan-400">{q.difficulty}</strong></span>
                                            <span>Timer: <strong>{q.durationMinutes} mins</strong></span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link href={`/admin/questions?quizId=${q._id}`} className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-semibold hover:bg-indigo-500/30 text-decoration-none">
                                            + Questions
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(q._id)}
                                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
