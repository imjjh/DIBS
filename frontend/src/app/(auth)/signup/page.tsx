"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, CheckCircle, MoveLeft, Ticket, AlertCircle, Key } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function SignupPage() {
    const router = useRouter();
    const { signup, isLoading, error } = useAuthStore();
    const [formData, setFormData] = useState({
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [localError, setLocalError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setLocalError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (formData.password !== formData.confirmPassword) {
            setLocalError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await signup({
                username: formData.username,
                password: formData.password,
                email: formData.email,
                nickName: formData.nickname
            });
            router.push('/login?signup=success');
        } catch (err) {
            // Error is handled by store
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Abstract Background Decorations */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-md p-10 bg-card border border-border rounded-[2rem] shadow-2xl">
                <div className="mb-8">
                    <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors mb-6 group">
                        <MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        로그인으로 돌아가기
                    </Link>

                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-foreground">회원가입</h1>
                        <p className="text-muted-foreground font-medium text-sm">
                            DIBS와 함께 스마트한 선착순 쇼핑을 시작하세요.
                        </p>
                    </div>
                </div>

                {/* Welcome Coupon Banner */}
                <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4 animate-in zoom-in duration-500">
                    <div className="bg-primary/10 p-3 rounded-xl">
                        <Ticket className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-0.5" >Welcome Gift</p>
                        <p className="text-sm font-black text-foreground">
                            지금 가입하면 <span className="text-primary text-base">10,000원</span> 쿠폰 즉시 지급!
                        </p>
                    </div>
                </div>

                {(error || localError) && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive animate-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-xs font-bold">{localError || error}</p>
                    </div>
                )}

                <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
                    <div className="space-y-3">
                        <div className="group relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                placeholder="이름 (닉네임)"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl focus:outline-none transition-all font-medium text-sm"
                            />
                        </div>
                        <div className="group relative">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="아이디"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl focus:outline-none transition-all font-medium text-sm"
                            />
                        </div>
                        <div className="group relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="이메일 주소"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl focus:outline-none transition-all font-medium text-sm"
                            />
                        </div>
                        <div className="group relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="비밀번호"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl focus:outline-none transition-all font-medium text-sm"
                            />
                        </div>
                        <div className="group relative">
                            <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="비밀번호 확인"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl focus:outline-none transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input type="checkbox" required className="mt-1 accent-primary" />
                            <span className="text-xs text-muted-foreground font-medium leading-relaxed group-hover:text-foreground transition-colors">
                                [필수] <Link href="/terms" className="underline">이용약관</Link> 및 <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의합니다.
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '신청 중...' : '무료 회원 가입하기'}
                    </button>
                </form>

                <div className="text-center text-sm text-muted-foreground font-medium">
                    <p>
                        이미 회원이신가요?
                        <Link href="/login" className="ml-2 text-primary font-black hover:underline transition-all">로그인</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
