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

export default function MyPage() {
    const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'ORDERS' | 'COUPONS' | 'POINTS'>('ORDERS');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        checkAuth();
        setMounted(true);
    }, [checkAuth]);

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
                                        {(user?.nickName || user?.name || 'U')[0].toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-3 bg-background border border-border rounded-2xl shadow-xl hover:bg-secondary transition-all active:scale-90">
                                <Settings className="w-5 h-5 text-foreground" />
                            </button>
                        </div>

                        {/* User Metadata */}
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <h1 className="text-5xl font-black tracking-tighter">{user?.nickName || user?.name || '회원님'}</h1>
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">
                                        Diamond Member
                                    </span>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-lg font-medium opacity-80">{user?.email}</p>

                            {/* Key Stats Row */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10 max-w-5xl">
                                <div className="bg-background/40 backdrop-blur-md border border-border/80 p-6 rounded-[2.5rem] group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Points</span>
                                    </div>
                                    <p className="text-3xl font-black">{user?.points?.toLocaleString() || 850}<span className="text-sm ml-1 text-muted-foreground">P</span></p>
                                </div>

                                <div className="bg-background/40 backdrop-blur-md border border-border/80 p-6 rounded-[2.5rem] group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <Ticket className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Coupons</span>
                                    </div>
                                    <p className="text-3xl font-black">12<span className="text-sm ml-1 text-muted-foreground">장</span></p>
                                </div>

                                <div className="hidden lg:block bg-background/40 backdrop-blur-md border border-border/80 p-6 rounded-[2.5rem] group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Active Orders</span>
                                    </div>
                                    <p className="text-3xl font-black">2<span className="text-sm ml-1 text-muted-foreground">건</span></p>
                                </div>

                                <div className="hidden lg:block bg-background/40 backdrop-blur-md border border-border/80 p-6 rounded-[2.5rem] group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Alerts</span>
                                    </div>
                                    <p className="text-3xl font-black">4<span className="text-sm ml-1 text-muted-foreground">개</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Top Right Action Cell */}
                        <div className="flex flex-col gap-3 shrink-0">
                            <button
                                onClick={handleLogout}
                                className="px-8 py-4 border border-border rounded-2xl text-sm font-black text-muted-foreground hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/30 transition-all flex items-center justify-center gap-3 group active:scale-95"
                            >
                                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 -mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Activity Section */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-background border border-border rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/5">
                            {/* Tab Navigation */}
                            <div className="flex border-b border-border bg-secondary/5 p-3">
                                {[
                                    { id: 'ORDERS', label: '주문 전체보기', icon: <ShoppingBag className="w-4 h-4" /> },
                                    { id: 'COUPONS', label: '내 쿠폰함', icon: <Ticket className="w-4 h-4" /> },
                                    { id: 'POINTS', label: '포인트 적립 내역', icon: <Wallet className="w-4 h-4" /> },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-3 py-5 text-sm font-black transition-all rounded-[1.8rem]",
                                            activeTab === tab.id
                                                ? "bg-background text-primary shadow-lg shadow-primary/5"
                                                : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                                        )}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* View Content */}
                            <div className="p-10">
                                {activeTab === 'ORDERS' && (
                                    <div className="space-y-8">
                                        {/* Mock Shipment Status Row */}
                                        <div className="grid grid-cols-3 gap-6 mb-12">
                                            {[
                                                { label: '결제완료', count: 1, color: 'text-blue-500' },
                                                { label: '배송중', count: 2, color: 'text-orange-500' },
                                                { label: '배송완료', count: 14, color: 'text-green-500' },
                                            ].map((status) => (
                                                <div key={status.label} className="text-center p-6 bg-secondary/10 rounded-3xl">
                                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">{status.label}</p>
                                                    <p className={cn("text-3xl font-black", status.color)}>{status.count}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Recent Order Item */}
                                        <div className="space-y-5">
                                            <div className="flex items-center justify-between border-b border-border pb-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-black text-foreground">2024.12.19 (금)</span>
                                                    <span className="text-sm font-bold text-muted-foreground">주문번호 20241219-0012491</span>
                                                </div>
                                                <Link href="#" className="text-sm font-black text-primary flex items-center gap-1 group">
                                                    주문 상세 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-8 py-4">
                                                <div className="w-full md:w-32 aspect-square bg-muted rounded-3xl overflow-hidden shadow-2xl shadow-black/10 group cursor-pointer">
                                                    <img
                                                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"
                                                        alt="Sneakers"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-black rounded-lg uppercase tracking-widest">배송중</span>
                                                        <span className="text-sm text-foreground font-black">CJ대한통운 5102-1249-1234</span>
                                                    </div>
                                                    <h3 className="text-2xl font-black tracking-tight leading-tight">DIBS! Limited Prime Sneakers - Midnight Navy</h3>
                                                    <p className="text-muted-foreground font-bold text-lg">189,000원 | 1개</p>

                                                    <div className="flex flex-wrap gap-3 mt-4">
                                                        <button className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-black rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all">
                                                            배송조회
                                                        </button>
                                                        <button className="px-6 py-2.5 border border-border text-sm font-black rounded-xl hover:bg-secondary transition-all">
                                                            문의하기
                                                        </button>
                                                        <button className="px-6 py-2.5 border border-border text-sm font-black rounded-xl hover:bg-red-500/5 hover:text-red-500 hover:border-red-500/30 transition-all">
                                                            취소신청
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'COUPONS' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative overflow-hidden bg-primary p-8 rounded-[2.5rem] text-primary-foreground group cursor-pointer hover:shadow-2xl hover:shadow-primary/30 transition-all border border-white/10">
                                            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:rotate-12 transition-transform duration-500">
                                                <Ticket className="w-24 h-24" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">New Membership</span>
                                            <h3 className="text-4xl font-black mb-1 tracking-tighter">10,000<span className="text-xl ml-1">원</span></h3>
                                            <p className="text-sm font-black opacity-90">DIBS! 가입 환영 시크릿 쿠폰</p>
                                            <div className="mt-8 pt-6 border-t border-white/20 flex flex-col gap-1">
                                                <span className="text-[10px] font-black opacity-60">사용 조건: 5만원 이상 구매 시</span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.1em]">Valid: ~ 2025.01.19</span>
                                            </div>
                                        </div>

                                        <div className="relative overflow-hidden bg-slate-900 p-8 rounded-[2.5rem] text-white group cursor-pointer hover:shadow-2xl hover:shadow-black/30 transition-all border border-white/5">
                                            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:-rotate-12 transition-transform duration-500">
                                                <Store className="w-24 h-24" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Store Special</span>
                                            <h3 className="text-4xl font-black mb-1 tracking-tighter">15<span className="text-xl ml-1">%</span></h3>
                                            <p className="text-sm font-black opacity-90">베스트 상품 기획전 할인권</p>
                                            <div className="mt-8 pt-6 border-t border-white/20 flex flex-col gap-1">
                                                <span className="text-[10px] font-black opacity-60">최대 할인 20,000원</span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.1em]">Valid: ~ 2024.12.31</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'POINTS' && (
                                    <div className="space-y-10">
                                        <div className="bg-secondary/10 p-10 rounded-[2.5rem] text-center">
                                            <Wallet className="w-20 h-20 mx-auto mb-6 text-primary opacity-30 shadow-2xl" />
                                            <h3 className="text-3xl font-black mb-4 tracking-tight">소멸 예정 포인트: 0 P</h3>
                                            <p className="text-muted-foreground font-bold text-lg mb-8 max-w-md mx-auto">차곡차곡 모인 포인트로 현금처럼 결제해보세요!</p>
                                            <button className="px-8 py-3 bg-foreground text-background font-black rounded-2xl hover:opacity-90 transition-all">적립 혜택 보기</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Tools */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Seller Onboarding Card */}
                        <div className="bg-gradient-to-br from-primary via-indigo-600 to-purple-700 p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group border border-white/10">
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-150 transition-transform duration-700 pointer-events-none">
                                <Store className="w-32 h-32" />
                            </div>
                            <div className="relative z-10">
                                <div className="p-3 bg-white/20 w-fit rounded-2xl mb-6 backdrop-blur-md border border-white/20">
                                    <Store className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-3xl font-black mb-3 tracking-tighter leading-tight">DIBS! <br />판매자 권한 신청</h2>
                                <p className="text-white/80 text-sm font-black mb-10 leading-relaxed italic">
                                    "당신의 가치 있는 제품을 <br />수천 명의 대기 유저에게 직접 제안하세요."
                                </p>
                                <button className="w-full py-5 bg-white text-primary font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3 group-hover:gap-5 duration-300 shadow-xl shadow-black/20">
                                    판매자 센터 입점 신청 <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Utility Menu */}
                        <div className="bg-background border border-border rounded-[3rem] p-6 space-y-3 shadow-xl shadow-black/5">
                            <h3 className="px-6 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-loose">Account Settings</h3>
                            {[
                                { name: '인증 및 보안 설정', icon: <ShieldCheck className="w-5 h-5" /> },
                                { name: '결제 수단 / 간편결제', icon: <CreditCard className="w-5 h-5" /> },
                                { name: '배송지 관리', icon: <Package className="w-5 h-5" /> },
                                { name: '알림 / 메시지 설정', icon: <Bell className="w-5 h-5" />, toggle: true },
                            ].map((item) => (
                                <button key={item.name} className="w-full flex items-center justify-between p-5 hover:bg-secondary/50 rounded-2xl transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                            {item.icon}
                                        </div>
                                        <span className="text-sm font-black text-foreground">{item.name}</span>
                                    </div>
                                    {item.toggle ? (
                                        <div className="w-12 h-7 bg-primary rounded-full relative p-1.5 shadow-inner">
                                            <div className="w-4 h-4 bg-white rounded-full absolute right-1.5" />
                                        </div>
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-30 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
