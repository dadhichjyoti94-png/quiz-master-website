'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Trophy, Compass, LayoutDashboard, Shield, LogIn, LogOut, User, ChevronDown, UserPlus } from 'lucide-react';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('qm_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    useEffect(() => {
        const closeMenu = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', closeMenu);
        return () => document.removeEventListener('mousedown', closeMenu);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('qm_token');
        localStorage.removeItem('qm_user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#070B14]/80 border-b border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group text-decoration-none">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
                        <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="text-2xl font-extrabold tracking-tight text-white font-outfit">
                            Quiz<span className="text-cyan-400">Master</span>
                        </span>
                        <span className="block text-[10px] text-cyan-300/70 font-semibold tracking-wider uppercase -mt-1">
                            Smart Quiz Platform
                        </span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link href="/" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2 text-decoration-none">
                        Home
                    </Link>
                    {user && <>
                        {user.role !== 'admin' && <>
                            <Link href="/quizzes" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2 text-decoration-none">
                                <Compass className="w-4 h-4" /> Quizzes
                            </Link>
                            <Link href="/dashboard" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2 text-decoration-none">
                                <LayoutDashboard className="w-4 h-4" /> My Scores
                            </Link>
                        </>}
                        {user.role === 'admin' && <Link href="/admin" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-2 text-decoration-none bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/30">
                            <Shield className="w-4 h-4 text-indigo-400" /> Admin Panel
                        </Link>}
                    </>}
                </nav>

                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-expanded={menuOpen}
                        aria-haspopup="menu"
                        className="btn-primary text-sm py-2 px-4"
                    >
                        <User className="w-4 h-4" /> {user?.name || 'Account'}
                        <ChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {menuOpen && (
                        <div role="menu" className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40 z-50">
                            {user ? (
                                <>
                                    <div className="px-4 py-3 border-b border-white/10">
                                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        href={user.role === 'admin' ? '/admin' : '/dashboard'}
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-3 text-xs text-slate-200 hover:bg-slate-800"
                                    >
                                        <User className="w-4 h-4 text-cyan-400" /> My Account
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-left text-xs text-rose-300 hover:bg-rose-500/10 border-t border-white/10">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-xs text-slate-200 hover:bg-slate-800">
                                        <LogIn className="w-4 h-4 text-cyan-400" /> Login
                                    </Link>
                                    <Link href="/login?mode=register" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-xs text-slate-200 hover:bg-slate-800 border-t border-white/10">
                                        <UserPlus className="w-4 h-4 text-cyan-400" /> Register
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
