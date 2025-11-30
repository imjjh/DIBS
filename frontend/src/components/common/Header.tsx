import Link from 'next/link';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tighter text-primary">
                        TICKET<span className="text-foreground">LOCK</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link href="/movie" className="transition-colors hover:text-primary">
                        영화
                    </Link>
                    <Link href="/store" className="transition-colors hover:text-primary">
                        스토어
                    </Link>
                    <Link href="/event" className="transition-colors hover:text-primary">
                        이벤트
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-secondary rounded-full transition-colors" aria-label="Search">
                        <Search className="w-5 h-5" />
                    </button>
                    <Link href="/store/cart" className="p-2 hover:bg-secondary rounded-full transition-colors relative" aria-label="Cart">
                        <ShoppingBag className="w-5 h-5" />
                        {/* Badge placeholder */}
                        {/* <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span> */}
                    </Link>
                    <Link href="/login" className="p-2 hover:bg-secondary rounded-full transition-colors" aria-label="My Page">
                        <User className="w-5 h-5" />
                    </Link>
                    <button className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors" aria-label="Menu">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
