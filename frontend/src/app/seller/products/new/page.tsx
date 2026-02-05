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
import { productService } from '@/services/productService';
import { imageService } from '@/services/imageService';
import { useRef } from 'react';

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        category: 'SHOES',
        imageUrl: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);



    const categories = [
        { value: '신발', label: '신발' },
        { value: '의류', label: '의류' },
        { value: '액세서리', label: '액세서리' },
        { value: '디지털', label: '디지털' },
        { value: '기타', label: '기타' },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 용량 체크 (5MB 제한)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('파일 크기가 너무 큽니다. 5MB 이하의 이미지만 업로드 가능합니다.');
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            let finalImageUrl = formData.imageUrl;

            // If a file is selected, upload it first
            if (selectedFile) {
                finalImageUrl = await imageService.uploadImage(selectedFile);
            }

            if (!finalImageUrl) {
                alert('이미지를 등록해주세요.');
                return;
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                imageUrl: finalImageUrl,
                price: Number(formData.price),
                stockQuantity: Number(formData.stockQuantity)
            };
            await productService.createProduct(payload as any);
            alert('상품이 성공적으로 등록되었습니다!');
            router.push('/seller/products');
        } catch (error: any) {
            console.error('Registration failed:', error);
            const message = error.response?.data?.message || '상품 등록에 실패했습니다.';
            alert(message);
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
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">목록으로 돌아가기</span>
                    </button>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900">신규 상품 등록</h2>
                    <p className="text-slate-500 font-medium">새로운 상품의 상세 정보와 이미지를 등록하세요.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                {/* Left: Image Upload & Preview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-6 sticky top-8 shadow-sm">
                        <div className="space-y-2">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-indigo-600" />
                                상품 이미지
                            </h3>
                            <p className="text-slate-400 text-xs font-medium">고해상도 이미지를 사용하면 판매율이 높아집니다.</p>
                        </div>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-4 group hover:border-indigo-500/30 hover:bg-slate-100 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            {(previewUrl || formData.imageUrl) ? (
                                <>
                                    <img src={previewUrl || formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreviewUrl('');
                                            setSelectedFile(null);
                                            setFormData(prev => ({ ...prev, imageUrl: '' }));
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all shadow-sm">
                                        <Upload className="w-8 h-8 opacity-30" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-black text-slate-400">이미지 업로드</p>
                                        <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-widest">JPG, PNG up to 5MB</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <p className="text-[10px] font-bold text-slate-500 lowercase">깔끔한 배경의 사진을 권장합니다</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <p className="text-[10px] font-bold text-slate-500 lowercase">다양한 각도의 사진을 추가하면 좋습니다</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Product Details Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border border-slate-200 rounded-[3rem] p-10 space-y-10 shadow-sm">
                        {/* Section: Basic Info */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-xl">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">기본 정보</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">상품명</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="상세한 상품명을 입력하세요 (예: DIBS! 한정판 블랙 스니커즈)"
                                        className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">상품 설명</label>
                                    <textarea
                                        required
                                        rows={6}
                                        placeholder="상품의 특징, 소재, 사이즈 정보 등을 자세히 적어주세요."
                                        className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-slate-700 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none leading-relaxed text-sm"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Pricing & Category */}
                        <div className="space-y-8 pt-10 border-t border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 rounded-xl">
                                    <Layers className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">가격 및 재고 정보</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">판매가 (₩)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="number"
                                            required
                                            placeholder="0"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-black placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-mono"
                                            value={formData.price}
                                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">재고 수량</label>
                                    <div className="relative">
                                        <Package className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="number"
                                            required
                                            placeholder="0"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-black placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono"
                                            value={formData.stockQuantity}
                                            onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">카테고리</label>
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.value}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                                                className={cn(
                                                    "px-2 py-4 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all shadow-sm",
                                                    formData.category === cat.value
                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]"
                                                        : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-900"
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
                                className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
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
                                className="px-10 py-5 bg-white border border-slate-200 rounded-[2rem] font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all"
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
