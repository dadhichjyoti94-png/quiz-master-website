'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import Link from 'next/link';
import { Trophy, CheckCircle, XCircle, RotateCcw, LayoutDashboard, Award, Clock, ArrowRight, HelpCircle } from 'lucide-react';

export default function QuizResult() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const attemptId = searchParams.get('attemptId');
    const router = useRouter();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            // First check sessionStorage for instant offline/cached result
            if (attemptId) {
                const cached = sessionStorage.getItem(`attempt_${attemptId}`);
                if (cached) {
                    try {
                        setResult(JSON.parse(cached));
                        setLoading(false);
                        return;
                    } catch (e) { console.error(e); }
                }
            }

            try {
                if (attemptId) {
                    const res = await axiosInstance.get(`/website/attempt/details/${attemptId}`);
                    if (res.data.status) {
                        setResult(res.data.data);
                    }
                }
            } catch (err) {
                console.error("Error fetching attempt result:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [attemptId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-sm font-medium">Evaluating your performance...</p>
            </div>
        );
    }

    const passed = result?.passed ?? (result?.score >= 60);

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-4">
            {/* SCORE HERO BANNER */}
            <div className={`glass-panel p-8 md:p-12 rounded-3xl text-center relative overflow-hidden border ${passed ? 'border-emerald-500/50 shadow-emerald-950/40' : 'border-rose-500/50 shadow-rose-950/40'
                } shadow-2xl`}>
                <div className="max-w-md mx-auto space-y-6 relative z-10">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-xl">
                        {passed ? (
                            <Trophy className="w-10 h-10 text-amber-400 glow-animation" />
                        ) : (
                            <XCircle className="w-10 h-10 text-rose-400" />
                        )}
                    </div>

                    <div>
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-3 ${passed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}>
                            {passed ? '🎉 Passed Quiz' : 'Needs Improvement'}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white font-outfit">
                            {result?.quizTitle || result?.quiz?.quizTitle || 'Quiz Performance Report'}
                        </h1>
                    </div>

                    {/* SCORE PERCENTAGE DISPLAY */}
                    <div className="py-4">
                        <div className="text-6xl md:text-7xl font-extrabold font-outfit text-white">
                            {result?.score ?? 0}<span className="text-cyan-400 text-4xl">%</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            Pass Mark Required: {result?.passPercentage || 60}%
                        </p>
                    </div>

                    {/* STATS METRICS GRID */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center">
                        <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                            <span className="block text-lg font-bold text-emerald-400">{result?.correctAnswersCount ?? 0} / {result?.totalQuestions ?? 0}</span>
                            <span className="text-[10px] text-slate-400">Correct Answers</span>
                        </div>

                        <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                            <span className="block text-lg font-bold text-cyan-400">{result?.totalMarksObtained ?? 0} / {result?.maxMarks ?? 0}</span>
                            <span className="text-[10px] text-slate-400">Total Marks</span>
                        </div>

                        <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                            <span className="block text-lg font-bold text-purple-400">{Math.round((result?.timeTakenSeconds || 0) / 60)} mins</span>
                            <span className="text-[10px] text-slate-400">Time Taken</span>
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <Link href={`/quiz/${id}`} className="btn-primary text-xs py-2.5 px-6">
                            <RotateCcw className="w-4 h-4" /> Retake Quiz
                        </Link>
                        <Link href="/dashboard" className="btn-secondary text-xs py-2.5 px-6">
                            <LayoutDashboard className="w-4 h-4" /> View My Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            {/* DETAILED QUESTION SOLUTION REVIEW */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-cyan-400" /> Question & Answer Breakdown
                </h3>

                <div className="space-y-4">
                    {result?.evaluatedAnswers?.map((ans, idx) => (
                        <div key={idx} className={`glass-panel p-6 rounded-2xl border ${ans.isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'
                            }`}>
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <h4 className="text-base font-bold text-white leading-snug">
                                    Q{idx + 1}. {ans.questionText}
                                </h4>
                                <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${ans.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                    }`}>
                                    {ans.isCorrect ? (
                                        <><CheckCircle className="w-3.5 h-3.5" /> Correct (+{ans.marksObtained})</>
                                    ) : (
                                        <><XCircle className="w-3.5 h-3.5" /> Incorrect (0)</>
                                    )}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <div className={`p-3 rounded-xl border text-xs font-medium ${ans.selectedOption === ans.correctOption
                                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                                        : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                                    }`}>
                                    Your Answer: <strong className="font-bold">{ans.selectedOption || 'Not Answered'}</strong>
                                </div>

                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
                                    Correct Key: <strong className="font-bold">{ans.correctOption}</strong>
                                </div>
                            </div>

                            {ans.explanation && (
                                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-white/10 text-xs text-slate-300 leading-relaxed">
                                    <strong className="text-cyan-400">Explanation:</strong> {ans.explanation}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
