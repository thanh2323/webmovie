import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';

interface SectionProps {
    title: string;
    items: any[];
    variant?: 'landscape' | 'portrait';
    link?: string;
}

export function Section({ title, items, variant = 'landscape', link }: SectionProps) {
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
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-white pl-1 border-l-4 border-primary">{title}</h2>
                {link && (
                    <a href={link} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group/link">
                        View More
                        <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                )}
            </div>

            <div className="relative">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 h-full flex items-center justify-center w-12 from-black/80 to-transparent bg-gradient-to-r"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-1 scroll-smooth"
                >
                    {items.map((item) => (
                        <div key={item.id} className="flex-none">
                            <MovieCard {...item} variant={variant} />
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 h-full flex items-center justify-center w-12 from-transparent to-black/80 bg-gradient-to-r"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
}
