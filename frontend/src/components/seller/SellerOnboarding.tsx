"use client";

import { useState, useEffect } from 'react';
import { Store, ChevronRight, Loader2, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { sellerService } from '@/services/sellerService';
import { SellerApplication, ApplicationStatus } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SellerOnboarding() {
    const { user, checkAuth } = useAuthStore();
    const router = useRouter();
    const [status, setStatus] = useState<SellerApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form states
    const [businessName, setBusinessName] = useState('');
    const [businessNumber, setBusinessNumber] = useState('');
    const [error, setError] = useState('');

    const fetchStatus = async () => {
        try {
            const data = await sellerService.getMyApplication();
            setStatus(data);
        } catch (err) {
            console.error("판매자 신청 내역이 없습니다.");
            setStatus(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.roles.includes('ROLE_SELLER')) {
            setLoading(false);
            return;
        }
        fetchStatus();
    }, [user]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!businessName || !businessNumber) {
            setError('모든 정보를 입력해주세요.');
            return;
        }

        setIsApplying(true);
        setError('');
        try {
            await sellerService.apply({ businessName, businessNumber });
            await fetchStatus();
            setShowForm(false);
        } catch (err: any) {
            setError(err.response?.data?.message || '신청 중 오류가 발생했습니다.');
        } finally {
            setIsApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-secondary/20 rounded-[3rem] p-10 flex items-center justify-center min-h-[200px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Case 1: Already a Seller
    if (user?.roles.includes('ROLE_SELLER')) {
        return (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                    <CheckCircle2 className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <div className="p-3 bg-white/20 w-fit rounded-2xl mb-6 backdrop-blur-md">
                        <Store className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-black mb-3 tracking-tighter">판매자 활성화 완료!</h2>
                    <p className="text-white/80 text-sm font-black mb-10 leading-relaxed italic">
                        "판매자로 승인되셨습니다. <br />지금 바로 DIBS! 스토어에 상품을 등록해보세요."
                    </p>
                    <button
                        onClick={() => router.push('/seller')}
                        className="w-full py-5 bg-white text-teal-700 font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-black/20"
                    >
                        판매자 센터 바로가기 <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    }

    // Case 2: Pending Application
    if (status?.status === '대기 중') {
        return (
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform duration-700">
                    <Clock className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <div className="p-3 bg-white/20 w-fit rounded-2xl mb-6 backdrop-blur-md">
                        <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-black mb-3 tracking-tighter">심사가 진행 중입니다</h2>
                    <p className="text-white/80 text-sm font-black mb-6 leading-relaxed">
                        승인까지 보통 1~2일 정도 소요됩니다. <br />관리자가 신청하신 정보를 꼼꼼히 검토 중입니다.
                    </p>
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-4 text-xs">
                        <p className="font-bold opacity-70 mb-1 leading-none uppercase tracking-tighter">사업자 정보</p>
                        <p className="font-black text-sm">{status.businessName} ({status.businessNumber})</p>
                    </div>
                    <button disabled className="w-full py-5 bg-white/10 border border-white/30 text-white font-black rounded-2xl cursor-not-allowed opacity-50">
                        심사 대기 중...
                    </button>
                </div>
            </div>
        );
    }

    // Case 3: Rejected Application
    if (status?.status === '거절') {
        return (
            <div className="bg-gradient-to-br from-rose-500 to-red-700 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform duration-700">
                    <AlertCircle className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <div className="p-3 bg-white/20 w-fit rounded-2xl mb-6 backdrop-blur-md">
                        <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-black mb-3 tracking-tighter">신청이 거절되었습니다</h2>
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-8">
                        <p className="text-xs font-bold opacity-70 mb-2 uppercase tracking-tight">거절 사유</p>
                        <p className="text-sm font-black leading-relaxed">{status.rejectReason || '정보가 불일치하거나 부적절한 사업자 정보입니다.'}</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full py-5 bg-white text-rose-600 font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-black/20"
                    >
                        다시 신청하기 <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    }

    // Case 4: Not Applied / Application Form
    return (
        <div className="bg-gradient-to-br from-primary via-indigo-600 to-purple-700 p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group border border-white/10">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-150 transition-transform duration-700 pointer-events-none">
                <Store className="w-32 h-32" />
            </div>

            <div className="relative z-10">
                {!showForm ? (
                    <>
                        <div className="p-3 bg-white/20 w-fit rounded-2xl mb-6 backdrop-blur-md">
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-black mb-3 tracking-tighter leading-tight">DIBS! <br />판매자 권한 신청</h2>
                        <p className="text-white/80 text-sm font-black mb-10 leading-relaxed italic">
                            "당신의 가치 있는 제품을 <br />수천 명의 대기 유저에게 직접 제안하세요."
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full py-5 bg-white text-primary font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3 group-hover:gap-5 duration-300 shadow-xl shadow-black/20"
                        >
                            입점 신청하기 <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleApply} className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-black tracking-tight">판매자 정보 입력</h2>
                            <button type="button" onClick={() => setShowForm(false)} className="text-xs font-bold opacity-60 hover:opacity-100 uppercase tracking-widest underline underline-offset-4">뒤로가기</button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">상호명</label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder="사업자 등록된 상호명을 입력하세요"
                                    className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">사업자 등록 번호</label>
                                <input
                                    type="text"
                                    value={businessNumber}
                                    onChange={(e) => setBusinessNumber(e.target.value)}
                                    placeholder="000-00-00000"
                                    className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-200 text-xs font-bold">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isApplying}
                            className="w-full py-5 bg-white text-primary font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-black/20 disabled:opacity-50"
                        >
                            {isApplying ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    신청 처리 중...
                                </>
                            ) : (
                                "신청 완료하기"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
