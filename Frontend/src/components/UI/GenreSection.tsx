import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GenreSectionProps {
    genres: { id: number; name: string; icon?: React.ReactNode }[];
}

export function GenreSection({ genres }: GenreSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group px-4 md:px-12 py-8 space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Popular Genres</h2>

            <div className="relative">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-black/80"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                >
                    {genres.map((genre) => (
                        <button
                            key={genre.id}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/20 hover:border-white/30 transition-all min-w-max group/btn"
                        >
                            {genre.icon && <span className="text-gray-400 group-hover/btn:text-white transition-colors">{genre.icon}</span>}
                            <span className="font-medium text-gray-200 group-hover/btn:text-white transition-colors">{genre.name}</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
