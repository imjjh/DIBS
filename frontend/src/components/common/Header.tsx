"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, LogOut, Sun, Moon, Zap, Trophy, Ticket, Gift, Store, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from "next-themes";
import { cn } from '@/lib/utils';

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user, logout, checkAuth } = useAuthStore();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        checkAuth();
        setMounted(true);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [checkAuth]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const navItems = [
        { name: '스토어', href: '/store', icon: <ShoppingBag className="w-4 h-4" /> },
        { name: '이벤트', href: '/event', icon: <Gift className="w-4 h-4" /> },
        { name: '내 쿠폰', href: '/coupons', icon: <Ticket className="w-4 h-4" /> },
    ];

    // Special roles links
    const isSeller = user?.roles?.includes('ROLE_SELLER');
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border py-2" : "bg-transparent py-4"
        )}>
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="group">
                    <h1 className="text-3xl font-black tracking-tighter text-primary flex items-center gap-1 group-hover:scale-105 transition-transform">
                        DIBS<span className="text-foreground">!</span>
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1 bg-secondary/50 p-1.5 rounded-2xl border border-border/50">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all",
                                pathname === item.href
                                    ? "bg-background text-primary shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}

                    {/* Conditional Role Based Links */}
                    {(isSeller || isAdmin) && <div className="w-px h-6 bg-border mx-2" />}

                    {isSeller && (
                        <Link
                            href="/seller"
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all text-indigo-500 hover:bg-indigo-500/10",
                                pathname.startsWith('/seller') && "bg-indigo-500/10"
                            )}
                        >
                            <Store className="w-4 h-4" />
                            판매자 센터
                        </Link>
                    )}

                    {isAdmin && (
                        <Link
                            href="/admin"
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all text-orange-500 hover:bg-orange-500/10",
                                pathname.startsWith('/admin') && "bg-orange-500/10"
                            )}
                        >
                            <ShieldCheck className="w-4 h-4" />
                            어드민
                        </Link>
                    )}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 mr-2">
                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                className="p-3 rounded-2xl hover:bg-secondary transition-all active:scale-90"
                                aria-label="Toggle Theme"
                            >
                                {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-500" />}
                            </button>
                        )}
                        <button className="p-3 hover:bg-secondary rounded-2xl transition-all active:scale-90" aria-label="Search">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="h-8 w-px bg-border mx-2 hidden sm:block" />

                    <Link
                        href="/cart"
                        className="p-3 hover:bg-secondary rounded-2xl transition-all relative group active:scale-90"
                        aria-label="Cart"
                    >
                        <ShoppingBag className="w-5 h-5 group-hover:text-primary transition-colors" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse" />
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-1 ml-2">
                            <Link href="/mypage" className="flex items-center gap-3 pl-3 pr-4 py-2 bg-secondary/50 hover:bg-secondary rounded-2xl transition-all border border-border/50 group">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User className="w-4 h-4 text-primary" />
                                </div>
                                <div className="hidden md:flex flex-col items-start leading-tight">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">My Account</span>
                                    <span className="text-sm font-black text-foreground">
                                        {user?.nickname || user?.name || '회원님'}
                                    </span>
                                </div>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-3 hover:bg-red-500/10 rounded-2xl transition-all text-muted-foreground hover:text-red-500 active:scale-90"
                                aria-label="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="ml-2 px-8 py-3 bg-primary text-primary-foreground text-sm font-black rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                        >
                            로그인
                        </Link>
                    )}

                    <button className="lg:hidden p-3 hover:bg-secondary rounded-2xl transition-all active:scale-90" aria-label="Menu">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
