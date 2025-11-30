import Link from 'next/link';
import { Play, Star, Calendar } from 'lucide-react';
import { SeatMap } from '@/components/features/booking/SeatMap';

export default function Home() {
    return (
        <div className="space-y-16 pb-20">
            {/* Hero Section */}
            <section className="relative h-[70vh] w-full overflow-hidden">
                {/* Background Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop')] bg-cover bg-center"></div>

                <div className="relative z-20 container mx-auto h-full flex flex-col justify-end pb-20 px-4">
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold bg-primary text-white rounded-full w-fit">
                        NOW PLAYING
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 max-w-3xl leading-tight">
                        인터스텔라 <br />
                        <span className="text-primary">Re-Mastering</span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-xl mb-8 line-clamp-2">
                        사랑은 시공간을 초월하는 유일한 것. 인류의 미래를 위해 우주로 떠난 그들의 위대한 여정이 다시 시작된다.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="/booking/1"
                            className="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            예매하기
                        </Link>
                        <Link
                            href="/movie/1"
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
                        >
                            상세정보
                        </Link>
                    </div>
                </div>
            </section>

            {/* Movie List Section */}
            <section className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">현재 상영작</h2>
                    <Link href="/movie" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        전체보기 &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="group relative">
                            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-secondary mb-4 relative">
                                {/* Image Placeholder */}
                                <div className="absolute inset-0 bg-muted group-hover:scale-105 transition-transform duration-300"></div>
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1 text-xs font-bold text-accent">
                                    <Star className="w-3 h-3 fill-current" />
                                    9.{i}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">영화 제목 {i}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="border border-muted px-1 rounded text-[10px]">15세</span>
                                <span>124분</span>
                                <span>•</span>
                                <span>SF/액션</span>
                            </div>
                            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                                <Link
                                    href={`/booking/${i}`}
                                    className="px-6 py-2 bg-primary text-white font-bold rounded-full hover:scale-105 transition-transform"
                                >
                                    예매하기
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Seat Map Preview (For Demo) */}
            <section className="container mx-auto px-4 py-12 bg-secondary/10 rounded-2xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">좌석 선택 미리보기</h2>
                    <p className="text-muted-foreground">실제 예매 화면에서 제공되는 좌석 선택 인터페이스입니다.</p>
                </div>
                <SeatMap />
            </section>
        </div>
    );
}
