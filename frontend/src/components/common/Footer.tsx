import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-secondary py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-primary">TICKETLOCK</h3>
                        <p className="text-sm text-muted-foreground">
                            최고의 영화 경험을 제공하는 프리미엄 예매 플랫폼.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">서비스</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/movie" className="hover:text-foreground">영화 예매</Link></li>
                            <li><Link href="/store" className="hover:text-foreground">스토어</Link></li>
                            <li><Link href="/theaters" className="hover:text-foreground">극장 찾기</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">고객센터</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/faq" className="hover:text-foreground">자주 묻는 질문</Link></li>
                            <li><Link href="/notice" className="hover:text-foreground">공지사항</Link></li>
                            <li><Link href="/inquiry" className="hover:text-foreground">1:1 문의</Link></li>
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
                    <p>&copy; {new Date().getFullYear()} TicketLock. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
