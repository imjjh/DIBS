"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, Plus, Minus, ArrowLeft, Star, Heart, Share2, ShieldCheck, Zap, Truck, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { productService } from '@/services/productService';
import { Product, ProductStatus } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'details' | 'info' | 'reviews'>('details');

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                // In a real app, you would fetch by ID: productService.getProductById(Number(id))
                // For now, we'll mock it or find in the list
                const products = await productService.getProducts();
                const found = products.find(p => p.id === Number(id));
                setProduct(found || null);
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-black">상품을 찾을 수 없습니다.</h1>
                <Link href="/store" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold">
                    상점으로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    돌아가기
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left: Product Image */}
                    <div className="space-y-6">
                        <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-secondary/30 border border-border group">
                            {product.imageUrl ? (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground/20">
                                    <ShoppingBag className="w-32 h-32" />
                                </div>
                            )}

                            {/* Overlay Badges */}
                            <div className="absolute top-8 left-8 flex flex-col gap-2">
                                <span className="bg-primary text-primary-foreground text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-primary/20">
                                    New Arrival
                                </span>
                                {product.status === ProductStatus.SOLD_OUT && (
                                    <span className="bg-background text-foreground text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-xl">
                                        Sold Out
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Row (Mock) */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square rounded-2xl bg-secondary/50 border border-transparent hover:border-primary/50 transition-all cursor-pointer overflow-hidden">
                                    <div className="w-full h-full bg-muted/20 flex items-center justify-center text-muted-foreground/10">
                                        <ShoppingBag className="w-8 h-8" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="space-y-8 flex-1">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Premium Series</p>
                                    <div className="flex items-center gap-4">
                                        <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                                            <Heart className="w-6 h-6" />
                                        </button>
                                        <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                                            <Share2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                                <h1 className="text-5xl font-black tracking-tighter leading-tight">{product.name}</h1>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-muted-foreground">4.9 (124 reviews)</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Price</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-black text-foreground">{product.price.toLocaleString()}₩</span>
                                    <span className="text-lg text-muted-foreground line-through font-medium">{(product.price * 1.2).toLocaleString()}₩</span>
                                </div>
                            </div>

                            <div className="p-6 bg-secondary/30 rounded-3xl border border-border space-y-4">
                                <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                                    {product.description || "이 제품은 최상의 재료와 혁신적인 디자인으로 완성되었습니다. 사용자에게 차별화된 경험을 제공하며, 오직 DIBS에서만 선착순 혜택과 함께 만나보실 수 있습니다."}
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                        <Truck className="w-4 h-4 text-primary" />
                                        무료 배송
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                        <RotateCcw className="w-4 h-4 text-primary" />
                                        7일 이내 환불 가능
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                        100% 정품 인증
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Quantity</p>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-4 bg-secondary p-2 rounded-2xl border border-border">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="p-2 hover:bg-background rounded-xl transition-all shadow-sm"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>
                                        <span className="text-xl font-black w-10 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="p-2 hover:bg-background rounded-xl transition-all shadow-sm"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-sm font-bold text-muted-foreground">
                                        재고: <span className="text-foreground">{product.stockQuantity}개 남음</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-12">
                            <button className="flex-1 h-16 bg-primary text-primary-foreground font-black text-xl rounded-[2rem] hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3">
                                <Zap className="w-6 h-6 fill-current" />
                                바로 구매하기
                            </button>
                            <button className="flex-1 h-16 bg-secondary text-foreground font-black text-xl rounded-[2rem] border border-border hover:bg-secondary/80 transition-all active:scale-95 flex items-center justify-center gap-3">
                                <ShoppingBag className="w-6 h-6" />
                                장바구니 담기
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Tabs Section */}
                <div className="mt-24">
                    <div className="flex items-center gap-12 border-b border-border mb-12">
                        {['details', 'info', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={cn(
                                    "pb-6 text-sm font-black uppercase tracking-widest transition-all relative",
                                    activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-2" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="prose prose-invert max-w-none animate-in fade-in duration-700">
                        {activeTab === 'details' && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black tracking-tight">Product Insights</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                                    이 제품은 단순한 도구가 아닌 당신의 라이프스타일을 완성하는 파트너입니다.
                                    모든 디테일은 사용자의 편의성을 최우선으로 설계되었으며, 탁월한 내구성을 자랑합니다.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                                    <div className="rounded-[2rem] bg-secondary/20 p-10 border border-border">
                                        <h4 className="text-xl font-black mb-4">Core Materials</h4>
                                        <p className="text-muted-foreground">항공 등급의 알루미늄과 친환경 소재를 사용하여 가벼우면서도 단단한 구조를 유지합니다.</p>
                                    </div>
                                    <div className="rounded-[2rem] bg-secondary/20 p-10 border border-border">
                                        <h4 className="text-xl font-black mb-4">Eco-Friendly</h4>
                                        <p className="text-muted-foreground">지속 가능한 미래를 위해 재활용 가능한 패키지만을 사용하며 생산 과정에서의 탄소 배출을 최소화했습니다.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'info' && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-black tracking-tight">Shipping & Returns</h2>
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-border">
                                        <tr className="hover:bg-secondary/10 transition-colors">
                                            <th className="py-6 font-black text-muted-foreground uppercase text-xs tracking-widest">배송 기간</th>
                                            <td className="py-6 font-medium text-foreground">주문 후 2-3일 이내 (영업일 기준)</td>
                                        </tr>
                                        <tr className="hover:bg-secondary/10 transition-colors">
                                            <th className="py-6 font-black text-muted-foreground uppercase text-xs tracking-widest">반품 규정</th>
                                            <td className="py-6 font-medium text-foreground">제품 수령 후 7일 이내, 미사용 제품에 한함</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center opacity-20">
                                    <Star className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-foreground mb-2">첫 번째 리뷰를 남겨주세요!</p>
                                    <p className="text-sm text-muted-foreground font-medium">이 제품을 구매하신 후 생생한 사용기를 공유해주세요.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
