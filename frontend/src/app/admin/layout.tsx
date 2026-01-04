"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import {
    LayoutDashboard,
    Package,
    Users,
    Store,
    LogOut,
    Activity,
    ShieldCheck,
    ChevronRight,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest animate-pulse">Initializing Admin Console</p>
            </div>
        );
    }

    if (!isAuthenticated || !user?.roles?.includes('ROLE_ADMIN')) {
        return null;
    }

    const menuItems = [
        { id: 'dashboard', label: '대시보드', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'sellers', label: '판매자 신청 관리', href: '/admin/seller-applications', icon: <Store className="w-5 h-5" /> },
        { id: 'products', label: '전체 상품 관리', href: '/admin/products', icon: <Package className="w-5 h-5" /> },
    ];

    return (
        <div className="flex min-h-screen bg-[#0A0A0B] text-foreground selection:bg-primary/30">
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 bg-[#0f0f12] hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <Link href="/" className="group flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                            <ShieldCheck className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white">
                            DIBS<span className="text-primary">!</span> Admin
                        </h1>
                    </Link>
                </div>

                <div className="px-6 py-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        />
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 px-4">Management</p>
                    {menuItems.map((item) => (
                        <Link key={item.id} href={item.href} className="group block">
                            <div className={cn(
                                "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300",
                                item.id === 'dashboard' ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" : "hover:bg-white/5 text-white/60 hover:text-white"
                            )}>
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="text-sm font-bold">{item.label}</span>
                                </div>
                                <ChevronRight className={cn("w-4 h-4 transition-transform", item.id === 'dashboard' ? "opacity-40" : "opacity-0 group-hover:opacity-40 group-hover:translate-x-1")} />
                            </div>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 mt-auto border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5">
                            <div className="w-full h-full bg-[#0f0f12] rounded-[0.85rem] flex items-center justify-center font-black text-primary italic">
                                {user?.nickname?.[0].toUpperCase() || 'A'}
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-black truncate">{user?.nickname || 'Administrator'}</p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Global Admin</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => { logout(); router.push('/login'); }}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl border border-white/10 text-sm font-black text-white/60 hover:text-red-400 hover:bg-red-400/5 hover:border-red-400/30 transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        로그아웃
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
