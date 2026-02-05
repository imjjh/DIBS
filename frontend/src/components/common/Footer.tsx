import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-secondary py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-black text-primary tracking-tighter">DIBS<span className="text-foreground">!</span></h3>
                        <p className="text-xs text-muted-foreground">
                            실시간 동시성 제어, 데이터 정합성 보장 그리고 보안에 집중한 이커머스 포트폴리오 프로젝트입니다.
                        </p>
                    </div>

                    <div className="flex gap-8 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <Link href="/store" className="hover:text-primary transition-colors">Store</Link>
                        <a href="https://github.com/imjjh/DIBS" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Github</a>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} DIBS Corp. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
