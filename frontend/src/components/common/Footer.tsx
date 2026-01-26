import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-secondary py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-black text-primary tracking-tighter">DIBS<span className="text-foreground">!</span></h3>
                        <p className="text-sm text-muted-foreground">
                            놓치면 품절! 선착순 타임딜 쇼핑몰 딥스.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">쇼핑하기</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><span className="hover:text-foreground cursor-default">타임딜</span></li>
                            <li><span className="hover:text-foreground cursor-default">베스트</span></li>
                            <li><span className="hover:text-foreground cursor-default">쿠폰존</span></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">고객센터</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><span className="hover:text-foreground cursor-default">자주 묻는 질문</span></li>
                            <li><span className="hover:text-foreground cursor-default">공지사항</span></li>
                            <li><span className="hover:text-foreground cursor-default">1:1 문의</span></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">소셜 미디어</h4>
                        <div className="flex gap-4">
                            {/* Social Icons Placeholders */}
                            <div className="w-8 h-8 bg-muted rounded-full"></div>
                            <div className="w-8 h-8 bg-muted rounded-full"></div>
                            <div className="w-8 h-8 bg-muted rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} DIBS Corp. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
