"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Store, LayoutDashboard, Package, ShoppingCart, LogOut, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isLoading, isHydrated, checkAuth } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isHydrated) {
            checkAuth();
        }
    }, [checkAuth, isHydrated]);

    useEffect(() => {
        // 하이드레이션과 초기 권한 체크가 모두 끝난 후 실행
        if (isHydrated && !isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (!user?.roles?.includes('ROLE_SELLER')) {
                router.push('/');
            }
        }
    }, [isAuthenticated, user, isLoading, isHydrated, router]);

    // 하이드레이션 전에는 아무것도 안 보여줌 (깜빡임 방지 핵심)
    if (!isHydrated) {
        return null;
    }

    if (isLoading && !isAuthenticated) {
        return <div className="flex items-center justify-center h-screen bg-slate-950 text-white font-black">DIBS! SELLER LOADING...</div>;
    }

    if (!isAuthenticated || !user?.roles?.includes('ROLE_SELLER')) {
        return null;
    }

    const menuItems = [
        { name: '대시보드', href: '/seller', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: '상품 관리', href: '/seller/products', icon: <Package className="w-5 h-5" /> },
        { name: '주문 관리', href: '/seller/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    ];

    return (
        <div className="flex min-h-screen bg-[#0a0a0b] text-white">
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 bg-[#0e0e10] flex flex-col">
                <div className="p-8 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white">Seller Center</h1>
                    </Link>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <p className="px-4 py-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Management</p>
                    {menuItems.map((item) => (
                        <Link key={item.name} href={item.href}>
                            <button className={cn(
                                "w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all group",
                                pathname === item.href
                                    ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/10"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}>
                                <span className={cn(
                                    "transition-colors",
                                    pathname === item.href ? "text-white" : "group-hover:text-indigo-400"
                                )}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </button>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5 space-y-4">
                    <Link href="/store">
                        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                            스토어로 돌아가기
                        </button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/[0.03] via-transparent to-transparent">
                <div className="p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
