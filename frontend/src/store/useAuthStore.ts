import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, SignupCredentials } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (credentials: SignupCredentials) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    becomeSeller: () => void;
    isHydrated: boolean;
    setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            isHydrated: false,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login(credentials);
                    set({ user: response, isAuthenticated: true, isLoading: false });
                } catch (error: any) {
                    let errorMessage = '로그인에 실패했습니다.';
                    if (error.response) {
                        // 백엔드에서 보낸 ApiResponse의 message 사용
                        const data = error.response.data;
                        errorMessage = (typeof data === 'object' && data?.message) ? data.message : errorMessage;
                    } else if (error.request) {
                        errorMessage = '서버와 연결할 수 없습니다. 서버 상태를 확인해주세요.';
                    }
                    set({ error: errorMessage, isLoading: false });
                    throw error;
                }
            },

            signup: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.signup(credentials);
                    set({ isLoading: false });
                } catch (error: any) {
                    let errorMessage = '회원가입에 실패했습니다.';
                    if (error.response) {
                        // 백엔드에서 보낸 ApiResponse의 message 사용
                        // 데이터가 객체가 아닐 경우(500 에러 페이지 등) 대비
                        const data = error.response.data;
                        errorMessage = (typeof data === 'object' && data?.message) ? data.message : errorMessage;
                    } else if (error.request) {
                        errorMessage = '서버와 연결할 수 없습니다. 서버 상태를 확인해주세요.';
                    }
                    set({ error: errorMessage, isLoading: false });
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await authService.logout();
                } catch (error) {
                    console.error("Logout API failed, clearing local state anyway", error);
                }
                set({ user: null, isAuthenticated: false });
            },

            checkAuth: async () => {
                // 이미 인증된 상태라면 isLoading을 true로 하지 않음 (새로고침 시 깜빡임 방지)
                if (!get().isAuthenticated) {
                    set({ isLoading: true });
                }
                try {
                    const user = await authService.getMe();
                    console.log("checkAuth: Success", user);
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error: any) {
                    console.error("checkAuth: Failed", error);
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },

            becomeSeller: () => {
                set((state) => {
                    if (state.user) {
                        const updatedUser = {
                            ...state.user,
                            roles: Array.from(new Set([...(state.user.roles || []), 'ROLE_SELLER']))
                        };
                        return { user: updatedUser };
                    }
                    return state;
                });
            },

            setHydrated: () => set({ isHydrated: true }),
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            },
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
