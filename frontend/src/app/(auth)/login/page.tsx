"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle, Key, Lock, MoveRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
    const [credentials, setCredentials] = useState({
        username: '', // 백엔드 DTO가 username을 받으므로 아이디 또는 이메일로 활용
        password: ''
    });

    const { login, isLoading, error, isAuthenticated, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.roles?.includes('ROLE_ADMIN')) {
                router.push('/admin');
            } else {
                router.push('/');
            }
        }
    }, [isAuthenticated, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(credentials);
            // useAuthStore state will be updated, useEffect will handle redirect
        } catch (err) {
            console.error("Login failed", err);
        }
    };

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

                {error && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {/* Basic Login Form */}
                <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
                    <div className="space-y-3">
                        <div className="group relative">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="아이디"
                                required
                                value={credentials.username}
                                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl focus:outline-none transition-all font-medium text-sm"
                            />
                        </div>
                        <div className="group relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                placeholder="비밀번호"
                                required
                                value={credentials.password}
                                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl focus:outline-none transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pr-1">
                        <button
                            type="button"
                            disabled
                            title="준비 중인 기능입니다."
                            className="text-xs font-bold text-muted-foreground/50 cursor-not-allowed"
                        >
                            비밀번호를 잊으셨나요? (준비 중)
                        </button>
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : '로그인'}
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

                <div className="grid grid-cols-2 gap-4">
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
