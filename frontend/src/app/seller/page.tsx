"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Package, ShoppingCart, TrendingUp, Users, ArrowUpRight, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from '@/lib/axios';
import { Product, ApiResponse } from '@/types';

export default function SellerDashboard() {
    const { user } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<ApiResponse<{ items: Product[] }>>('/products');
                const allItems = response.data.data.items;
                const myItems = allItems.filter(p => p.sellerId === user?.id);
                setProducts(myItems);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Popular Products */}
                <div className="lg:col-span-2 bg-[#0f0f12] border border-white/5 rounded-[3rem] p-10 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black tracking-tight">내 상품 현황</h3>
                        <Link href="/seller/products">
                            <button className="text-sm font-black text-indigo-400 hover:text-indigo-300 transition-colors">전체 보기</button>
                        </Link>
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
                            {products.slice(0, 3).map((product) => (
                                <div key={product.id} className="flex items-center gap-6 p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5">
                                    <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden border border-white/5 p-2 flex items-center justify-center">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <Package className="w-8 h-8 text-white/20" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-lg">{product.name}</h4>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-wider">
                                            가격: {product.price.toLocaleString()}₩ | 재고: {product.stockQuantity || 0}개
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn(
                                            "px-4 py-2 text-[10px] font-black rounded-lg uppercase tracking-widest",
                                            product.status === 'ON_SALE' ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-white/30"
                                        )}>
                                            {product.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick News / Tips */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-10 text-white space-y-8 relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                    <Zap className="absolute -top-10 -right-10 w-40 h-40 opacity-10 rotate-12" />
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black tracking-tight mb-4">판매자 꿀팁 💡</h3>
                        <div className="space-y-6">
                            <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                                <p className="text-sm font-bold leading-relaxed">"상품 설명에 상세 사진을 5장 이상 등록하면 구매 전환율이 30% 상승합니다."</p>
                            </div>
                            <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                                <p className="text-sm font-bold leading-relaxed">"고객 문의에 1시간 이내 답변 시 우수 셀러 딱지가 부여됩니다."</p>
                            </div>
                        </div>
                        <button className="w-full mt-10 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-xl">
                            판매자 가이드 읽기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
