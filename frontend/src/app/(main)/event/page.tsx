"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Gift,
    Calendar,
    ChevronRight,
    Sparkles,
    PartyPopper,
    Timer,
    Zap,
    Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Events Data
const MOCK_EVENTS = [
    {
        id: 1,
        title: "DIBS! 신규 가입 웰컴 페스티벌",
        subtitle: "지금 가입하면 10,000원 쿠폰 + 첫 구매 10% 적립",
        period: "2024.12.01 - 2024.12.31",
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop",
        category: "Benefits",
        status: "진행중",
        color: "from-primary to-purple-600"
    },
    {
        id: 2,
        title: "겨울 시즌 프리미엄 아우터 기획전",
        subtitle: "최대 40% 한정 할인 + 무료 사이즈 교환",
        period: "2024.12.15 - 2025.01.15",
        image: "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=2071&auto=format&fit=crop",
        category: "Collection",
        status: "진행중",
        color: "from-blue-600 to-cyan-500"
    },
    {
        id: 3,
        title: "럭키 드로우: DIBS! 한정판 스니커즈",
        subtitle: "단 1명에게 선사하는 0원의 행운, 지금 응모하세요",
        period: "2024.12.20 - 2024.12.25",
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop",
        category: "Lucky Draw",
        status: "D-1",
        color: "from-orange-500 to-red-600"
    },
    {
        id: 4,
        title: "브랜드 위크: Tech Master",
        subtitle: "전 품목 추가 5,000 포인트 적립 혜택",
        period: "2024.12.18 - 2024.12.24",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
        category: "Brand",
        status: "진행중",
        color: "from-slate-700 to-slate-900"
    }
];

const CATEGORIES = ["전체", "Benefits", "Collection", "Lucky Draw", "Brand"];

export default function EventPage() {
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const filteredEvents = selectedCategory === "전체"
        ? MOCK_EVENTS
        : MOCK_EVENTS.filter(e => e.category === selectedCategory);

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Hero Header */}
            <div className="pt-32 pb-20 bg-foreground text-background relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-10 animate-pulse">
                    <PartyPopper className="w-96 h-96 -rotate-12" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <div className="flex items-center gap-3 px-6 py-2 bg-primary text-primary-foreground rounded-full w-fit">
                            <Sparkles className="w-4 h-4 fill-current" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Unlimited Dreams</span>
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter leading-none italic uppercase">
                            DIBS! <span className="text-primary italic">EVENT</span>
                        </h1>
                        <p className="text-xl font-medium opacity-60 leading-relaxed">
                            매일 새로운 행운과 압도적인 혜택. <br />디입스가 큐레이션한 특별한 이벤트에 참여하고 구매 기회를 찜하세요.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Links / Shortcuts */}
            <div className="container mx-auto px-4 -mt-10 mb-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/deal" className="bg-background border border-border p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-primary/50 transition-all shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-lg">타임딜</h4>
                                <p className="text-xs text-muted-foreground">초특가를 찜하세요</p>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <Link href="/best" className="bg-background border border-border p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-primary/50 transition-all shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-lg">베스트 상품</h4>
                                <p className="text-xs text-muted-foreground">인기 랭킹 확인</p>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <Link href="/coupons" className="bg-background border border-border p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-primary/50 transition-all shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500">
                                <Gift className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-lg">전용 쿠폰</h4>
                                <p className="text-xs text-muted-foreground">다운로드 하기</p>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar Filter */}
                    <div className="w-full lg:w-48 space-y-8">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Category</h3>
                            <div className="flex flex-wrap lg:flex-col gap-3">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-left text-sm font-black transition-all",
                                            selectedCategory === cat
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Events Grid */}
                    <div className="flex-1 space-y-12">
                        {filteredEvents.map((event) => (
                            <div
                                key={event.id}
                                className="group relative flex flex-col xl:flex-row bg-background border border-border rounded-[3rem] overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
                            >
                                {/* Image Section */}
                                <div className="relative w-full xl:w-[480px] h-[340px] overflow-hidden bg-muted">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className={cn(
                                        "absolute inset-0 opacity-20 bg-gradient-to-br",
                                        event.color
                                    )} />
                                    <div className="absolute top-8 left-8">
                                        <div className="px-6 py-2 bg-background/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
                                            <span className="text-xs font-black tracking-widest text-foreground uppercase">{event.category}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 p-12 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-primary">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-xs font-black tracking-wider text-muted-foreground">{event.period}</span>
                                            </div>
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em]",
                                                event.status === "진행중" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                            )}>
                                                {event.status}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-4xl font-black tracking-tighter leading-tight group-hover:text-primary transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                                                {event.subtitle}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-12 flex items-center justify-between pb-2 border-b-2 border-transparent group-hover:border-primary transition-all duration-500">
                                        <button className="flex items-center gap-2 font-black text-xl tracking-tight">
                                            자세히 보기 <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </button>
                                        <div className="p-4 bg-secondary rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Notice */}
            <div className="container mx-auto px-4 mt-32">
                <div className="bg-secondary/20 rounded-[3rem] p-16 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-4 text-center md:text-left">
                        <h2 className="text-4xl font-black tracking-tighter">놓치면 아쉬운 다양한 소식</h2>
                        <p className="text-lg font-medium text-muted-foreground">디입스 전용 앱에서 푸시 알림을 켜고, 다음 한정판 드로우 소식을 가장 먼저 확인하세요.</p>
                    </div>
                    <button className="px-12 py-6 bg-foreground text-background font-black text-xl rounded-3xl hover:bg-primary transition-all active:scale-95 shadow-xl">
                        앱 다운로드 하기
                    </button>
                </div>
            </div>
        </div>
    );
}
