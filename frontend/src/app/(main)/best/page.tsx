"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Trophy,
    TrendingUp,
    ChevronRight,
    ShoppingBag,
    Star,
    Flame,
    Filter,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { productService } from '@/services/productService';
import { Product } from '@/types';

const PERIODS = ["실시간", "일간", "주간", "월간"];

export default function BestPage() {
    const [bestProducts, setBestProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState("실시간");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const fetchBest = async () => {
            try {
                setIsLoading(true);
                const response = await productService.getProducts({ size: 10 });
                setBestProducts(response.items);
            } catch (error) {
                console.error("Failed to fetch best products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBest();
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header omitted for brevity in this tool call, keep it as is */}
            <div className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background border-b border-border">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-black text-primary uppercase tracking-[0.3em]">Top 100 Rankings</span>
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter leading-none">
                                BEST <span className="text-primary">SELLER</span>
                            </h1>
                            <p className="text-lg font-medium text-muted-foreground opacity-70">지금 이 순간, 디입스에서 가장 사랑받는 아이템을 만나보세요.</p>
                        </div>

                        {/* Period Filter */}
                        <div className="flex bg-secondary/20 p-2 rounded-2xl border border-border">
                            {PERIODS.map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={cn(
                                        "px-6 py-3 rounded-xl text-sm font-black transition-all",
                                        selectedPeriod === period
                                            ? "bg-background text-primary shadow-lg shadow-black/5"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ranking List */}
            <div className="container mx-auto px-4 py-20">
                {bestProducts.length > 0 ? (
                    <div className="space-y-24">
                        {/* Top 3 Focus */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {bestProducts.slice(0, 3).map((item, index) => (
                                <Link
                                    href={`/store/${item.id}`}
                                    key={item.id}
                                    className="group relative flex flex-col bg-background border border-border rounded-[3.5rem] overflow-hidden hover:border-primary/50 hover:shadow-3xl hover:shadow-primary/5 transition-all duration-700"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                                        <img
                                            src={item.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />

                                        {/* Rank Badge */}
                                        <div className="absolute top-8 left-8 w-20 h-20 bg-background/90 backdrop-blur-xl rounded-[2rem] flex flex-col items-center justify-center shadow-2xl skew-x-[-4deg]">
                                            <span className="text-sm font-black opacity-30 leading-none">Rank</span>
                                            <span className="text-4xl font-black text-primary leading-none">{index + 1}</span>
                                        </div>

                                        {/* Action Reveal */}
                                        <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                                            <button className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl flex items-center justify-center gap-2">
                                                <ShoppingBag className="w-4 h-4" />
                                                장바구니 담기
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-10 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-orange-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="text-sm font-black">4.9</span>
                                                <span className="text-xs text-muted-foreground font-medium">(120)</span>
                                            </div>
                                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-widest">Hot Now</span>
                                        </div>
                                        <h3 className="text-3xl font-black tracking-tighter leading-tight group-hover:text-primary transition-colors">{item.name}</h3>
                                        <p className="text-2xl font-black tracking-tighter">{item.price.toLocaleString()}<span className="text-sm ml-1">원</span></p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Rest of Ranking Items (Tabular Style) */}
                        <div className="space-y-4">
                            <div className="flex items-center px-10 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border">
                                <span className="w-20 text-center">Rank</span>
                                <span className="flex-1">Product Info</span>
                                <span className="w-32 text-right">Rating</span>
                                <span className="w-32 text-right">Price</span>
                            </div>
                            {bestProducts.slice(3).map((item, index) => (
                                <Link
                                    href={`/store/${item.id}`}
                                    key={item.id}
                                    className="group flex items-center px-10 py-8 bg-background border border-border rounded-[2rem] hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all"
                                >
                                    <div className="w-20 flex flex-col items-center">
                                        <span className="text-3xl font-black group-hover:text-primary transition-colors">{index + 4}</span>
                                        <div className="flex items-center gap-1 text-[10px] font-black opacity-30">
                                            <TrendingUp className="w-3 h-3" /> 0
                                        </div>
                                    </div>

                                    <div className="flex-1 flex items-center gap-8">
                                        <div className="w-24 aspect-square bg-muted rounded-2xl overflow-hidden shadow-lg">
                                            <img
                                                src={item.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{item.name}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">DIBS! Official</span>
                                                <div className="w-1 h-1 bg-border rounded-full" />
                                                <span className="text-[10px] font-black text-primary uppercase">Trending</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-32 text-right flex flex-col items-end">
                                        <div className="flex items-center gap-1.5 text-orange-500">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-base font-black">4.8</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground font-bold">85 keys</span>
                                    </div>

                                    <div className="w-32 text-right">
                                        <p className="text-xl font-black tracking-tighter">{item.price.toLocaleString()}원</p>
                                    </div>
                                    <div className="ml-8 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="w-6 h-6 text-primary" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center pt-10">
                            <button className="px-12 py-5 border-2 border-border rounded-3xl font-black text-lg hover:border-primary hover:text-primary transition-all flex items-center gap-4 group">
                                Next Ranking (11-100) <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="py-40 text-center bg-secondary/10 rounded-[4rem] border border-dashed border-border opacity-50">
                        <Trophy className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                        <p className="text-2xl font-black italic text-muted-foreground">현재 집계된 랭킹 정보가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
