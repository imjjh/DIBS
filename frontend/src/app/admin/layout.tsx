"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
import { Header } from '@/components/common/Header';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

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
        { id: 'sellers', label: '판매자 신청 관리', href: '/admin', icon: <Store className="w-5 h-5" /> },
        { id: 'products', label: '전체 상품 관리', href: '/admin/products', icon: <Package className="w-5 h-5" /> },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 selection:bg-primary/10">
            {/* Sidebar */}
            <aside className="w-72 border-r border-slate-200 bg-white hidden lg:flex flex-col h-full shrink-0 z-20">
                <div className="p-8">
                    <Link href="/" className="group flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-slate-900">
                            DIBS<span className="text-primary">!</span> Admin
                        </h1>
                    </Link>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Management</p>
                    {menuItems.map((item) => (
                        <Link key={item.id} href={item.href} className="group block">
                            <div className={cn(
                                "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300",
                                pathname === item.href ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                            )}>
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="text-sm font-bold">{item.label}</span>
                                </div>
                                <ChevronRight className={cn("w-4 h-4 transition-transform", pathname === item.href ? "opacity-40" : "opacity-0 group-hover:opacity-40 group-hover:translate-x-1")} />
                            </div>
                        </Link>
                    ))}
                </nav>

            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Header className="lg:absolute lg:left-0 lg:w-full" />
                <main className="flex-1 overflow-y-auto bg-slate-50">
                    <div className="p-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
