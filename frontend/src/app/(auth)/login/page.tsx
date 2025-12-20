"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle, Mail, Lock, MoveRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {

    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Abstract Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-md p-10 bg-card border border-border rounded-[2rem] shadow-2xl">
                <div className="text-center mb-10 space-y-2">
                    <Link href="/" className="inline-block group">
                        <h1 className="text-4xl font-black tracking-tighter text-primary flex items-center justify-center gap-1 group-hover:scale-105 transition-transform">
                            DIBS<span className="text-foreground">!</span>
                        </h1>
                    </Link>
                    <p className="text-muted-foreground font-medium">
                        선착순 행운을 찜하는 가장 빠른 방법
                    </p>
                </div>

                {/* Basic Login Form */}
                <form className="space-y-4 mb-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-3">
                        <div className="group relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                placeholder="이메일 주소"
                                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl focus:outline-none transition-all font-medium text-sm"
                            />
                        </div>
                        <div className="group relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                placeholder="비밀번호"
                                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl focus:outline-none transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pr-1">
                        <button className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">비밀번호를 잊으셨나요?</button>
                    </div>

                    <button className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]">
                        로그인
                    </button>
                </form>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border"></span>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                        <span className="bg-card px-4 text-muted-foreground">간편 로그인</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {/* Kakao Login */}
                    <a
                        href="/oauth2/authorization/kakao"
                        className="flex items-center justify-center aspect-square rounded-2xl bg-[#FEE500] hover:scale-105 transition-transform shadow-sm"
                        title="카카오 로그인"
                    >
                        <MessageCircle className="w-6 h-6 fill-current text-[#3C1E1E]" />
                    </a>

                    {/* Naver Login */}
                    <a
                        href="/oauth2/authorization/naver"
                        className="flex items-center justify-center aspect-square rounded-2xl bg-[#03C75A] hover:scale-105 transition-transform shadow-sm"
                        title="네이버 로그인"
                    >
                        <span className="text-white font-black text-xl">N</span>
                    </a>

                    {/* Google Login */}
                    <a
                        href="/oauth2/authorization/google"
                        className="flex items-center justify-center aspect-square rounded-2xl bg-white border border-border hover:scale-105 transition-transform shadow-sm"
                        title="구글 로그인"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                    </a>
                </div>

                <div className="mt-10 pt-6 border-t border-border flex flex-col items-center gap-4 text-sm text-muted-foreground">
                    <p className="font-medium">
                        아직 회원이 아니신가요?
                        <Link href="/signup" className="ml-2 text-primary font-black hover:underline inline-flex items-center gap-1 group">
                            지금 가입하기
                            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
