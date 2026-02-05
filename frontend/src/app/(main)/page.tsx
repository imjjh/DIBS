"use client";

import Image from "next/image";
import Link from "next/link";
import { Timer, ArrowRight, ShoppingBag, Tag, Flame, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { productService } from "@/services/productService";
import { Product } from "@/types";

export default function Home() {
    const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
    const [isTrendingLoading, setIsTrendingLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await productService.getProducts({ size: 4 });
                setTrendingProducts(response.items);
            } catch (error) {
                console.error("Failed to fetch trending products:", error);
            } finally {
                setIsTrendingLoading(false);
            }
        };
        fetchTrending();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* ... (Hero Section same as before) */}
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
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]">
                                SIMPLY <br />
                                <span className="text-primary italic">DIBS!</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-[500px] font-medium leading-relaxed">
                                엄선된 프리미엄 아이템을 가장 먼저 만나보세요. <br />
                                최고의 큐레이션으로 보답하는 DIBS 쇼핑몰입니다.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-8 items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Backend Core</span>
                                <div className="text-3xl font-black text-foreground">
                                    DATA INTEGRITY
                                </div>
                                <p className="text-[11px] font-bold text-muted-foreground mt-1">철저한 데이터 정합성 보장</p>
                            </div>
                            <div className="w-px h-12 bg-border hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Concurrency</span>
                                <div className="text-3xl font-black text-foreground">
                                    DISTRIBUTED LOCK
                                </div>
                                <p className="text-[11px] font-bold text-muted-foreground mt-1">Redis 분산 락 동시성 제어</p>
                            </div>
                            <div className="w-px h-12 bg-border hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Security</span>
                                <div className="text-3xl font-black text-foreground">
                                    JWT & RTR
                                </div>
                                <p className="text-[11px] font-bold text-muted-foreground mt-1">보안 인증 및 토큰 로테이션</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Link
                                href="/store"
                                className="group relative inline-flex items-center justify-center gap-3 h-14 px-10 rounded-full bg-primary text-primary-foreground font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5" />
                                    지금 스토어 둘러보기
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Link>
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
                            href="/store"
                            className="group text-sm font-bold flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                            전체 상품 보기
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {isTrendingLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-3xl" />
                            ))
                        ) : trendingProducts.length > 0 ? (
                            trendingProducts.map((item) => (
                                <Link
                                    href={`/store/${item.id}`}
                                    key={item.id}
                                    className="group flex flex-col bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                                >
                                    <div className="aspect-[1/1] relative overflow-hidden">
                                        {item.discountRate !== undefined && item.discountRate > 0 && (
                                            <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">
                                                -{item.discountRate}%
                                            </div>
                                        )}
                                        <Image
                                            src={(item.imageUrl && item.imageUrl.trim() !== "") ? item.imageUrl : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'}
                                            alt={item.name || "Product Image"}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            unoptimized={!item.imageUrl}
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
                                                {item.category || 'Premium Collection'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xl font-black text-foreground">
                                                {item.price.toLocaleString()}₩
                                            </span>
                                            {item.discountRate !== undefined && item.discountRate > 0 && (
                                                <span className="text-xs text-muted-foreground line-through font-bold">
                                                    {(item.price / (1 - item.discountRate / 100)).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-secondary/10 rounded-3xl border border-dashed border-border opacity-50">
                                <p className="text-muted-foreground font-bold italic">등록된 상품이 아직 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
