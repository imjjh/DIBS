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
                <p className="text-xs font-black text-white/20 uppercase tracking-[0.2em]">Analyzing Product Data...</p>
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
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group text-sm font-bold"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    BACK TO DASHBOARD
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push(`/seller/products/${id}/edit`)}
                        className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-black hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                        <Edit3 className="w-4 h-4" />
                        상품 수정
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-6 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-black hover:bg-red-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        삭제
                    </button>
                </div>
            </div>

            {/* Top Insight Card */}
            <div className="bg-[#0f0f12] border border-white/5 rounded-[3.5rem] overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    {/* Left: Product Preview */}
                    <div className="lg:w-1/3 p-10 border-b lg:border-b-0 lg:border-r border-white/5">
                        <div className="aspect-square bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/5 relative group">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-16 h-16 text-white/10" />
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
                                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-lg uppercase tracking-tighter border border-indigo-500/20">
                                    {product.category || 'GENERAL'}
                                </span>
                                <div className={cn(
                                    "px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border",
                                    product.status === ProductStatus.ON_SALE ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-white/5 text-white/40 border-white/5"
                                )}>
                                    {product.status}
                                </div>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">{product.name}</h1>
                            <p className="text-white/40 font-medium max-w-2xl leading-relaxed">{product.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Total Views</p>
                                    <span className="text-emerald-400 text-[10px] font-black flex items-center gap-1">
                                        {MOCK_INSIGHT.viewChange} <TrendingUp className="w-3 h-3" />
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white/5 rounded-xl"><Eye className="w-5 h-5 text-indigo-400" /></div>
                                    <p className="text-3xl font-black">{MOCK_INSIGHT.totalViews.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Total Likes</p>
                                    <span className="text-emerald-400 text-[10px] font-black flex items-center gap-1">
                                        {MOCK_INSIGHT.likeChange} <TrendingUp className="w-3 h-3" />
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white/5 rounded-xl"><Heart className="w-5 h-5 text-pink-400" /></div>
                                    <p className="text-3xl font-black">{MOCK_INSIGHT.totalLikes.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Recent Sales</p>
                                    <span className="text-emerald-400 text-[10px] font-black flex items-center gap-1">
                                        {MOCK_INSIGHT.salesChange}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white/5 rounded-xl"><ShoppingCart className="w-5 h-5 text-emerald-400" /></div>
                                    <p className="text-3xl font-black">{MOCK_INSIGHT.recentSales.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Table Section */}
            <div className="bg-[#0f0f12] border border-white/5 rounded-[3rem] p-10 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black tracking-tight">RECENT SALES LOG</h3>
                        <p className="text-xs font-bold text-white/20 uppercase tracking-[0.2em]">내 상품의 최근 거래 내역</p>
                    </div>
                    <button className="px-5 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black hover:bg-white/10 transition-all uppercase tracking-widest">Download CSV</button>
                </div>

                <div className="overflow-x-auto overflow-visible">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 pb-4">
                                <th className="pb-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Buyer</th>
                                <th className="pb-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Address</th>
                                <th className="pb-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Price / Qty</th>
                                <th className="pb-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Date</th>
                                <th className="pb-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_INSIGHT.salesLogs.map((log) => (
                                <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-6 pr-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-black">
                                                {log.buyer[0]}
                                            </div>
                                            <span className="font-bold text-sm">{log.buyer}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 pr-6">
                                        <span className="text-xs font-medium text-white/60">{log.address}</span>
                                    </td>
                                    <td className="py-6 pr-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black">{log.price.toLocaleString()}₩</p>
                                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{log.quantity} pieces</p>
                                        </div>
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="text-[10px] font-black text-white/40">{log.date}</span>
                                    </td>
                                    <td className="py-6 text-right px-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                            log.status === OrderStatus.PAYMENT_COMPLETED ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                log.status === OrderStatus.SHIPPING ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                                                    log.status === OrderStatus.DELIVERED ? "bg-white/10 text-white border-white/20" :
                                                        "bg-white/5 text-white/30 border-white/5"
                                        )}>
                                            {log.status === OrderStatus.PAYMENT_COMPLETED && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                                            {log.status === OrderStatus.SHIPPING && <Truck className="w-3 h-3" />}
                                            {log.status === OrderStatus.DELIVERED && <CheckCircle2 className="w-3 h-3" />}
                                            {log.status}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Showing 5 of {MOCK_INSIGHT.recentSales} sales</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 border border-white/5 rounded-lg text-white/20 hover:text-white transition-colors" disabled><ChevronRight className="w-4 h-4 rotate-180" /></button>
                        <button className="p-2 border border-white/5 rounded-lg text-white/20 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
