"use client";

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

function CallbackContent() {
    const router = useRouter();
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        // 쿠키 기반 인증: 백엔드에 /auth/me 요청으로 세션 확인
        checkAuth().then(() => {
            router.push('/');
        }).catch(() => {
            router.push('/login?error=auth_failed');
        });
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">로그인 처리 중입니다...</p>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}

