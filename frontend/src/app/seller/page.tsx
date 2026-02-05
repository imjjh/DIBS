"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Package,
    Plus,
    Search,
    ExternalLink,
    Edit2,
    Trash2,
    Eye,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { productService } from '@/services/productService';
import { useRouter } from 'next/navigation';

export default function SellerPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [totalElements, setTotalElements] = useState(0);
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
            setTotalElements(response.totalElements);
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
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900">Welcome back, {user?.nickname || user?.name}</h2>
                    <p className="text-slate-500 font-medium mt-1">등록하신 상품들을 관리하고 실시간 상태를 확인하세요.</p>
                </div>

                <Link href="/seller/products/new">
                    <button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] text-sm font-black shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all group">
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        새 상품 등록
                    </button>
                </Link>
            </div>

            {/* Content Card */}
            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 space-y-8 relative overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight text-slate-900">내 상품 목록</h3>
                            <p className="text-slate-400 text-sm font-medium">총 {totalElements}개의 상품이 등록되어 있습니다.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="상품명 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all min-w-[280px] text-slate-900"
                            />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 overflow-x-auto min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                            <p className="text-sm font-bold text-slate-300 uppercase tracking-[0.2em]">Listing products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center transform -rotate-12">
                                <Package className="w-12 h-12 text-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-slate-900 font-black text-xl">등록된 상품이 없습니다.</p>
                                <p className="text-slate-400 text-sm font-medium">첫 번째 상품을 등록하여 판매를 시작해보세요!</p>
                            </div>
                            <Link href="/seller/products/new">
                                <button className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
                                    상품 등록하러 가기
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full text-left border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
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
                                        <td className="bg-slate-50 rounded-l-3xl px-6 py-5 border-y border-l border-slate-100 group-hover/row:bg-slate-100 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden flex items-center justify-center p-2 border border-slate-200 group-hover/row:border-indigo-500/30 transition-all">
                                                    {product.imageUrl ? (
                                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-slate-200" />
                                                    )}
                                                </div>
                                                <Link href={`/seller/products/${product.id}`}>
                                                    <div>
                                                        <p className="font-bold text-slate-900 group-hover/row:text-indigo-600 transition-colors cursor-pointer">{product.name}</p>
                                                        <p className="text-xs text-slate-400 font-medium tracking-tight mt-1">ID: #{product.id}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="bg-slate-50 border-y border-slate-100 group-hover/row:bg-slate-100 transition-all">
                                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                {product.category || '기타'}
                                            </span>
                                        </td>
                                        <td className="bg-slate-50 border-y border-slate-100 group-hover/row:bg-slate-100 transition-all">
                                            <div className="space-y-1">
                                                <p className="font-black text-slate-900">{product.price.toLocaleString()}₩</p>
                                                <p className="text-[10px] font-bold text-slate-400">재고: {product.stockQuantity ?? 0}개</p>
                                            </div>
                                        </td>
                                        <td className="bg-slate-50 border-y border-slate-100 group-hover/row:bg-slate-100 transition-all">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                product.status === 'ON_SALE' && "bg-emerald-100 text-emerald-600",
                                                product.status === 'SOLD_OUT' && "bg-red-100 text-red-600",
                                                product.status === 'RESERVED' && "bg-amber-100 text-amber-600",
                                                product.status === 'PREPARING' && "bg-indigo-100 text-indigo-600",
                                            )}>
                                                {product.status === 'ON_SALE' && <CheckCircle2 className="w-3 h-3" />}
                                                {product.status === 'SOLD_OUT' && <AlertCircle className="w-3 h-3" />}
                                                {product.status === 'RESERVED' && <Clock className="w-3 h-3" />}
                                                {product.status === 'PREPARING' && <Loader2 className="w-3 h-3 animate-spin" />}
                                                {product.status}
                                            </div>
                                        </td>
                                        <td className="bg-slate-50 rounded-r-3xl px-6 py-5 border-y border-r border-slate-100 group-hover/row:bg-slate-100 transition-all text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => router.push(`/seller/products/${product.id}`)}
                                                    className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-white hover:text-indigo-600 hover:shadow-lg transition-all text-slate-400"
                                                    title="상세 인사이트"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/seller/products/${product.id}/edit`)}
                                                    className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-white hover:text-slate-900 hover:shadow-lg transition-all text-slate-400"
                                                    title="수정"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-3 bg-red-50 border border-red-100 rounded-xl hover:bg-red-600 transition-all text-red-500 hover:text-white shadow-sm"
                                                    title="삭제"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/store/${product.id}`}
                                                    className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-white transition-all text-slate-200 hover:text-slate-900 shadow-sm"
                                                    title="스토어에서 보기"
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
