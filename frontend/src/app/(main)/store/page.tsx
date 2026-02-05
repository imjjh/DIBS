"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    ShoppingCart,
    Zap,
    ChevronDown,
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
const CATEGORIES = ["전체", "신발", "의류", "액세서리", "디지털", "기타"];


export default function StorePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [searchQuery, setSearchQuery] = useState("");
    const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        setMounted(true);
        loadProducts();
    }, [selectedCategory, submittedSearchQuery]);

    const handleSearchSubmit = () => {
        setSubmittedSearchQuery(searchQuery);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const response = await productService.getProducts({
                category: selectedCategory === "전체" ? undefined : selectedCategory,
                keyword: submittedSearchQuery || undefined,
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
                keyword: submittedSearchQuery || undefined,
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
                                onKeyDown={handleKeyDown}
                                className="w-full pl-14 pr-32 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold placeholder:text-muted-foreground/50"
                            />
                            <button
                                onClick={handleSearchSubmit}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-primary-foreground text-xs font-black rounded-xl hover:shadow-lg transition-all active:scale-95"
                            >
                                검색
                            </button>
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
                    </aside>

                    {/* Main Content: Product Grid */}
                    <main className="lg:col-span-10">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-xs font-bold text-muted-foreground">함께 찾은 아이템: <span className="text-foreground">{totalElements}개</span></p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                                            {/* Action Button: Visible on Hover (Only for ON_SALE) */}
                                            {product.status === ProductStatus.ON_SALE && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                                    <button className="px-8 py-3 bg-white text-black font-black rounded-2xl shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                        <ShoppingCart className="w-4 h-4" />
                                                        바로 구매
                                                    </button>
                                                </div>
                                            )}
                                            {product.status === ProductStatus.PREPARING && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="px-6 py-2 bg-blue-500 text-white font-black rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                        COMING SOON
                                                    </span>
                                                </div>
                                            )}
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
