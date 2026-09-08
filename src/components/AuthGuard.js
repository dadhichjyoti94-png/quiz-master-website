'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/** Protects client-side pages until a signed-in user is available. */
export default function AuthGuard({ children, adminOnly = false }) {
    const router = useRouter();
    const pathname = usePathname();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        // A route or role change must be checked again before its content renders.
        setAllowed(false);
        const token = localStorage.getItem('qm_token');
        const storedUser = localStorage.getItem('qm_user');
        let user = null;

        try {
            user = storedUser ? JSON.parse(storedUser) : null;
        } catch {
            localStorage.removeItem('qm_user');
        }

        if (!token || !user) {
            router.replace(`/login?next=${encodeURIComponent(pathname)}`);
            return;
        }

        if (adminOnly && user.role !== 'admin') {
            router.replace('/dashboard');
            return;
        }

        setAllowed(true);
    }, [adminOnly, pathname, router]);

    if (!allowed) {
        return <div className="py-24 text-center text-sm text-slate-400">Checking your account…</div>;
    }

    return children;
}
