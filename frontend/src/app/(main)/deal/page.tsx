"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Clock,
    Zap,
    ShoppingBag,
    Flame,
    TrendingUp,
    Timer,
    ChevronRight,
    Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { productService } from '@/services/productService';
import { Product } from '@/types';

export default function TimeDealPage() {
    const [deals, setDeals] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState<{ [key: number]: string }>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const response = await productService.getProducts({ size: 4 });
                setDeals(response.items);
            } catch (error) {
                console.error("Failed to fetch deals:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDeals();
    }, []);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const newTimeLeft: { [key: number]: string } = {};

            // Simulate endsAt for current products
            deals.forEach(deal => {
                const endsAt = now + 1000 * 60 * 60 * 5; // 5 hours from now
                const diff = endsAt - now;
                if (diff <= 0) {
                    newTimeLeft[deal.id] = "ENDED";
                } else {
                    const h = Math.floor(diff / (1000 * 60 * 60));
                    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const s = Math.floor((diff % (1000 * 60)) / 1000);
                    newTimeLeft[deal.id] = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                }
            });
            setTimeLeft(newTimeLeft);
        }, 1000);
        return () => clearInterval(timer);
    }, [deals]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Hero Banner */}
            <div className="bg-foreground text-background pt-32 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-10 animate-pulse">
                    <Timer className="w-96 h-96 -rotate-12" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
                        <div className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-xs font-black tracking-[0.3em] uppercase">
                            Time Limited Offer
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter leading-none italic">
                            TIME <span className="text-primary italic">DEAL</span>
                        </h1>
                        <p className="text-xl font-medium opacity-60 leading-relaxed">
                            매일 찾아오는 기적 같은 가격. 선착순 마감되는 <br />디입스만의 익스클루시브 타임딜을 놓치지 마세요.
                        </p>
                    </div>
                </div>
            </div>

            {/* Deals Grid */}
            <div className="container mx-auto px-4 -mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {deals.length > 0 ? (
                        deals.map((deal) => {
                            const status = timeLeft[deal.id];
                            const isSoldOut = deal.status === 'SOLD_OUT' || status === "ENDED";
                            const stockPercent = deal.stockQuantity ? Math.min(100, Math.floor(((deal.stockQuantity) / 50) * 100)) : 0;

                            return (
                                <Link
                                    href={`/store/${deal.id}`}
                                    key={deal.id}
                                    className={cn(
                                        "group relative bg-background border border-border rounded-[3rem] overflow-hidden flex flex-col md:flex-row transition-all duration-500",
                                        isSoldOut ? "opacity-60 saturate-0 scale-[0.98]" : "hover:border-primary/50 hover:shadow-3xl hover:shadow-primary/10"
                                    )}
                                >
                                    {/* Image Box */}
                                    <div className="relative w-full md:w-80 aspect-square md:aspect-auto overflow-hidden bg-muted">
                                        <img
                                            src={deal.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'}
                                            alt={deal.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {isSoldOut && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                <span className="text-3xl font-black text-white border-4 border-white px-8 py-2 rotate-12 uppercase">Closed</span>
                                            </div>
                                        )}
                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            <div className="px-5 py-2 bg-primary text-primary-foreground text-sm font-black rounded-2xl shadow-xl flex items-center gap-2">
                                                <Zap className="w-4 h-4 fill-current" />
                                                {deal.discountRate || 0}%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Box */}
                                    <div className="flex-1 p-10 flex flex-col justify-between">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-primary">
                                                    <Clock className="w-5 h-5" />
                                                    <span className="text-2xl font-black tracking-tighter tabular-nums">{status || "Checking..."}</span>
                                                </div>
                                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{deal.stockQuantity || 0} items left</span>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-3xl font-black tracking-tighter leading-tight group-hover:text-primary transition-colors">{deal.name}</h3>
                                                <div className="flex items-baseline gap-3">
                                                    <span className="text-4xl font-black text-foreground">{deal.price.toLocaleString()}<span className="text-lg">원</span></span>
                                                    {deal.discountRate !== undefined && deal.discountRate > 0 && (
                                                        <span className="text-lg font-bold text-muted-foreground line-through opacity-40">
                                                            {(deal.price / (1 - deal.discountRate / 100)).toLocaleString()}원
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Stock Progress Bar */}
                                            <div className="space-y-3">
                                                <div className="h-6 w-full bg-secondary/30 rounded-full overflow-hidden p-1 border border-border">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-1000 relative",
                                                            stockPercent < 10 ? "bg-red-500" : "bg-gradient-to-r from-primary to-purple-500"
                                                        )}
                                                        style={{ width: `${stockPercent}%` }}
                                                    >
                                                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                    <span className={cn(stockPercent < 10 ? "text-red-500 animate-pulse" : "text-primary")}>
                                                        {isSoldOut ? "매진" : stockPercent < 10 ? "매진 임박" : "활발히 판매 중"}
                                                    </span>
                                                    <span className="text-muted-foreground">Limit 1 per person</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            disabled={isSoldOut}
                                            className={cn(
                                                "mt-10 w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3",
                                                isSoldOut
                                                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                                                    : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground shadow-2xl hover:shadow-primary/30 active:scale-95"
                                            )}
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                            {isSoldOut ? "다음 딜을 기다려주세요" : "지금 바로 디입스하기"}
                                        </button>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-32 text-center bg-secondary/10 rounded-[4rem] border border-dashed border-border opacity-50">
                            <Zap className="w-12 h-12 text-muted-foreground/20 mx-auto mb-6" />
                            <p className="text-xl font-black italic text-muted-foreground">진행 중인 타임딜이 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Promotion Section */}
            <div className="container mx-auto px-4 mt-32">
                <div className="bg-secondary/10 border border-border rounded-[4rem] p-16 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
                    <div className="space-y-4 max-w-xl">
                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                            <Trophy className="w-6 h-6 text-primary" />
                            <span className="text-sm font-black text-primary uppercase tracking-[0.2em]">Next Drop Sneak Peek</span>
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter leading-none">내일 오전 10:00 <br />그랜드 오픈</h2>
                        <p className="text-lg font-medium text-muted-foreground">놓치기 아쉬운 다음 타임딜 정보를 앱 푸시 알림으로 가장 먼저 받아보세요.</p>
                    </div>
                    <button className="px-12 py-6 bg-background border border-border rounded-3xl font-black text-xl hover:bg-secondary transition-all shadow-xl flex items-center gap-4 group">
                        알림 신청하기 <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
