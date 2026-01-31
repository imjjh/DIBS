"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Package, ShoppingCart, TrendingUp, Users, ArrowUpRight, Zap, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { productService } from '@/services/productService';
import { Product } from '@/types';

export default function SellerDashboard() {
    const { user } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await productService.getSellerProducts({
                keyword: debouncedSearch || undefined,
                size: 5
            });
            setProducts(response.items);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user, debouncedSearch]);

    const stats = [
        { label: '총 매출액', value: '0₩', change: '+0%', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-emerald-500' },
        { label: '활성 주문', value: '0건', change: '+0건', icon: <ShoppingCart className="w-6 h-6" />, color: 'bg-indigo-500' },
        { label: '등록 상품', value: `${products.length}개`, change: `신규 ${products.filter(p => true).length}`, icon: <Package className="w-6 h-6" />, color: 'bg-amber-500' },
        { label: '방문자 수', value: '0명', change: '+0%', icon: <Users className="w-6 h-6" />, color: 'bg-pink-500' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tighter">Welcome back, {user?.nickname || user?.name}</h2>
                    <p className="text-white/40 font-medium">판매자 센터 대시보드에서 실시간 현황을 확인하세요.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-sm font-bold text-white/60">시스템 정상 작동 중</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-[#0f0f12] border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group">
                        <div className="flex items-center justify-between mb-8">
                            <div className={`p-4 ${stat.color} rounded-2xl shadow-lg shadow-white/5 transition-transform group-hover:scale-110`}>
                                {stat.icon}
                            </div>
                            <span className="text-emerald-400 text-xs font-black flex items-center gap-1">
                                {stat.change} <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                        <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-black">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Content Row */}
            <div className="grid grid-cols-1 gap-8">
                {/* Popular Products */}
                <div className="bg-[#0f0f12] border border-white/5 rounded-[3rem] p-10 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-2xl font-black tracking-tight">내 상품 현황</h3>
                        <div className="flex items-center gap-4 flex-1 max-w-md">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="내 상품 검색..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                            <Link href="/seller/products">
                                <button className="shrink-0 text-sm font-black text-indigo-400 hover:text-indigo-300 transition-colors">전체 보기</button>
                            </Link>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                            <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <Package className="w-12 h-12 text-white/5" />
                            <p className="text-white/30 font-bold">등록된 상품이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {products.slice(0, 5).map((product) => (
                                <Link
                                    href={`/seller/products/${product.id}`}
                                    key={product.id}
                                    className="flex items-center gap-6 p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5 group/item"
                                >
                                    <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden border border-white/5 p-2 flex items-center justify-center group-hover/item:border-indigo-500/30 transition-colors">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <Package className="w-8 h-8 text-white/20" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-lg group-hover/item:text-indigo-400 transition-colors">{product.name}</h4>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-wider">
                                            가격: {product.price.toLocaleString()}₩ | 재고: {product.stockQuantity || 0}개
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn(
                                            "px-4 py-2 text-[10px] font-black rounded-lg uppercase tracking-widest",
                                            product.status === 'ON_SALE' ? "bg-emerald-500/10 text-emerald-500" :
                                                product.status === 'PREPARING' ? "bg-blue-500/10 text-blue-500" :
                                                    "bg-white/5 text-white/30"
                                        )}>
                                            {product.status}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
