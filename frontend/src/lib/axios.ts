import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to get cookie by name
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null; // Server-side guard
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

// Request interceptor: Add CSRF Token
api.interceptors.request.use(
    (config) => {
        // CSRF Token (XSRF-TOKEN 쿠키를 읽어서 헤더에 추가)
        // GET, HEAD, OPTIONS 등은 필요 없지만 Spring Security 설정을 위해 안전하게 다 넣거나
        // 보통은 데이터 변경 요청(POST, PUT, DELETE 등)에만 필수입니다.
        if (typeof document !== 'undefined') {
            const xsrfToken = getCookie('XSRF-TOKEN');
            if (xsrfToken) {
                config.headers['X-XSRF-TOKEN'] = xsrfToken;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 & Refresh Token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고, 아직 재시도하지 않은 요청일 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh Token으로 재발급 시도
                // (주의: api.post 대신 axios.post 사용 추천 - 인터셉터 무한 루프 방지)
                await axios.post(
                    '/api/auth/refresh',
                    {},
                    { withCredentials: true } // 쿠키(refresh token) 전송 필수
                );

                // 재발급 성공 시 원래 요청 재시도
                return api(originalRequest);
            } catch (refreshError) {
                // 재발급 실패 시 (토큰 만료 등) -> 로그아웃 처리
                console.error('Session expired, please login again.');
                // window.location.href = '/login'; // 로그인 페이지로 이동
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
