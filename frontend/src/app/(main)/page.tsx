"use client";

import Image from "next/image";
import Link from "next/link";
import { Timer, ArrowRight, ShoppingBag, Tag, Flame, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour for demo

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section - Flash Deal */}
            <section className="relative h-[700px] flex items-center justify-center overflow-hidden border-b border-border">
                {/* Background - Premium Gradient & Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
                        alt="Electronics"
                        fill
                        className="object-cover scale-105"
                        priority
                    />
                </div>

                <div className="container relative z-20 px-4 md:px-6">
                    <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                            <Zap className="w-3 h-3 fill-current" />
                            <span>EXCLUSIVE TIME DEAL</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]">
                                NEXT-GEN <br />
                                <span className="text-primary italic">WORKSPACE</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-[500px] font-medium leading-relaxed">
                                선착순 50명 한정, 새로운 생산성을 경험하세요. <br />
                                정해진 수량이 소진되면 이벤트는 즉시 종료됩니다.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">마감까지 남은 시간</span>
                                <div className="text-4xl font-mono font-black text-foreground lining-nums">
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                            <div className="w-px h-12 bg-border hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">현재 잔여 수량</span>
                                <div className="text-4xl font-black text-primary">
                                    12<span className="text-lg text-muted-foreground ml-1">/ 50</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Link
                                href="/deal"
                                className="group relative inline-flex items-center justify-center gap-3 h-14 px-10 rounded-full bg-primary text-primary-foreground font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Tag className="w-5 h-5" />
                                    선착순 특별가로 구매하기
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Link>
                            <Link
                                href="/best"
                                className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-full border border-border bg-secondary/50 backdrop-blur-xl text-foreground font-bold hover:bg-secondary transition-all text-lg"
                            >
                                제품 상세 보기
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 pt-8 text-xs font-bold text-muted-foreground uppercase tracking-widest border-t border-border/50 w-fit">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                100% 정품 보장
                            </div>
                            <div className="flex items-center gap-2">
                                <Timer className="w-4 h-4 text-primary" />
                                선착순 실시간 집계
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Items Section */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-tighter uppercase">
                                <Flame className="w-4 h-4 fill-current" />
                                Trending Now
                            </div>
                            <h2 className="text-4xl font-black tracking-tight">지금 뜨는 큐레이션</h2>
                        </div>
                        <Link
                            href="/best"
                            className="group text-sm font-bold flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                            전체 상품 보기
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { name: "Premium Headphones", price: 299000, oldPrice: 350000, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop" },
                            { name: "Mechanical Keyboard", price: 159000, oldPrice: 189000, img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2070&auto=format&fit=crop" },
                            { name: "Smart Watch S4", price: 429000, oldPrice: 480000, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop" },
                            { name: "Minimal Desk Lamp", price: 45000, oldPrice: 65000, img: "https://images.unsplash.com/photo-1507473885765-e6ed657db991?q=80&w=1974&auto=format&fit=crop" }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="group flex flex-col bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="aspect-[1/1] relative overflow-hidden">
                                    <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">
                                        -{Math.round((1 - item.price / item.oldPrice) * 100)}%
                                    </div>
                                    <Image
                                        src={item.img}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                    <button className="absolute bottom-4 right-4 p-3 rounded-full bg-background/80 backdrop-blur-md text-foreground opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                                        <ShoppingBag className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-3">
                                    <div className="space-y-1">
                                        <h3 className="font-black text-lg leading-tight group-hover:text-primary transition-colors">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                                            Premium Collection
                                        </p>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black text-foreground">
                                            {item.price.toLocaleString()}₩
                                        </span>
                                        <span className="text-xs text-muted-foreground line-through font-bold">
                                            {item.oldPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
