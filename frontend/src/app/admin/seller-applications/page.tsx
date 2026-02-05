"use client";

import { useEffect, useState } from 'react';
import {
    sellerService
} from '@/services/sellerService';
import {
    SellerApplication
} from '@/types';
import {
    Check,
    X,
    AlertCircle,
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Store
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSellerApplications() {
    const [applications, setApplications] = useState<SellerApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const data = await sellerService.getApplications({ page, size: 10 });
            setApplications(data.items);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [page]);

    const handleApprove = async (id: number) => {
        if (!confirm('정말 이 판매자를 승인하시겠습니까?')) return;
        try {
            await sellerService.reviewApplication(id, true);
            alert('승인되었습니다.');
            fetchApplications();
        } catch (error) {
            alert('승인 중 오류가 발생했습니다.');
        }
    };

    const handleReject = async (id: number) => {
        console.log('handleReject called with id:', id);
        console.log('Current rejectReason:', rejectReason);

        if (!rejectReason || rejectReason.trim() === '') {
            alert('거절 사유를 입력해주세요.');
            return;
        }
        try {
            await sellerService.reviewApplication(id, false, rejectReason);
            alert('거절되었습니다.');
            setRejectingId(null);
            setRejectReason('');
            fetchApplications();
        } catch (error) {
            alert('거절 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">판매자 신청 관리</h1>
                    <p className="text-slate-500 font-medium">입점 신청한 판매자들의 정보를 검토하고 승인하세요.</p>
                </div>
            </div>

            {/* Stats Overview (Mini) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pending</p>
                        <p className="text-2xl font-black text-slate-900">심사 대기중</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                        <Check className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Approved</p>
                        <p className="text-2xl font-black text-slate-900">매일 성장중</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Note</p>
                        <p className="text-sm font-bold text-slate-400">신중하게 검토하세요.</p>
                    </div>
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                            <Store className="w-5 h-5" />
                        </div>
                        <span className="font-black tracking-tight text-slate-900">신청 목록</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">ID</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">User ID</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">상호명</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">사업자 번호</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">상태</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">액션</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
                                            <p className="text-sm font-black text-slate-300">데이터를 불러오는 중...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : applications.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <p className="text-sm font-black text-slate-300">신청 내역이 없습니다.</p>
                                    </td>
                                </tr>
                            ) : (
                                applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-8 py-6 font-black text-sm text-slate-900">{app.id}</td>
                                        <td className="px-8 py-6 font-bold text-slate-400 text-sm">{app.userId}</td>
                                        <td className="px-8 py-6">
                                            <p className="font-black text-slate-900 group-hover:text-primary transition-colors">{app.businessName}</p>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-slate-400">{app.businessNumber}</td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                app.status === '대기 중' && "bg-amber-100 text-amber-600",
                                                app.status === '승인' && "bg-emerald-100 text-emerald-600",
                                                app.status === '거절' && "bg-red-100 text-red-600"
                                            )}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {app.status === '대기 중' && (
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleApprove(app.id)}
                                                        className="p-2 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-90"
                                                        title="승인"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setRejectReason('');
                                                            setRejectingId(app.id);
                                                        }}
                                                        className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
                                                        title="거절"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                            {app.status === '거절' && app.rejectReason && (
                                                <p className="text-xs text-red-500 font-bold max-w-[150px] truncate" title={app.rejectReason}>
                                                    사유: {app.rejectReason}
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                    <p className="text-sm font-bold text-slate-400">
                        Page <span className="font-black text-slate-900">{page + 1}</span> of <span className="font-black text-slate-900">{totalPages || 1}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                            className="p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-90 shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage(page + 1)}
                            className="p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-90 shadow-sm"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {rejectingId && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight mb-2 text-slate-900">거절 사유 입력</h2>
                            <p className="text-slate-500 text-sm font-medium">판매자에게 전달될 거절 사유를 입력해주세요.</p>
                        </div>

                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="예: 사업자 정보가 올바르지 않습니다."
                            className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all resize-none text-slate-900"
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setRejectingId(null);
                                    setRejectReason('');
                                }}
                                className="flex-1 py-4 border border-slate-200 font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-95 text-slate-600"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => handleReject(rejectingId)}
                                className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20"
                            >
                                거절 확정
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
