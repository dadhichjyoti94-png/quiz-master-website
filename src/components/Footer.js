import Link from 'next/link';
import { Trophy, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-white/10 bg-[#04070D] text-slate-400 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
                            <Trophy className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-xl font-bold text-white font-outfit">QuizMaster</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-400">
                        Smart Online Quiz Platform for technical assessments, skill tracking, and competitive learning.
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-xs">
                        <li><Link href="/" className="hover:text-cyan-400 transition-colors text-decoration-none">Home</Link></li>
                        <li><Link href="/quizzes" className="hover:text-cyan-400 transition-colors text-decoration-none">Explore Quizzes</Link></li>
                        <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors text-decoration-none">User Performance Dashboard</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Categories</h4>
                    <ul className="space-y-2 text-xs">
                        <li><span className="text-slate-400">Web Development</span></li>
                        <li><span className="text-slate-400">Python Programming</span></li>
                        <li><span className="text-slate-400">Java & OOPs</span></li>
                        <li><span className="text-slate-400">Data Structures & CS Core</span></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Admin & Security</h4>
                    <p className="text-xs text-slate-400 mb-3">Role-Based Access with JWT Authentication and full dynamic REST API integration.</p>
                    <Link href="/admin" className="inline-block text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg hover:bg-indigo-500/30 transition-colors text-decoration-none">
                        Access Admin Panel →
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                <p>© 2026 QuizMaster Capstone Project. All rights reserved.</p>
                <p className="flex items-center gap-1">
                    Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Web Developers
                </p>
            </div>
        </footer>
    );
}
