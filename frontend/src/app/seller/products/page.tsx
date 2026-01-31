"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Package,
    Plus,
    Search,
    Filter,
    MoreVertical,
    ExternalLink,
    Edit2,
    Trash2,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from '@/lib/axios';
import { Product, ProductListResponse } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { productService } from '@/services/productService';
import { useRouter } from 'next/navigation';

export default function SellerProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchMyProducts = async () => {
        try {
            setIsLoading(true);
            const response = await productService.getSellerProducts({
                keyword: debouncedSearch || undefined,
                size: 100
            });
            setProducts(response.items);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMyProducts();
    }, [user, debouncedSearch]);

    const handleDelete = async (id: number) => {
        if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) return;
        try {
            await productService.deleteProduct(id);
            alert('상품이 삭제되었습니다.');
            fetchMyProducts();
        } catch (error: any) {
            console.error('Delete failed:', error);
            alert(error.response?.data?.message || '상품 삭제에 실패했습니다.');
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-white">Product Management</h2>
                    <p className="text-white/40 font-medium mt-1">등록하신 상품들을 관리하고 실시간 상태를 확인하세요.</p>
                </div>

                <Link href="/seller/products/new">
                    <button className="flex items-center gap-2 px-8 py-4 bg-indigo-500 text-white rounded-[2rem] text-sm font-black shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all group">
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        새 상품 등록
                    </button>
                </Link>
            </div>

            {/* Content Card */}
            <div className="bg-[#0f0f12] border border-white/5 rounded-[3rem] p-10 space-y-8 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight text-white">내 상품 목록</h3>
                            <p className="text-white/40 text-sm font-medium">총 {products.length}개의 상품이 등록되어 있습니다.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                placeholder="상품명 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all min-w-[280px]"
                            />
                        </div>
                        <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-white/40 hover:text-white transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="relative z-10 overflow-x-auto min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                            <p className="text-sm font-bold text-white/20 uppercase tracking-[0.2em]">Listing products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center transform -rotate-12">
                                <Package className="w-12 h-12 text-white/10" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-white font-black text-xl">등록된 상품이 없습니다.</p>
                                <p className="text-white/30 text-sm font-medium">첫 번째 상품을 등록하여 판매를 시작해보세요!</p>
                            </div>
                            <Link href="/seller/products/new">
                                <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all">
                                    상품 등록하러 가기
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full text-left border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <th className="px-6 pb-2">상품 정보</th>
                                    <th className="px-6 pb-2">카테고리</th>
                                    <th className="px-6 pb-2">가격 / 재고</th>
                                    <th className="px-6 pb-2">상태</th>
                                    <th className="px-6 pb-2 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="group/row">
                                        <td className="bg-white/[0.02] rounded-l-3xl px-6 py-5 border-y border-l border-white/5 group-hover/row:bg-white/[0.04] transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden flex items-center justify-center p-2 border border-white/5">
                                                    {product.imageUrl ? (
                                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-white/20" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover/row:text-indigo-400 transition-colors">{product.name}</p>
                                                    <p className="text-xs text-white/30 font-medium tracking-tight mt-1">ID: #{product.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="bg-white/[0.02] border-y border-white/5 group-hover/row:bg-white/[0.04] transition-all">
                                            <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/60">
                                                {product.category || '기타'}
                                            </span>
                                        </td>
                                        <td className="bg-white/[0.02] border-y border-white/5 group-hover/row:bg-white/[0.04] transition-all">
                                            <div className="space-y-1">
                                                <p className="font-black text-white">{product.price.toLocaleString()}₩</p>
                                                <p className="text-[10px] font-bold text-white/40">재고: {product.stockQuantity ?? 0}개</p>
                                            </div>
                                        </td>
                                        <td className="bg-white/[0.02] border-y border-white/5 group-hover/row:bg-white/[0.04] transition-all">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                product.status === 'ON_SALE' && "bg-emerald-500/10 text-emerald-500",
                                                product.status === 'SOLD_OUT' && "bg-red-500/10 text-red-500",
                                                product.status === 'RESERVED' && "bg-amber-500/10 text-amber-500",
                                                product.status === 'PREPARING' && "bg-blue-500/10 text-blue-500",
                                            )}>
                                                {product.status === 'ON_SALE' && <CheckCircle2 className="w-3 h-3" />}
                                                {product.status === 'SOLD_OUT' && <AlertCircle className="w-3 h-3" />}
                                                {product.status === 'RESERVED' && <Clock className="w-3 h-3" />}
                                                {product.status === 'PREPARING' && <Loader2 className="w-3 h-3 animate-spin" />}
                                                {product.status}
                                            </div>
                                        </td>
                                        <td className="bg-white/[0.02] rounded-r-3xl px-6 py-5 border-y border-r border-white/5 group-hover/row:bg-white/[0.04] transition-all text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => router.push(`/seller/products/${product.id}/edit`)}
                                                    className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 transition-all text-white/60 hover:text-white"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500 hover:border-red-500 transition-all text-red-500 hover:text-white"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/store/${product.id}`}
                                                    className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all text-white/20 hover:text-white"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
