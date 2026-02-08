import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // 1. /api/ 요청 처리
    if (pathname.startsWith('/api/')) {
        const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8080';
        // destination URL 생성: backendUrl + pathname + search
        return NextResponse.rewrite(new URL(pathname + search, backendUrl));
    }

    // 2. /oauth2/ 요청 처리 (OIDC 등)
    if (pathname.startsWith('/oauth2/')) {
        const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8080';
        return NextResponse.rewrite(new URL(pathname + search, backendUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*', '/oauth2/:path*'],
};
