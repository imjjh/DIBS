"use client";

import Link from 'next/link';
import { Mail, Lock, User, CheckCircle } from 'lucide-react';

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative">
            {/* Overlay */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-md p-8 bg-secondary/50 border border-border rounded-2xl shadow-2xl backdrop-blur-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-4xl font-bold tracking-tighter text-primary mb-2">
                            TICKET<span className="text-foreground">LOCK</span>
                        </h1>
                    </Link>
                    <p className="text-muted-foreground">
                        회원가입하고 프리미엄 혜택을 누리세요
                    </p>
                </div>

                <form className="space-y-4 mb-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-3">
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="이름"
                                className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <input
                                type="email"
                                placeholder="이메일"
                                className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <input
                                type="password"
                                placeholder="비밀번호"
                                className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="relative">
                            <CheckCircle className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <input
                                type="password"
                                placeholder="비밀번호 확인"
                                className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>
                    <button className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-red-700 transition-colors mt-2">
                        회원가입
                    </button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    <p>
                        이미 계정이 있으신가요? <Link href="/login" className="text-primary font-bold hover:underline">로그인</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
