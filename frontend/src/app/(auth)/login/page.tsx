"use client";

import Link from 'next/link';
import { MessageCircle, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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
                        프리미엄 영화 예매의 시작
                    </p>
                </div>

                {/* Basic Login Form */}
                <form className="space-y-4 mb-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
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
                    </div>
                    <button className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-red-700 transition-colors">
                        로그인
                    </button>
                </form>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground rounded-full">Or continue with</span>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Kakao Login */}
                    <a
                        href={`${API_URL}/oauth2/authorization/kakao`}
                        className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-[#FEE500] text-[#000000] font-bold hover:bg-[#FEE500]/90 transition-colors text-sm"
                    >
                        <MessageCircle className="w-5 h-5 fill-current" />
                        카카오로 시작하기
                    </a>

                    {/* Naver Login */}
                    <a
                        href={`${API_URL}/oauth2/authorization/naver`}
                        className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-[#03C75A] text-white font-bold hover:bg-[#03C75A]/90 transition-colors text-sm"
                    >
                        <span className="w-5 h-5 flex items-center justify-center font-black text-sm">N</span>
                        네이버로 시작하기
                    </a>

                    {/* Google Login */}
                    <a
                        href={`${API_URL}/oauth2/authorization/google`}
                        className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-100 transition-colors text-sm"
                    >
                        {/* Simple Google G Icon */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google로 시작하기
                    </a>
                </div>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p className="mb-2">
                        계정이 없으신가요? <Link href="/signup" className="text-primary font-bold hover:underline">회원가입</Link>
                    </p>
                    <p className="text-xs">
                        로그인 시 <Link href="/terms" className="underline hover:text-foreground">이용약관</Link> 및 <Link href="/privacy" className="underline hover:text-foreground">개인정보처리방침</Link>에 동의하게 됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
