"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { productService } from '@/services/productService';
import { imageService } from '@/services/imageService';
import { ProductStatus } from '@/types';
import { useRef } from 'react';

export default function AdminEditProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        category: 'SHOES',
        imageUrl: '',
        status: 'ON_SALE' as ProductStatus
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

    const statuses = [
        { value: 'PREPARING', label: '준비 중', color: 'blue' },
        { value: 'ON_SALE', label: '판매 중', color: 'emerald' },
        { value: 'RESERVED', label: '예약 중', color: 'amber' },
        { value: 'SOLD_OUT', label: '품절', color: 'red' },
    ];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const product = await productService.getProductById(id);
                const categoryMapping: Record<string, string> = {
                    'SHOES': '신발',
                    'CLOTHING': '의류',
                    'ACC': '액세서리',
                    'ELECTRONICS': '디지털',
                    'OTHER': '기타'
                };
                const mappedCategory = (product.category ? categoryMapping[product.category] : null) || product.category || '기타';

                setFormData({
                    name: product.name,
                    description: product.description || '',
                    price: product.price.toString(),
                    stockQuantity: product.stockQuantity?.toString() || '0',
                    category: mappedCategory,
                    imageUrl: product.imageUrl || '',
                    status: product.status
                });
            } catch (error) {
                console.error('Failed to fetch product:', error);
                alert('상품 정보를 불러오는데 실패했습니다.');
                router.push('/admin/products');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id, router]);

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
            setIsSaving(true);

            let finalImageUrl = formData.imageUrl;

            if (selectedFile) {
                finalImageUrl = await imageService.uploadImage(selectedFile);
            }

            const payload = {
                ...formData,
                imageUrl: finalImageUrl,
                price: Number(formData.price),
                stockQuantity: Number(formData.stockQuantity)
            };
            await productService.updateProduct(id, payload as any);
            alert('상품 정보가 수정되었습니다!');
            router.push('/admin/products');
        } catch (error: any) {
            console.error('Update failed:', error);
            const message = error.response?.data?.message || '상품 수정에 실패했습니다.';
            alert(message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-64 space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">상품 데이터를 불러오고 있습니다...</p>
            </div>
        );
    }

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
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900">상품 정보 수정 (Admin)</h2>
                    <p className="text-slate-500 font-medium">관리자 권한으로 상품 정보를 수정합니다.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                {/* Left: Image & Status */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-8 sticky top-8 shadow-sm">
                        {/* Status Selection */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">판매 상태 설정</h3>
                            <div className="flex flex-col gap-2">
                                {statuses.map((s) => (
                                    <button
                                        key={s.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, status: s.value as ProductStatus }))}
                                        className={cn(
                                            "flex items-center justify-between px-5 py-4 rounded-2xl border transition-all",
                                            formData.status === s.value
                                                ? `bg-${s.color}-50 border-${s.color}-200 text-${s.color}-600 shadow-sm`
                                                : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                                        )}
                                    >
                                        <span className="text-sm font-black">{s.label}</span>
                                        {formData.status === s.value && <CheckCircle2 className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">상품 이미지</h3>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-4 group hover:border-indigo-500/30 hover:bg-slate-100 transition-all relative overflow-hidden cursor-pointer"
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
                                        <Upload className="w-8 h-8 opacity-10" />
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-400">클릭하여 이미지 업로드</p>
                                        </div>
                                    </>
                                )}
                            </div>
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

                {/* Right: Details Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border border-slate-200 rounded-[3rem] p-10 space-y-10 shadow-sm">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-xl">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">상세 정보 수정</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">상품명</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">상세 설명</label>
                                    <textarea
                                        required
                                        rows={6}
                                        className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none leading-relaxed text-sm"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 pt-10 border-t border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">판매가 (₩)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="number"
                                            required
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono"
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
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono"
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
                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                                        : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                                                )}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                                수정사항 저장하기
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-10 py-5 bg-white border border-slate-200 rounded-[2rem] font-bold text-slate-400 hover:bg-slate-50 transition-all shadow-sm"
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
