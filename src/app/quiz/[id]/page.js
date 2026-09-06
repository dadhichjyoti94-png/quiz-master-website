'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { Clock, AlertTriangle, CheckCircle, Bookmark, ArrowLeft, ArrowRight, Send, Languages } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';

export default function QuizPlayer() {
    const { id } = useParams();
    const router = useRouter();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { questionId: 'A' }
    const [markedForReview, setMarkedForReview] = useState({}); // { questionId: true }
    const [timeLeftSeconds, setTimeLeftSeconds] = useState(600); // 10 mins
    const [submitting, setSubmitting] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('hindi');

    useEffect(() => {
        const fetchQuizAndQuestions = async () => {
            try {
                const res = await axiosInstance.get(`/website/quiz/${id}`);
                if (res.data.status) {
                    setQuiz(res.data.data.quiz);
                    setQuestions(res.data.data.questions);
                    if (res.data.data.quiz.durationMinutes) {
                        setTimeLeftSeconds(res.data.data.quiz.durationMinutes * 60);
                    }
                }
            } catch (err) {
                console.error("Error loading quiz:", err);
                toast.error("Failed to load quiz questions.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuizAndQuestions();
    }, [id]);

    // COUNTDOWN TIMER
    useEffect(() => {
        if (!quiz || submitting) return;
        const timer = setInterval(() => {
            setTimeLeftSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    toast.warning("Time expired! Submitting your quiz automatically.");
                    handleSubmitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quiz, submitting]);

    const formatTime = (totalSec) => {
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (questionId, optionLetter) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: optionLetter
        }));
    };

    const toggleMarkReview = (questionId) => {
        setMarkedForReview(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    const handleSubmitQuiz = async () => {
        setSubmitting(true);
        try {
            const formattedAnswers = questions.map(q => ({
                questionId: q._id,
                selectedOption: userAnswers[q._id] || null
            }));

            const storedUser = localStorage.getItem('qm_user');
            const userObj = storedUser ? JSON.parse(storedUser) : null;
            const userId = userObj?._id || userObj?.id;
            if (!userId) {
                toast.error('Please sign in before submitting a quiz.');
                router.push('/login');
                return;
            }

            const totalDuration = (quiz?.durationMinutes || 10) * 60;
            const timeTakenSeconds = Math.max(0, totalDuration - timeLeftSeconds);

            const res = await axiosInstance.post('/website/attempt/submit', {
                userId,
                quizId: id,
                userAnswers: formattedAnswers,
                timeTakenSeconds
            });

            if (res.data.status) {
                toast.success("Quiz submitted successfully!");
                // Store result in sessionStorage for quick result view
                sessionStorage.setItem(`attempt_${res.data.data.attemptId}`, JSON.stringify(res.data.data));
                router.push(`/quiz/${id}/result?attemptId=${res.data.data.attemptId}`);
            } else {
                toast.error(res.data.message || "Failed to submit quiz.");
                setSubmitting(false);
            }
        } catch (err) {
            console.error("Submission error:", err);
            toast.error("Error submitting quiz. Please check internet connection.");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AuthGuard><div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-sm font-medium">Loading quiz environment...</p>
            </div></AuthGuard>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <AuthGuard><div className="glass-panel p-12 text-center text-slate-300 max-w-xl mx-auto rounded-2xl space-y-4">
                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
                <h2 className="text-xl font-bold text-white">No Questions Available</h2>
                <p className="text-xs text-slate-400">This quiz doesn't have any questions configured yet.</p>
                <button onClick={() => router.push('/quizzes')} className="btn-primary text-xs py-2 px-4">
                    Back to Quizzes
                </button>
            </div></AuthGuard>
        );
    }

    const currentQuestion = questions[currentIndex];
    const isAnswered = !!userAnswers[currentQuestion._id];
    const isMarked = !!markedForReview[currentQuestion._id];
    const displayQuestion = language === 'english' && currentQuestion.englishQuestionText
        ? currentQuestion.englishQuestionText
        : currentQuestion.questionText;
    const displayOptions = language === 'english' && currentQuestion.englishOptions?.length
        ? currentQuestion.englishOptions
        : currentQuestion.options;

    return (
        <AuthGuard><div className="space-y-6 py-2">
            {/* TOP TIMER BAR */}
            <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border-cyan-500/30">
                <div>
                    <h2 className="text-lg font-bold text-white font-outfit">{quiz?.quizTitle}</h2>
                    <span className="text-xs text-cyan-400 font-semibold">{quiz?.category?.categoryName}</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center rounded-lg border border-slate-700 bg-slate-900 p-1 text-xs">
                        <Languages className="w-3.5 h-3.5 mx-2 text-cyan-400" />
                        <button onClick={() => setLanguage('hindi')} className={`rounded px-2 py-1.5 ${language === 'hindi' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'}`}>Hindi</button>
                        <button onClick={() => setLanguage('english')} className={`rounded px-2 py-1.5 ${language === 'english' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'}`}>English</button>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-xl">
                        <Clock className={`w-4 h-4 ${timeLeftSeconds < 120 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
                        <span className={`text-base font-mono font-bold ${timeLeftSeconds < 120 ? 'text-rose-400' : 'text-cyan-300'}`}>
                            {formatTime(timeLeftSeconds)}
                        </span>
                    </div>

                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="btn-primary text-xs py-2.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/30"
                    >
                        <Send className="w-3.5 h-3.5" /> Submit Quiz
                    </button>
                </div>
            </div>

            {/* MAIN QUIZ GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* QUESTION DISPLAY PANEL */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-panel p-6 md:p-8 rounded-2xl relative">
                        {/* Question Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Question {currentIndex + 1} of {questions.length}
                            </span>

                            <button
                                onClick={() => toggleMarkReview(currentQuestion._id)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${isMarked
                                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                                    }`}
                            >
                                <Bookmark className="w-3.5 h-3.5" /> {isMarked ? 'Marked for Review' : 'Mark for Review'}
                            </button>
                        </div>

                        <div className="sm:hidden flex justify-end -mt-3 mb-4">
                            <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 p-1 text-xs">
                                <button onClick={() => setLanguage('hindi')} className={`rounded px-2 py-1.5 ${language === 'hindi' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'}`}>Hindi</button>
                                <button onClick={() => setLanguage('english')} className={`rounded px-2 py-1.5 ${language === 'english' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'}`}>English</button>
                            </div>
                        </div>

                        {/* Question Text */}
                        <h3 className="text-lg md:text-xl font-bold text-white mb-6 leading-snug">
                            {displayQuestion}
                        </h3>

                        {/* MCQ Options List */}
                        <div className="space-y-3.5 mb-8">
                            {displayOptions?.map((opt) => {
                                const selected = userAnswers[currentQuestion._id] === opt.optionLetter;
                                return (
                                    <button
                                        key={opt.optionLetter}
                                        onClick={() => handleSelectOption(currentQuestion._id, opt.optionLetter)}
                                        className={`option-btn ${selected ? 'selected' : ''}`}
                                    >
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${selected ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300'
                                            }`}>
                                            {opt.optionLetter}
                                        </span>
                                        <span className="text-sm font-medium">{opt.optionText}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Navigation Footer Buttons */}
                        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                            <button
                                disabled={currentIndex === 0}
                                onClick={() => setCurrentIndex(prev => prev - 1)}
                                className="btn-secondary text-xs py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft className="w-4 h-4" /> Previous
                            </button>

                            <button
                                disabled={currentIndex === questions.length - 1}
                                onClick={() => setCurrentIndex(prev => prev + 1)}
                                className="btn-primary text-xs py-2 px-5"
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* QUESTION NAVIGATOR GRID PANEL */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl space-y-6">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
                            Question Navigator
                        </h4>

                        {/* Question Jump Buttons */}
                        <div className="grid grid-cols-5 gap-2.5">
                            {questions.map((q, idx) => {
                                const ans = !!userAnswers[q._id];
                                const mark = !!markedForReview[q._id];
                                const isCurrent = idx === currentIndex;

                                let btnStyle = 'bg-slate-800 border-slate-700 text-slate-300';
                                if (isCurrent) btnStyle = 'border-2 border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold scale-105';
                                else if (mark) btnStyle = 'bg-purple-500/30 border-purple-500 text-purple-200';
                                else if (ans) btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold';

                                return (
                                    <button
                                        key={q._id}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`h-10 rounded-xl border text-xs flex items-center justify-center transition-all ${btnStyle}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Answered
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-purple-500"></span> Marked for Review
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></span> Unanswered
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2 text-xs">
                            <div className="flex justify-between text-slate-300">
                                <span>Answered:</span>
                                <span className="font-bold text-emerald-400">{Object.keys(userAnswers).length} / {questions.length}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                                <span>Marked for Review:</span>
                                <span className="font-bold text-purple-400">{Object.values(markedForReview).filter(Boolean).length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONFIRM SUBMIT MODAL */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="glass-panel p-6 md:p-8 max-w-md w-full rounded-2xl space-y-6 border-cyan-500/40 animate-in fade-in zoom-in duration-200">
                        <div className="text-center space-y-2">
                            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                            <h3 className="text-xl font-bold text-white">Ready to Submit Quiz?</h3>
                            <p className="text-xs text-slate-300">
                                You have answered <strong className="text-emerald-400">{Object.keys(userAnswers).length}</strong> out of <strong className="text-cyan-400">{questions.length}</strong> questions.
                            </p>
                        </div>

                        <div className="bg-slate-900 p-4 rounded-xl text-xs space-y-1.5 text-slate-400">
                            <p>• Make sure you have reviewed all marked questions.</p>
                            <p>• Results will be evaluated instantly.</p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="btn-secondary w-1/2 text-xs py-2.5 justify-center"
                            >
                                Continue Test
                            </button>
                            <button
                                disabled={submitting}
                                onClick={handleSubmitQuiz}
                                className="btn-primary w-1/2 text-xs py-2.5 justify-center bg-gradient-to-r from-emerald-500 to-teal-600"
                            >
                                {submitting ? 'Evaluating...' : 'Confirm Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div></AuthGuard>
    );
}
