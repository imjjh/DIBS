"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Mail, MoveLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { authService } from '@/services/authService';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await authService.forgotPassword(email);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || '이메일 전송에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
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
                        <h1 className="text-3xl font-black tracking-tight text-foreground">비밀번호 찾기</h1>
                        <p className="text-muted-foreground font-medium text-sm">
                            가입하신 이메일 주소를 입력하시면<br />비밀번호 재설정 링크를 보내드립니다.
                        </p>
                    </div>
                </div>

                {isSuccess ? (
                    <div className="space-y-6 py-4">
                        <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] flex flex-col items-center text-center gap-4 animate-in zoom-in duration-500">
                            <div className="bg-primary/10 p-4 rounded-full">
                                <CheckCircle className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-black text-foreground">이메일 발송 완료</h2>
                                <p className="text-sm text-muted-foreground font-medium">
                                    {email} 주소로<br />재설정 링크를 보냈습니다.
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-center text-muted-foreground font-medium">
                            이메일을 받지 못하셨나요? 스팸함도 확인해 보시고,<br />
                            조금만 더 기다려 주세요.
                        </p>
                        <Link
                            href="/login"
                            className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center"
                        >
                            로그인하러 가기
                        </Link>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive animate-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-xs font-bold">{error}</p>
                            </div>
                        )}

                        <div className="group relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일 주소"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl focus:outline-none transition-all font-medium text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>발송 중...</span>
                                </>
                            ) : (
                                '재설정 링크 보내기'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
