"use client";

import { useState, useEffect } from 'react';
import {
    Ticket,
    Download,
    Zap,
    Star,
    Gift,
    Sparkles,
    ChevronRight,
    Search,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Coupons
const MOCK_COUPONS = [
    {
        id: 1,
        name: "전상품 10,000원 할인",
        desc: "5만원 이상 결제 시 사용 가능",
        discount: "10,000",
        unit: "원",
        type: "Fixed",
        brand: "DIBS! Exclusive",
        endsAt: "2024.12.31",
        isDownloaded: false
    },
    {
        id: 2,
        name: "디지털 카테고리 15% 기획전",
        desc: "최대 3만원 할인 / 가전, 디지털 전용",
        discount: "15",
        unit: "%",
        type: "Percentage",
        brand: "Tech Master",
        endsAt: "2024.12.25",
        isDownloaded: true
    },
    {
        id: 3,
        name: "첫 구매 감사 20,000원",
        desc: "DIBS! 첫 구매 고객님을 위한 선물",
        discount: "20,000",
        unit: "원",
        type: "Fixed",
        brand: "Welcome Pack",
        endsAt: "2025.01.01",
        isDownloaded: false
    },
    {
        id: 4,
        name: "스니커즈 딜 초특가 쿠폰",
        desc: "지정된 스니커즈 아이템 한정",
        discount: "5",
        unit: "%",
        type: "Percentage",
        brand: "Style Pick",
        endsAt: "2024.12.20",
        isDownloaded: false
    }
];

export default function CouponsPage() {
    const [coupons, setCoupons] = useState(MOCK_COUPONS);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const downloadCoupon = (id: number) => {
        setCoupons(prev => prev.map(c =>
            c.id === id ? { ...c, isDownloaded: true } : c
        ));
    };

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header / Search Section */}
            <div className="pt-32 pb-20 bg-secondary/20 border-b border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12">
                    <Ticket className="w-96 h-96" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
                        <div className="flex items-center gap-3 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Benefit Zone</span>
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter leading-none">
                            COUPON <span className="text-primary">ISLAND</span>
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground opacity-70 leading-relaxed">
                            쇼핑의 즐거움을 더하는 마법 같은 혜택. <br />지금 가장 필요한 쿠폰을 다운로드하고 최적의 가격으로 구매하세요.
                        </p>

                        <div className="w-full max-w-xl relative mt-8">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="브랜드 또는 혜택 검색..."
                                className="w-full pl-16 pr-8 py-5 bg-background border-2 border-border rounded-[2rem] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-black text-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                    {/* Welcome Bonus Card */}
                    <div className="lg:col-span-3 bg-gradient-to-br from-primary via-indigo-600 to-purple-700 p-12 rounded-[4rem] text-white flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group border border-white/10 shadow-3xl shadow-primary/20">
                        <div className="absolute top-0 right-0 p-20 opacity-10 group-hover:rotate-45 transition-transform duration-1000">
                            <Gift className="w-80 h-80" />
                        </div>
                        <div className="space-y-6 relative z-10 text-center lg:text-left">
                            <div className="px-5 py-2 bg-white/20 backdrop-blur-md rounded-full w-fit mx-auto lg:mx-0 border border-white/20">
                                <span className="text-xs font-black uppercase tracking-widest text-white">Membership Event</span>
                            </div>
                            <h2 className="text-6xl font-black tracking-tighter leading-tight">신규 가입 <br />무조건 10% 쿠폰</h2>
                            <p className="text-xl font-medium opacity-80 max-w-md">앱 다운로드 시 즉시 발급! 최고 50,000원까지 할인 혜택을 누리세요.</p>
                        </div>
                        <button className="relative z-10 px-16 py-7 bg-white text-primary font-black text-2xl rounded-3xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center gap-4 group">
                            지금 참여하기 <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    {/* Coupons List */}
                    {coupons.map((coupon) => (
                        <div key={coupon.id} className={cn(
                            "relative flex flex-col bg-background border-2 border-border rounded-[3.5rem] p-10 transition-all duration-500 overflow-hidden group",
                            coupon.isDownloaded ? "bg-secondary/20 border-transparent shadow-none" : "hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5"
                        )}>
                            {/* Visual Background Decoration */}
                            <div className="absolute -top-10 -right-10 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                                <Ticket className="w-64 h-64 -rotate-12" />
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{coupon.brand}</span>
                                    <div className="flex items-center gap-1.5 text-orange-500">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">D-12</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-7xl font-black tracking-tighter leading-none">{coupon.discount}</span>
                                        <span className="text-3xl font-black">{coupon.unit}</span>
                                    </div>
                                    <p className="text-lg font-black tracking-tight leading-tight">{coupon.name}</p>
                                    <p className="text-sm font-medium text-muted-foreground">{coupon.desc}</p>
                                </div>

                                <div className="pt-8 border-t border-border flex items-center justify-between">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Valid Until {coupon.endsAt}</span>
                                    <button
                                        onClick={() => downloadCoupon(coupon.id)}
                                        disabled={coupon.isDownloaded}
                                        className={cn(
                                            "p-4 rounded-2xl transition-all active:scale-90",
                                            coupon.isDownloaded
                                                ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                                                : "bg-primary text-primary-foreground hover:shadow-xl hover:shadow-primary/20"
                                        )}
                                    >
                                        {coupon.isDownloaded ? <CheckCircle2 className="w-6 h-6" /> : <Download className="w-6 h-6" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Info */}
            <div className="container mx-auto px-4 mt-12">
                <div className="bg-secondary/30 p-8 rounded-[2rem] border border-border flex items-center gap-6">
                    <div className="p-4 bg-background rounded-2xl shadow-xl">
                        <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-black text-foreground">쿠폰 사용 유의사항</h4>
                        <p className="text-sm text-muted-foreground font-medium">일부 선착순 타임딜 및 특가 상품은 쿠폰 적용이 제한될 수 있습니다. (마이페이지 {'>'} 쿠폰함에서 확인 가능)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
