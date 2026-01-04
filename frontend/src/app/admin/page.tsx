"use client";

import { useEffect, useState, useCallback } from 'react';
import {
    Activity,
    ShieldCheck,
    ChevronRight,
    Users,
    ShoppingBag,
    Store,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from '@/lib/axios';
import { SellerApplication, SellerApplicationListResponse, ApiResponse } from '@/types';

export default function AdminPage() {
    const [applications, setApplications] = useState<SellerApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        pendingSellerApplications: 0,
        totalSales: 0
    });

    const fetchApplications = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get<ApiResponse<SellerApplicationListResponse>>('/admin/seller-applications');
            const data = response.data.data;
            setApplications(data.items);

            // Calculate pseudo-stats from the list for now
            const pendingCount = data.items.filter(app => app.status === '대기 중').length;
            setStats(prev => ({
                ...prev,
                pendingSellerApplications: pendingCount
            }));
        } catch (error) {
            console.error('Failed to fetch applications:', error);
            alert('신청 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleApprove = async (id: number, approve: boolean) => {
        try {
            await axios.patch(`/admin/seller/${id}`, {
                approve,
                rejectReason: approve ? null : '승인 거절되었습니다.'
            });
            alert(approve ? '승인되었습니다.' : '거절되었습니다.');
            fetchApplications(); // Refresh list
        } catch (error) {
            console.error('Action failed:', error);
            alert('처리에 실패했습니다.');
        }
    };

    const dashboardStats = [
        { label: '전체 사용자', value: stats.totalUsers || '-', change: 'New API Needed', isUp: true, icon: <Users className="w-5 h-5" />, color: 'bg-blue-500' },
        { label: '전체 매출액', value: stats.totalSales || '0₩', change: '0%', isUp: true, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-emerald-500' },
        { label: '신규 판매자 신청', value: stats.pendingSellerApplications, change: `Total ${applications.length}`, isUp: true, icon: <Store className="w-5 h-5" />, color: 'bg-amber-500' },
        { label: '등록 상품 수', value: stats.totalProducts || '-', change: 'New API Needed', isUp: false, icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-white">System Overview</h2>
                    <p className="text-white/40 font-medium mt-1">실시간 데이터 기반 관리자 대시보드</p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => fetchApplications()} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/80 hover:bg-white/10 transition-all">
                        <Activity className="w-4 h-4" />
                        새로고침
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat) => (
                    <div key={stat.label} className="group bg-[#0f0f12] border border-white/5 p-8 rounded-[2.5rem] hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className={cn("p-4 rounded-2xl shadow-lg", stat.color)}>
                                {stat.icon}
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full",
                                stat.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                            )}>
                                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Applications Table */}
                <div className="lg:col-span-2 bg-[#0f0f12] border border-white/5 rounded-[3rem] p-10 space-y-8 relative overflow-hidden">
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Activity className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight text-white">최근 판매자 신청</h3>
                                <p className="text-white/40 text-sm font-medium">승인 대기 중인 신청 건들입니다.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 overflow-x-auto min-h-[300px]">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                <p className="text-sm font-bold text-white/20 uppercase tracking-widest">Loading Applications...</p>
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-white/10" />
                                </div>
                                <p className="text-white/40 font-bold">신청 내역이 없습니다.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-separate border-spacing-y-4">
                                <thead>
                                    <tr className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="px-6 pb-2">상호명 / ID</th>
                                        <th className="px-6 pb-2">사업자 번호</th>
                                        <th className="px-6 pb-2">상태</th>
                                        <th className="px-6 pb-2 text-right">관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((app: SellerApplication) => (
                                        <tr key={app.id} className="group/row">
                                            <td className="bg-white/[0.02] rounded-l-3xl px-6 py-5 border-y border-l border-white/5 group-hover/row:bg-white/[0.04] transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-xs text-primary">
                                                        {app.businessName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{app.businessName}</p>
                                                        <p className="text-xs text-white/30 font-medium tracking-tight">User #{app.userId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="bg-white/[0.02] border-y border-white/5 group-hover/row:bg-white/[0.04] transition-all">
                                                <span className="text-xs font-mono text-white/60 tracking-wider">{app.businessNumber}</span>
                                            </td>
                                            <td className="bg-white/[0.02] border-y border-white/5 group-hover/row:bg-white/[0.04] transition-all">
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                    app.status === '대기 중' && "bg-amber-500/10 text-amber-500",
                                                    app.status === '승인' && "bg-emerald-500/10 text-emerald-500",
                                                    app.status === '거절' && "bg-red-500/10 text-red-500",
                                                )}>
                                                    {app.status === '대기 중' && <Clock className="w-3 h-3" />}
                                                    {app.status === '승인' && <CheckCircle2 className="w-3 h-3" />}
                                                    {app.status === '거절' && <AlertCircle className="w-3 h-3" />}
                                                    {app.status}
                                                </div>
                                            </td>
                                            <td className="bg-white/[0.02] rounded-r-3xl px-6 py-5 border-y border-r border-white/5 group-hover/row:bg-white/[0.04] transition-all text-right">
                                                {app.status === '대기 중' && (
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleApprove(app.id, true)}
                                                            className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-xl hover:scale-105 transition-all"
                                                        >
                                                            승인
                                                        </button>
                                                        <button
                                                            onClick={() => handleApprove(app.id, false)}
                                                            className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                        >
                                                            거절
                                                        </button>
                                                    </div>
                                                )}
                                                {app.status !== '대기 중' && (
                                                    <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                                        <MoreVertical className="w-5 h-5 text-white/20" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-[#1a1a20] to-[#0f0f12] border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl">
                        <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                            Admin Actions
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm group">
                                시스템 로그 확인 (TBD)
                                <ChevronRight className="w-4 h-4 opacity-30 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full flex items-center justify-between p-5 bg-primary/10 border border-primary/20 rounded-2xl hover:bg-primary/20 transition-all font-black text-sm text-primary group">
                                공지사항 작성 (TBD)
                                <ChevronRight className="w-4 h-4 opacity-30 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#0f0f12] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
                        <div className="relative z-10 space-y-4">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h4 className="text-lg font-black text-white">System Monitor</h4>
                            <p className="text-white/40 text-sm font-medium leading-relaxed">
                                백엔드 API 서버가 정상적으로 응답하고 있습니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
