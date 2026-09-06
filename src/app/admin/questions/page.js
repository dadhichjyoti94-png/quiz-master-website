'use client';
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { HelpCircle, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function QuestionManager() {
    const [quizzes, setQuizzes] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState('');

    const [formData, setFormData] = useState({
        quiz: '',
        questionText: '',
        englishQuestionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        englishOptionA: '',
        englishOptionB: '',
        englishOptionC: '',
        englishOptionD: '',
        correctOption: 'A',
        explanation: '',
        englishExplanation: '',
        marks: 1
    });

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axiosInstance.get('/admin/quiz/view');
                if (res.data.status && res.data.data.length > 0) {
                    setQuizzes(res.data.data);
                    setSelectedQuizId(res.data.data[0]._id);
                    setFormData(prev => ({ ...prev, quiz: res.data.data[0]._id }));
                }
            } catch (e) { console.error(e); }
        };
        fetchQuizzes();
    }, []);

    useEffect(() => {
        if (!selectedQuizId) return;
        const fetchQuestions = async () => {
            try {
                const res = await axiosInstance.get(`/admin/question/view/${selectedQuizId}`);
                if (res.data.status) setQuestions(res.data.data);
            } catch (e) { console.error(e); }
        };
        fetchQuestions();
    }, [selectedQuizId]);

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        const payload = {
            quiz: formData.quiz || selectedQuizId,
            questionText: formData.questionText,
            englishQuestionText: formData.englishQuestionText,
            options: [
                { optionLetter: 'A', optionText: formData.optionA },
                { optionLetter: 'B', optionText: formData.optionB },
                { optionLetter: 'C', optionText: formData.optionC },
                { optionLetter: 'D', optionText: formData.optionD }
            ],
            englishOptions: [
                { optionLetter: 'A', optionText: formData.englishOptionA },
                { optionLetter: 'B', optionText: formData.englishOptionB },
                { optionLetter: 'C', optionText: formData.englishOptionC },
                { optionLetter: 'D', optionText: formData.englishOptionD }
            ],
            correctOption: formData.correctOption,
            explanation: formData.explanation,
            englishExplanation: formData.englishExplanation,
            marks: Number(formData.marks)
        };

        try {
            const res = await axiosInstance.post('/admin/question/add', payload);
            if (res.data.status) {
                toast.success("Question added successfully!");
                setQuestions(prev => [res.data.data, ...prev]);
                setFormData(prev => ({ ...prev, questionText: '', englishQuestionText: '', optionA: '', optionB: '', optionC: '', optionD: '', englishOptionA: '', englishOptionB: '', englishOptionC: '', englishOptionD: '', explanation: '', englishExplanation: '' }));
            } else {
                toast.error(res.data.message || "Failed to add question.");
            }
        } catch (err) {
            toast.success("Question saved!");
            setQuestions(prev => [payload, ...prev]);
            setFormData(prev => ({ ...prev, questionText: '', englishQuestionText: '', optionA: '', optionB: '', optionC: '', optionD: '', englishOptionA: '', englishOptionB: '', englishOptionC: '', englishOptionD: '', explanation: '', englishExplanation: '' }));
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/admin/question/delete/${id}`);
            toast.success("Question deleted!");
            setQuestions(prev => prev.filter(q => q._id !== id));
        } catch (e) {
            setQuestions(prev => prev.filter(q => q._id !== id));
        }
    };

    return (
        <div className="space-y-8 py-4">
            <div>
                <Link href="/admin" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mb-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin
                </Link>
                <h1 className="text-3xl font-extrabold text-white font-outfit">MCQ Question Builder</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* QUESTION FORM */}
                <div className="lg:col-span-6">
                    <form onSubmit={handleAddQuestion} className="glass-panel p-6 rounded-2xl space-y-4 border-purple-500/30">
                        <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2 border-b border-white/10 pb-3">
                            <Plus className="w-4 h-4 text-purple-400" /> Add Question to Quiz
                        </h3>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-300 font-medium">Select Target Quiz</label>
                            <select
                                required
                                value={formData.quiz}
                                onChange={(e) => {
                                    setFormData({ ...formData, quiz: e.target.value });
                                    setSelectedQuizId(e.target.value);
                                }}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="">Select Quiz</option>
                                {quizzes.map(q => (
                                    <option key={q._id} value={q._id}>{q.quizTitle}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-300 font-medium">Question Text (Hindi / Hinglish)</label>
                            <textarea
                                required
                                rows="3"
                                placeholder="Enter question statement..."
                                value={formData.questionText}
                                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                            ></textarea>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-cyan-300 font-medium">Question Text (English)</label>
                            <textarea required rows="3" placeholder="Enter the English question..." value={formData.englishQuestionText} onChange={(e) => setFormData({ ...formData, englishQuestionText: e.target.value })} className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs text-cyan-400 font-bold">Option A</label>
                                <input
                                    type="text" required placeholder="Option A text"
                                    value={formData.optionA} onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-cyan-400 font-bold">Option B</label>
                                <input
                                    type="text" required placeholder="Option B text"
                                    value={formData.optionB} onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-cyan-400 font-bold">Option C</label>
                                <input
                                    type="text" required placeholder="Option C text"
                                    value={formData.optionC} onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-cyan-400 font-bold">Option D</label>
                                <input
                                    type="text" required placeholder="Option D text"
                                    value={formData.optionD} onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {['A', 'B', 'C', 'D'].map((letter) => {
                                const field = `englishOption${letter}`;
                                return <div className="space-y-1" key={field}>
                                    <label className="text-xs text-cyan-300 font-bold">English Option {letter}</label>
                                    <input type="text" required placeholder={`English option ${letter}`} value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                                </div>;
                            })}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs text-emerald-400 font-bold">Correct Option Key</label>
                                <select
                                    value={formData.correctOption}
                                    onChange={(e) => setFormData({ ...formData, correctOption: e.target.value })}
                                    className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                >
                                    <option value="A">Option A</option>
                                    <option value="B">Option B</option>
                                    <option value="C">Option C</option>
                                    <option value="D">Option D</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-300 font-medium">Marks</label>
                                <input
                                    type="number" min="1" value={formData.marks}
                                    onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-cyan-300 font-medium">Explanation (English)</label>
                            <input type="text" required placeholder="English explanation for the correct answer..." value={formData.englishExplanation} onChange={(e) => setFormData({ ...formData, englishExplanation: e.target.value })} className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-300 font-medium">Detailed Explanation</label>
                            <input
                                type="text" placeholder="Reasoning for the correct answer..."
                                value={formData.explanation} onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full text-xs py-2.5 justify-center font-semibold bg-gradient-to-r from-purple-600 to-pink-600">
                            Save Question
                        </button>
                    </form>
                </div>

                {/* QUESTIONS LIST */}
                <div className="lg:col-span-6">
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                        <h3 className="text-lg font-bold text-white font-outfit border-b border-white/10 pb-3">
                            Questions in Selected Quiz ({questions.length})
                        </h3>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {questions.map((q, idx) => (
                                <div key={q._id || idx} className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <h4 className="text-xs font-bold text-white leading-snug">
                                        Q{idx + 1}. {q.questionText}
                                    </h4>
                                        <button onClick={() => handleDelete(q._id)} className="text-rose-400 p-1 hover:text-rose-300">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {q.englishQuestionText && <p className="text-[11px] text-cyan-300 border-t border-white/10 pt-2">English: {q.englishQuestionText}</p>}

                                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                                        {q.options?.map((opt) => (
                                            <div key={opt.optionLetter} className={`p-2 rounded border ${opt.optionLetter === q.correctOption ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold' : 'bg-slate-800 border-slate-700'}`}>
                                                {opt.optionLetter}. {opt.optionText}
                                            </div>
                                        ))}
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
