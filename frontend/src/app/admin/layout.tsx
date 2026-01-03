"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user?.roles?.includes('ROLE_ADMIN'))) {
            if (isAuthenticated && !user?.roles?.includes('ROLE_ADMIN')) {
                router.push('/');
            } else if (!isAuthenticated) {
                router.push('/login');
            }
        }
    }, [isAuthenticated, user, isLoading, router]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!isAuthenticated || !user?.roles?.includes('ROLE_ADMIN')) {
        return null; // Will redirect
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card">
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-bold text-primary">TicketLock Admin</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin/movies" className="block w-full">
                        <button className="w-full text-left px-4 py-2 rounded-md hover:bg-secondary transition-all">
                            영화 관리
                        </button>
                    </Link>
                    <Link href="/admin/products" className="block w-full">
                        <button className="w-full text-left px-4 py-2 rounded-md hover:bg-secondary transition-all">
                            상품 관리
                        </button>
                    </Link>
                    <div className="pt-4 mt-4 border-t border-border">
                        <button className="w-full text-left px-4 py-2 rounded-md text-red-500 hover:text-red-600 hover:bg-red-100/10 transition-all font-bold" onClick={() => { logout(); router.push('/login'); }}>
                            로그아웃
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
