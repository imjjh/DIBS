"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    User,
    Ticket,
    ShoppingBag,
    LogOut,
    Wallet,
    ChevronRight,
    Package,
    Store,
    Settings,
    Bell,
    CreditCard,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import SellerOnboarding from '@/components/seller/SellerOnboarding';
import { orderService } from '@/services/orderService';

export default function MyPage() {
    const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'ORDERS'>('ORDERS');
    const [mounted, setMounted] = useState(false);

    // Order State
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    useEffect(() => {
        checkAuth();
        setMounted(true);
    }, [checkAuth]);

    useEffect(() => {
        if (isAuthenticated && mounted) {
            fetchOrders();
        }
    }, [isAuthenticated, mounted]);

    const fetchOrders = async () => {
        try {
            setIsLoadingOrders(true);
            const response = await orderService.searchOrders({ page: 0, size: 20 });
            setOrders(response.items);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    if (!mounted) return null;

    if (!isAuthenticated) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                    <User className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-black mb-2 tracking-tight">로그인이 필요합니다</h2>
                <p className="text-muted-foreground mb-8">마이페이지를 확인하려면 로그인을 해주세요.</p>
                <button
                    onClick={() => router.push('/login')}
                    className="px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                >
                    로그인하러 가기
                </button>
            </div>
        );
    }

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Premium Header Profile Section */}
            <div className="relative overflow-hidden bg-secondary/20 border-b border-border pt-20 pb-28">
                {/* Abstract Background Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
                    <Store className="w-80 h-80 rotate-12" />
                </div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                        {/* Avatar Cell */}
                        <div className="relative group">
                            <div className="w-36 h-36 rounded-[3rem] bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-1 shadow-2xl transition-all duration-500 group-hover:rotate-3 group-hover:scale-105">
                                <div className="w-full h-full bg-background rounded-[2.8rem] flex items-center justify-center overflow-hidden">
                                    <span className="text-6xl font-black text-primary">
                                        {(user?.nickname || user?.name || 'U')[0].toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* User Metadata */}
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <h1 className="text-5xl font-black tracking-tighter">{user?.nickname || user?.name || '회원님'}</h1>
                            </div>
                            <p className="text-muted-foreground text-lg font-medium opacity-80">{user?.email}</p>

                            {/* Key Stats Row */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10 max-w-5xl">
                                <div className="bg-background/40 backdrop-blur-md border border-border/80 p-6 rounded-[2.5rem] group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Orders</span>
                                    </div>
                                    <p className="text-3xl font-black">{orders.length}<span className="text-sm ml-1 text-muted-foreground">건</span></p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Activity Section */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-background border border-border rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/5">
                            {/* Tab Navigation */}
                            <div className="flex border-b border-border bg-secondary/5 p-3">
                                <div className="flex-1 flex items-center justify-center gap-3 py-5 text-sm font-black text-primary bg-background rounded-[1.8rem] shadow-lg shadow-primary/5">
                                    <ShoppingBag className="w-4 h-4" />
                                    주문 전체보기
                                </div>
                            </div>

                            {/* View Content */}
                            <div className="p-10">
                                {activeTab === 'ORDERS' && (
                                    <>
                                        {isLoadingOrders ? (
                                            <div className="py-20 text-center animate-pulse">
                                                <div className="w-16 h-16 bg-secondary rounded-full mx-auto mb-4" />
                                                <div className="h-4 bg-secondary w-1/3 mx-auto rounded" />
                                            </div>
                                        ) : orders.length > 0 ? (
                                            <div className="space-y-6">
                                                {orders.map((order) => (
                                                    <div key={order.id} className="group relative bg-card hover:bg-secondary/10 border border-border rounded-[2rem] p-6 transition-all hover:shadow-lg flex flex-col gap-4">
                                                        <div className="flex items-center justify-between border-b border-border pb-4">
                                                            <div>
                                                                <span className="text-xs font-bold text-muted-foreground mb-1 block">
                                                                    {new Date(order.orderedAt).toLocaleDateString()}
                                                                </span>
                                                                <h4 className="text-xl font-black tracking-tight">{order.orderName}</h4>
                                                            </div>
                                                            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                                                                {order.status}
                                                            </div>
                                                        </div>

                                                        {/* Order Items Preview (Representative Style) */}
                                                        <div className="flex gap-4 items-center">
                                                            <div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden shrink-0 border border-border/50">
                                                                {order.representativeImageUrl ? (
                                                                    <img src={order.representativeImageUrl} alt={order.orderName} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                                                                        <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0 py-1">
                                                                <h5 className="font-bold text-lg truncate mb-1">{order.orderName}</h5>
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    {/* Additional info if needed */}
                                                                    주문번호 #{order.id}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
                                                            <div className="text-lg font-black">
                                                                {(order.totalPrice).toLocaleString()}<span className="text-sm font-medium ml-1">원</span>
                                                            </div>
                                                            <Link href={`/orders/${order.id}`} className="px-5 py-2 bg-secondary text-secondary-foreground text-sm font-bold rounded-xl hover:bg-secondary/80">
                                                                상세보기
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-20 text-center bg-secondary/5 rounded-[2.5rem] border border-dashed border-border/50">
                                                <Package className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-20" />
                                                <h3 className="text-2xl font-black mb-2 tracking-tight">주문 내역이 없습니다</h3>
                                                <p className="text-muted-foreground font-medium mb-8">DIBS!에서 첫 번째 아이템을 주문해보세요.</p>
                                                <Link href="/store" className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-lg transition-all active:scale-95">
                                                    스토어 바로가기
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Tools */}
                    <div className="lg:col-span-4 space-y-8">
                        <SellerOnboarding />

                    </div>
                </div>
            </div>
        </div>
    );
}
