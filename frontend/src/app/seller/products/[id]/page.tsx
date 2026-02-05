"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Package,
    TrendingUp,
    Users,
    ShoppingCart,
    ArrowLeft,
    Edit3,
    Trash2,
    Eye,
    Heart,
    Clock,
    ChevronRight,
    Loader2,
    CheckCircle2,
    Truck,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { productService } from '@/services/productService';
import { ProductDetail, ProductStatus, OrderStatus } from '@/types';

// Mock Data for Insight
const MOCK_INSIGHT = {
    totalViews: 1240,
    viewChange: "+8%",
    totalLikes: 428,
    likeChange: "+12%",
    recentSales: 12,
    salesChange: "+2 today",
    salesLogs: [
        { id: 1, buyer: "Olivia R.", address: "123 Fashion Ave, NY", date: "2024.01.26 10:30 AM", status: OrderStatus.PAYMENT_COMPLETED, quantity: 1, price: 199000 },
        { id: 2, buyer: "Liam M.", address: "456 Style Blvd, LA", date: "2024.01.26 09:15 AM", status: OrderStatus.SHIPPING, quantity: 2, price: 398000 },
        { id: 3, buyer: "Sophia K.", address: "789 Trend St, Chicago", date: "2024.01.25 04:55 PM", status: OrderStatus.PAYMENT_COMPLETED, quantity: 1, price: 199000 },
        { id: 4, buyer: "Noah B.", address: "321 Vogue Ln, Miami", date: "2024.01.25 02:10 PM", status: OrderStatus.DELIVERED, quantity: 1, price: 199000 },
        { id: 5, buyer: "Ava W.", address: "654 Chic Rd, Seattle", date: "2024.01.24 08:45 AM", status: OrderStatus.PAYMENT_COMPLETED, quantity: 1, price: 199000 },
    ]
};

export default function ProductInsightPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('정말 이 상품을 삭제하시겠습니까?')) return;

        try {
            setIsDeleting(true);
            await productService.deleteProduct(id);
            alert('상품이 성공적으로 삭제되었습니다.');
            router.push('/seller');
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('상품 삭제 중 오류가 발생했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">Analyzing Product Data...</p>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigation & Actions */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group text-sm font-bold"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    BACK TO DASHBOARD
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push(`/seller/products/${id}/edit`)}
                        className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Edit3 className="w-4 h-4" />
                        상품 수정
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-6 py-2.5 bg-red-50 border border-red-100 text-red-500 rounded-xl text-sm font-black hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        삭제
                    </button>
                </div>
            </div>

            {/* Top Insight Card */}
            <div className="bg-white border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm">
                <div className="flex flex-col lg:flex-row">
                    {/* Left: Product Preview */}
                    <div className="lg:w-1/3 p-10 border-b lg:border-b-0 lg:border-r border-slate-100">
                        <div className="aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 relative group">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-16 h-16 text-slate-200" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="px-6 py-2 bg-white text-black text-xs font-black rounded-xl">미리보기</button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info & Stats Grid */}
                    <div className="flex-1 p-10 space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-tighter border border-indigo-100">
                                    {product.category || 'GENERAL'}
                                </span>
                                <div className={cn(
                                    "px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border",
                                    product.status === ProductStatus.ON_SALE ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"
                                )}>
                                    {product.status}
                                </div>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900">{product.name}</h1>
                            <p className="text-slate-500 font-medium max-w-2xl leading-relaxed text-lg italic mt-4">"{product.description}"</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-slate-100">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Price</p>
                                <p className="text-4xl font-black text-slate-900">{product.price.toLocaleString()}₩</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock status</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-slate-50 rounded-xl"><Package className="w-5 h-5 text-slate-400" /></div>
                                    <p className="text-4xl font-black text-slate-900">{product.stockQuantity || 0} pieces</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
