"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Upload,
    Image as ImageIcon,
    Package,
    DollarSign,
    Layers,
    FileText,
    Save,
    X,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from '@/lib/axios';

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        category: 'SHOES',
        imageUrl: ''
    });

    const categories = [
        { value: 'SHOES', label: '신발 / 스니커즈' },
        { value: 'CLOTHING', label: '의류 / 패션' },
        { value: 'ACC', label: '액세서리' },
        { value: 'ELECTRONICS', label: '전자제품' },
        { value: 'OTHER', label: '기타' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            // In real world: await axios.post('/seller/products', formData);
            // Since we can't touch backend, we'll simulate success for UI demo
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert('상품이 성공적으로 등록되었습니다! (UI 시뮬레이션)');
            router.push('/seller/products');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('상품 등록에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Back to list</span>
                    </button>
                    <h2 className="text-4xl font-black tracking-tighter text-white">Register New Product</h2>
                    <p className="text-white/40 font-medium">새로운 상품의 상세 정보와 이미지를 등록하세요.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                {/* Left: Image Upload & Preview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0f0f12] border border-white/5 rounded-[2.5rem] p-8 space-y-6 sticky top-8">
                        <div className="space-y-2">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-indigo-400" />
                                Product Image
                            </h3>
                            <p className="text-white/30 text-xs font-medium">고해상도 이미지를 사용하면 판매율이 높아집니다.</p>
                        </div>

                        <div className="aspect-square rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-4 group hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all cursor-pointer relative overflow-hidden">
                            {formData.imageUrl ? (
                                <>
                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, imageUrl: '' })) }}
                                        className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all">
                                        <Upload className="w-8 h-8 opacity-30" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-black text-white/60">이미지 업로드</p>
                                        <p className="text-[10px] text-white/20 mt-1 uppercase tracking-widest">JPG, PNG up to 5MB</p>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="이미지 URL 입력 (데모용)"
                                        className="absolute bottom-4 left-4 right-4 px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-[10px] font-bold text-white focus:outline-none focus:border-indigo-500 transition-all"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </>
                            )}
                        </div>

                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <p className="text-[10px] font-bold text-white/60 lowercase">Clean Background preferred</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <p className="text-[10px] font-bold text-white/60 lowercase">Multiple angles recommended</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Product Details Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#0f0f12] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl">
                        {/* Section: Basic Info */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-xl">
                                    <FileText className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-black text-white">Basic Information</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="상세한 상품명을 입력하세요 (예: DIBS! 한정판 블랙 스니커즈)"
                                        className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white font-bold placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Description</label>
                                    <textarea
                                        required
                                        rows={6}
                                        placeholder="상품의 특징, 소재, 사이즈 정보 등을 자세히 적어주세요."
                                        className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-3xl text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none leading-relaxed text-sm"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Pricing & Category */}
                        <div className="space-y-8 pt-10 border-t border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl">
                                    <Layers className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-black text-white">Pricing & Logistics</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Price (₩)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="number"
                                            required
                                            placeholder="0"
                                            className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white font-black placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30 transition-all font-mono"
                                            value={formData.price}
                                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Stock Quantity</label>
                                    <div className="relative">
                                        <Package className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="number"
                                            required
                                            placeholder="0"
                                            className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white font-black placeholder:text-white/20 focus:outline-none focus:border-indigo-500/30 transition-all font-mono"
                                            value={formData.stockQuantity}
                                            onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Category</label>
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.value}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                                                className={cn(
                                                    "px-2 py-4 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all",
                                                    formData.category === cat.value
                                                        ? "bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]"
                                                        : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                                                )}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-10 flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-5 bg-indigo-500 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        처리 중...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-6 h-6" />
                                        상품 등록하기
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-10 py-5 bg-white/5 border border-white/5 rounded-[2rem] font-bold text-white/40 hover:bg-white/10 hover:text-white transition-all"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
