"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    ShoppingCart,
    Zap,
    ChevronDown,
    Grid as GridIcon,
    List as ListIcon,
    TrendingUp,
    Clock,
    Flame,
    Plus,
    ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product, ProductStatus } from '@/types';
import { productService } from '@/services/productService';

// Mock Categories
const CATEGORIES = ["전체", "신발", "의류", "액세서리", "디지털", "한정판"];


export default function StorePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [mounted, setMounted] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [totalElements, setTotalElements] = useState(0);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        setMounted(true);
        loadProducts();
    }, [selectedCategory, debouncedSearchQuery]);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const response = await productService.getProducts({
                category: selectedCategory === "전체" ? undefined : selectedCategory,
                keyword: debouncedSearchQuery || undefined,
                page: 1,
                size: 12
            });

            if (response && response.items) {
                setProducts(response.items);
                setTotalElements(response.totalElements);
                setHasMore(response.items.length >= 12);
            }
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMoreProducts = async () => {
        if (!hasMore || isFetchingMore) return;

        try {
            setIsFetchingMore(true);
            const lastProduct = products[products.length - 1];
            const response = await productService.getProducts({
                category: selectedCategory === "전체" ? undefined : selectedCategory,
                keyword: debouncedSearchQuery || undefined,
                lastProductId: lastProduct?.id,
                page: Math.floor(products.length / 12) + 1,
                size: 12
            });

            if (response && response.items) {
                if (response.items.length === 0) {
                    setHasMore(false);
                } else {
                    setProducts(prev => [...prev, ...response.items]);
                    setHasMore(response.items.length >= 12);
                }
            }
        } catch (error) {
            console.error("Failed to load more products:", error);
        } finally {
            setIsFetchingMore(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Store Header Section */}
            <div className="relative overflow-hidden bg-secondary/30 border-b border-border pt-24 pb-16">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-12 h-1 bg-primary rounded-full" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">공식 스토어</span>
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter leading-none mb-6">
                            최고의 <span className="text-primary italic">선택</span>, 최상의 브랜드
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium max-w-xl opacity-80 leading-relaxed">
                            DIBS!가 엄선한 선착순 리미티드 아이템부터 <br />트렌디한 프리미엄 브랜드까지 한 곳에서 만나보세요.
                        </p>
                    </div>

                    {/* Quick Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 mt-12 bg-background/50 backdrop-blur-xl p-4 rounded-[2.5rem] border border-border shadow-2xl shadow-black/5">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="아이템 또는 브랜드 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold placeholder:text-muted-foreground/50"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="px-6 py-4 border border-border rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-secondary transition-all">
                                <Filter className="w-4 h-4" />
                                필터
                                <ChevronDown className="w-4 h-4 opacity-30" />
                            </button>
                            <div className="hidden md:flex bg-secondary/20 p-1.5 rounded-2xl border border-border gap-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-background shadow-sm text-primary" : "text-muted-foreground")}
                                >
                                    <GridIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn("p-2.5 rounded-xl transition-all", viewMode === 'list' ? "bg-background shadow-sm text-primary" : "text-muted-foreground")}
                                >
                                    <ListIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar: Categories */}
                    <aside className="lg:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <TrendingUp className="w-3 h-3" /> 카테고리
                            </h3>
                            <div className="flex flex-col gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={cn(
                                            "px-4 py-3 rounded-xl text-sm font-black text-left transition-all",
                                            selectedCategory === cat
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Store Stats */}
                        <div className="bg-secondary/10 p-6 rounded-[2rem] border border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                    <Flame className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">트렌딩</span>
                            </div>
                            <p className="text-sm font-bold leading-tight">많은 사람들이<br />디입스 중!</p>
                        </div>
                    </aside>

                    {/* Main Content: Product Grid */}
                    <main className="lg:col-span-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-foreground">인기 상품 순</span>
                                <ChevronDown className="w-4 h-4 opacity-30" />
                            </div>
                            <p className="text-xs font-bold text-muted-foreground">함께 찾은 아이템: <span className="text-foreground">{totalElements}개</span></p>
                        </div>

                        <div className={cn(
                            "grid gap-8",
                            viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                        )}>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <Link
                                        href={`/store/${product.id}`}
                                        key={product.id}
                                        className="group relative bg-background border border-border rounded-[2.5rem] overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                                    >
                                        {/* Product Image */}
                                        <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />

                                            {/* Status Overlays */}
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                {product.discountRate !== undefined && product.discountRate > 0 && (
                                                    <div className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-lg tracking-widest flex items-center gap-1 shadow-lg">
                                                        <Zap className="w-3 h-3" /> {product.discountRate}% OFF
                                                    </div>
                                                )}
                                                {product.status === ProductStatus.SOLD_OUT && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                                        <span className="text-xl font-black text-white border-2 border-white px-4 py-1 rotate-[-12deg]">SOLD OUT</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Button: Visible on Hover */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                                <button className="px-8 py-3 bg-white text-black font-black rounded-2xl shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                    <ShoppingCart className="w-4 h-4" />
                                                    바로 구매
                                                </button>
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-6 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{product.category}</span>
                                            </div>
                                            <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-black">{product.price.toLocaleString()}원</span>
                                                {product.discountRate !== undefined && product.discountRate > 0 && (
                                                    <span className="text-sm font-bold text-muted-foreground line-through opacity-50">
                                                        {(Number(product.price) * (1 + product.discountRate / 100)).toLocaleString()}원
                                                    </span>
                                                )}
                                            </div>

                                            {/* Dynamic Badges */}
                                            <div className="flex items-center gap-3 pt-2">
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                                                    <Clock className="w-3 h-3" /> 한정 입고
                                                </div>
                                                <div className="w-1 h-1 bg-border rounded-full" />
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500">
                                                    <ShoppingBag className="w-3 h-3" /> 매진 임박
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                !isLoading && (
                                    <div className="col-span-full py-20 text-center bg-secondary/10 rounded-[2.5rem] border border-dashed border-border">
                                        <p className="text-muted-foreground font-black tracking-tight">등록된 상품이 없습니다.</p>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Pagination / Load More */}
                        {hasMore && (
                            <div className="mt-20 flex justify-center">
                                <button
                                    onClick={loadMoreProducts}
                                    disabled={isFetchingMore}
                                    className="px-12 py-4 border border-border rounded-2xl font-black text-sm hover:bg-secondary transition-all flex items-center gap-3 group disabled:opacity-50"
                                >
                                    {isFetchingMore ? (
                                        <Clock className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Plus className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    )}
                                    {isFetchingMore ? "불러오는 중..." : "아이템 더 보기"}
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
