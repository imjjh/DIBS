"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ShoppingCart,
    Zap,
    ArrowLeft,
    ShieldCheck,
    Truck,
    Clock,
    ShoppingBag,
    Plus,
    Minus,
    Heart,
    Share2,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { productService } from '@/services/productService';
import { cartService } from '@/services/cartService';
import { orderService, OrderCreateRequest } from '@/services/orderService';
import { useAuthStore } from '@/store/useAuthStore';
import { AddressInput, ShippingInfo } from '@/components/common/AddressInput';
import { ProductDetail, ProductStatus } from '@/types';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const id = Number(params.id);

    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'qna'>('info');

    const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        recipientName: '',
        recipientPhone: '',
        zipCode: '',
        shippingAddress: '',
        shippingAddressDetail: '',
        deliveryMemo: ''
    });

    useEffect(() => {
        if (user) {
            setShippingInfo((prev: ShippingInfo) => ({
                ...prev,
                recipientName: user.nickname || user.name || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
                // router.push('/store');
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const handleQuantityChange = (type: 'plus' | 'minus') => {
        if (type === 'plus') {
            if (product && quantity < (product.stockQuantity || 99)) setQuantity(prev => prev + 1);
        } else {
            if (quantity > 1) setQuantity(prev => prev - 1);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddToCart = async () => {
        if (!product || isSubmitting) return;
        if (!isAuthenticated) {
            alert('로그인이 필요한 서비스입니다.');
            router.push('/login');
            return;
        }

        try {
            setIsSubmitting(true);
            await cartService.addToCart(product.id, quantity);

            // confirm 사용 시 브라우저 멈춤 현상 방지를 위해 setTimeout이나 
            // 렌더링 사이클 외부에서 호출하는 것이 안전할 때가 있습니다.
            const move = window.confirm(`${product.name} ${quantity}개가 장바구니에 담겼습니다.\n장바구니로 이동하시겠습니까?`);
            if (move) {
                router.push('/cart');
            }
        } catch (error: any) {
            console.error("Cart Error Details:", error.response?.data || error.message);
            const message = error.response?.status === 401
                ? "로그인 세션이 만료되었습니다. 다시 로그인해주세요."
                : (error.response?.data?.message || "장바구니 담기에 실패했습니다.");
            alert(message);
            if (error.response?.status === 401) router.push('/login');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBuyNow = () => {
        if (!product || isSubmitting) return;
        if (!isAuthenticated) {
            alert('로그인이 필요한 서비스입니다.');
            router.push('/login');
            return;
        }
        setIsBuyNowModalOpen(true);
    };

    const handleBuyNowSubmit = async () => {
        if (!product || isSubmitting) return;

        // Validation
        if (!shippingInfo.recipientName || !shippingInfo.recipientPhone || !shippingInfo.shippingAddress || !shippingInfo.zipCode) {
            alert('배송 정보를 모두 입력해주세요.');
            return;
        }

        try {
            setIsSubmitting(true);
            const orderRequest: OrderCreateRequest = {
                ...shippingInfo,
                orderItems: [{
                    productId: product.id,
                    quantity: quantity
                }]
            };

            await orderService.createOrder(orderRequest);
            alert('주문이 성공적으로 완료되었습니다!');
            setIsBuyNowModalOpen(false);
            router.push('/mypage');
        } catch (error: any) {
            console.error("Order Error:", error.response?.data || error.message);
            alert("주문 중 오류가 발생했습니다.\n" + (error.response?.data?.message || "다시 시도해주세요."));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="font-black text-muted-foreground uppercase tracking-widest text-sm">Fetching Product Details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
                <div className="w-24 h-24 bg-secondary rounded-[3rem] flex items-center justify-center rotate-12">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-20" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">상품을 찾을 수 없습니다.</h2>
                <button
                    onClick={() => router.push('/store')}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-black"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    const discountedPrice = product.discountRate ? product.price * (1 - product.discountRate / 100) : product.price;

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-black hover:text-primary transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        BACK TO STORE
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="p-3 hover:bg-secondary rounded-2xl transition-all text-muted-foreground hover:text-foreground">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-3 hover:bg-secondary rounded-2xl transition-all text-muted-foreground hover:text-foreground">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Left: Product Image Gallery */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="aspect-[4/5] bg-secondary rounded-[3.5rem] overflow-hidden border border-border group relative">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                                    <ShoppingBag className="w-24 h-24" />
                                </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-8 left-8 flex flex-col gap-3">
                                {product.discountRate !== undefined && product.discountRate > 0 && (
                                    <div className="px-5 py-2 bg-red-600 text-white text-xs font-black rounded-2xl tracking-widest shadow-2xl">
                                        {product.discountRate}% OFF
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right: Product Info & Actions */}
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-tighter border border-primary/20">
                                    {product.category || 'GENERAL'}
                                </span>
                                <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Seller: {product.sellerName}</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-foreground">
                                {product.name}
                            </h1>
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed opacity-70">
                                {product.description || '상품 상세 설명이 등록되지 않았습니다.'}
                            </p>
                        </div>

                        {/* Price & Status */}
                        <div className="p-10 bg-secondary/20 rounded-[3rem] border border-border space-y-8">
                            <div className="flex items-end justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        {product.discountRate !== undefined && product.discountRate > 0 && (
                                            <span className="text-xl font-bold text-red-500 line-through opacity-50">
                                                {product.price.toLocaleString()}₩
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-5xl font-black tracking-tighter">
                                        {discountedPrice.toLocaleString()} <span className="text-2xl">원</span>
                                    </p>
                                </div>
                                <div className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg",
                                    product.status === ProductStatus.ON_SALE ? "bg-emerald-500 text-white" :
                                        product.status === ProductStatus.PREPARING ? "bg-blue-500 text-white" :
                                            product.status === ProductStatus.RESERVED ? "bg-amber-500 text-white" : "bg-red-500 text-white"
                                )}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    {product.status === ProductStatus.ON_SALE ? 'ON SALE' :
                                        product.status === ProductStatus.PREPARING ? 'PREPARING' :
                                            product.status === ProductStatus.RESERVED ? 'RESERVED' : 'SOLD OUT'}
                                </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="pt-8 border-t border-border/50 flex items-center justify-between">
                                <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">Quantity</span>
                                <div className="flex items-center bg-background rounded-2xl border border-border p-1">
                                    <button
                                        onClick={() => handleQuantityChange('minus')}
                                        className="p-2.5 hover:bg-secondary rounded-xl transition-all disabled:opacity-20"
                                        disabled={quantity <= 1 || product.status !== ProductStatus.ON_SALE}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange('plus')}
                                        className="p-2.5 hover:bg-secondary rounded-xl transition-all disabled:opacity-20"
                                        disabled={product.status !== ProductStatus.ON_SALE}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground/60">
                                <Clock className="w-4 h-4" />
                                <span>남은 수량: <span className="text-foreground tracking-tighter">{product.stockQuantity || 0}</span>개</span>
                                <span className="w-1 h-1 bg-border rounded-full" />
                                {product.status === ProductStatus.ON_SALE ? (
                                    <span>현재 구매 가능한 상품입니다.</span>
                                ) : (
                                    <span>현재 구매가 불가능한 상태입니다.</span>
                                )}
                            </div>
                        </div>

                        {/* Buy Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart();
                                }}
                                disabled={product.status !== ProductStatus.ON_SALE || isSubmitting}
                                className="h-20 bg-secondary border border-border text-foreground font-black text-xl rounded-[2rem] hover:bg-secondary/80 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {isSubmitting ? 'Adding...' : product.status === ProductStatus.ON_SALE ? 'Add to Cart' : 'Not Available'}
                            </button>

                            <button
                                onClick={handleBuyNow}
                                disabled={product.status !== ProductStatus.ON_SALE || isSubmitting}
                                className="h-20 bg-primary text-primary-foreground font-black text-xl rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-20 disabled:scale-100"
                            >
                                <Zap className="w-6 h-6 fill-current" />
                                {product.status === ProductStatus.ON_SALE ? 'Buy It Now' :
                                    product.status === ProductStatus.PREPARING ? 'Coming Soon' : 'Sold Out'}
                            </button>
                        </div>

                    </div>
                </div>

                {/* Bottom Details Tabs */}
                <div className="mt-32 border-t border-border pt-12">
                    <div className="flex gap-12 mb-12 overflow-x-auto pb-4 scrollbar-hide">
                        {(['info', 'reviews', 'qna'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "text-2xl font-black tracking-tight whitespace-nowrap transition-all relative",
                                    activeTab === tab ? "text-foreground" : "text-muted-foreground/30 hover:text-muted-foreground"
                                )}
                            >
                                {tab === 'info' && 'Product Info'}
                                {tab === 'reviews' && 'Reviews (0)'}
                                {tab === 'qna' && 'Q&A (0)'}
                                {activeTab === tab && <div className="absolute -bottom-4 left-0 right-0 h-1 bg-primary rounded-full" />}
                            </button>
                        ))}
                    </div>

                    <div className="bg-secondary/10 p-12 rounded-[3.5rem] border border-border min-h-[400px]">
                        {activeTab === 'info' ? (
                            <div className="max-w-4xl space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 font-medium text-muted-foreground text-lg leading-relaxed">
                                    <div className="space-y-6">
                                        <h4 className="text-foreground font-black text-xl">디입스 전용 케어 서비스</h4>
                                        <p>DIBS!에서 구매하신 모든 상품은 전문가의 철저한 검수를 거쳐 배송됩니다.</p>
                                        <ul className="space-y-4">
                                            <li className="flex gap-3">
                                                <div className="w-2 h-2 mt-2 bg-primary rounded-full shrink-0" />
                                                <span>프리미엄 슈케어 / 의류 관리 솔루션 제공</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <div className="w-2 h-2 mt-2 bg-primary rounded-full shrink-0" />
                                                <span>100% 정품 인증 DIBS! 택(Tag) 부착</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="space-y-6">
                                        <h4 className="text-foreground font-black text-xl">배송 및 교환 안내</h4>
                                        <p>선착순 상품의 특성상 결제 완료 후에는 주소지 변경이 어려울 수 있습니다.</p>
                                        <p>배송은 영업일 기준 3-5일 소요되며, 검수가 지연될 경우 별도의 안내를 드립니다.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30 space-y-4">
                                <Clock className="w-12 h-12" />
                                <p className="font-bold">아직 등록된 정보가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Buy Now Modal */}
            {isBuyNowModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black tracking-tight">배송지 입력</h2>
                            <button
                                onClick={() => setIsBuyNowModalOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="space-y-8">
                            <AddressInput
                                value={shippingInfo}
                                onChange={setShippingInfo}
                            />

                            <div className="flex gap-4 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => setIsBuyNowModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-900 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleBuyNowSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                    {isSubmitting ? '처리중...' : '주문하기'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
