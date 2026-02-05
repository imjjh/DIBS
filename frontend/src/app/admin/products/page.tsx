"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/productService';
import { Product, ApiResponse, PagedResponse } from '@/types';
import {
    Package,
    Search,
    Filter,
    MoreVertical,
    Trash2,
    ExternalLink,
    Loader2,
    ShoppingBag,
    AlertCircle,
    Activity,
    Pencil
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await productService.getProducts();
            setProducts(data.items);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id: number) => {
        if (!confirm('정말 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
        try {
            await productService.deleteProduct(id);
            alert('상품이 삭제되었습니다.');
            fetchProducts();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900">Product Catalog</h2>
                    <p className="text-slate-500 font-medium mt-1">시스템에서 판매 중인 전체 상품 목록</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="상품명 또는 카테고리 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all w-64 text-slate-900 shadow-sm"
                        />
                    </div>
                    <button onClick={() => fetchProducts()} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary/50 transition-all shadow-sm">
                        <Activity className="w-5 h-4" />
                    </button>
                </div>
            </div>

            {/* Product Table Container */}
            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 space-y-8 relative overflow-hidden shadow-sm">
                <div className="relative z-10 overflow-x-auto min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-sm font-bold text-slate-300 uppercase tracking-[0.3em]">Loading Catalog...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-10 h-10 text-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl font-black text-slate-900">상품을 찾을 수 없습니다.</p>
                                <p className="text-slate-500 font-medium">검색어를 바꾸거나 새로운 상품이 등록될 때까지 기다려주세요.</p>
                            </div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <th className="px-6 pb-2">상품 정보</th>
                                    <th className="px-6 pb-2">카테고리</th>
                                    <th className="px-6 pb-2">가격</th>
                                    <th className="px-6 pb-2">재고</th>
                                    <th className="px-6 pb-2 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="group/row">
                                        <td className="bg-slate-50 rounded-l-3xl px-6 py-4 border-y border-l border-slate-100 group-hover/row:bg-slate-200/50 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white border border-slate-200 group-hover/row:border-primary/30 transition-all">
                                                    {product.imageUrl ? (
                                                        <Image
                                                            src={product.imageUrl}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-slate-200" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover/row:text-primary transition-colors">{product.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium font-mono tracking-tight">ID: {product.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="bg-slate-50 border-y border-slate-100 group-hover/row:bg-slate-200/50 transition-all">
                                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-tight text-slate-500 group-hover/row:text-primary transition-colors">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="bg-slate-50 border-y border-slate-100 group-hover/row:bg-slate-200/50 transition-all">
                                            <p className="font-black text-slate-900">{product.price.toLocaleString()}<span className="text-[10px] ml-0.5 text-slate-400 font-medium">원</span></p>
                                        </td>
                                        <td className="bg-slate-50 border-y border-slate-100 group-hover/row:bg-slate-200/50 transition-all">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    (product.stockQuantity ?? 0) > 10 ? "bg-emerald-500" : "bg-amber-500"
                                                )} />
                                                <span className="text-sm font-bold text-slate-600">{product.stockQuantity ?? 0}</span>
                                            </div>
                                        </td>
                                        <td className="bg-slate-50 rounded-r-3xl px-6 py-4 border-y border-r border-slate-100 group-hover/row:bg-slate-200/50 transition-all text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-all transform translate-x-2 group-hover/row:translate-x-0">
                                                <button
                                                    onClick={() => window.open(`/store/${product.id}`, '_blank')}
                                                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:shadow-lg transition-all"
                                                    title="View Product"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                                                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-500 hover:shadow-lg transition-all"
                                                    title="Edit Product"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-3 bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Danger Zone Note */}
            <div className="flex items-center gap-4 p-8 bg-red-50 border border-red-100 rounded-[2.5rem]">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h4 className="text-lg font-black text-red-600">Admin Policy</h4>
                    <p className="text-slate-500 text-sm font-medium">
                        관리자 권한으로 상품을 삭제할 경우 부적절한 상품이나 운영 정책 위반 사항에 대해서만 신중히 처리해주시기 바랍니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
