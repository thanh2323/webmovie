import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { resizeImage } from '../../lib/utils';

interface HeroProps {
    id: string;
    title: string; // Add title prop
    description: string;
    image: string;
    year?: string;
    match?: string;
    age?: string;
    duration?: string;
}

export function Hero({ id, title, description, image, year, match, age, duration }: HeroProps) {
    return (
        <div className="relative h-[85vh] w-full overflow-hidden group">
            {/* Background Image without zoom effect to prevent overflow */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${resizeImage(image)}')` }}
            >
                {/* Enhanced Gradients for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="absolute bottom-0 left-0 w-full px-4 md:px-16 pb-20 md:pb-48 flex flex-col justify-end h-full z-10 pt-20">
                <div className="max-w-2xl space-y-4 md:space-y-6">
                    {/* #1 Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 backdrop-blur-sm border border-white/10 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-white mb-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        #1 in Movies Today
                    </div>

                    {/* Dynamic Title with Gradient Effect */}
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-black text-white leading-tight drop-shadow-xl">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200">{title}</span>
                    </h1>

                    <div className="flex items-center gap-2 md:gap-4 text-xs md:text-base font-medium text-text-secondary">
                        <span className="text-green-400 font-bold">{match}</span>
                        <span>{year}</span>
                        <span className="border border-white/30 px-1 rounded text-[10px] md:text-xs">4K</span>
                        <span>{duration}</span>
                        <span className="border border-white/30 px-1 rounded text-[10px] md:text-xs">{age}</span>
                    </div>

                    <p className="text-gray-300 text-sm md:text-lg line-clamp-3 md:line-clamp-none max-w-xl leading-relaxed">
                        {description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-2 md:pt-4">
                        <Link to={`/watch/${id}`} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 md:px-8 md:py-3.5 rounded-lg font-bold text-sm md:text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30">
                            <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                            Play Now
                        </Link>
                        <Link to={`/title/${id}`} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-2.5 md:px-8 md:py-3.5 rounded-lg font-bold text-sm md:text-lg transition-all border border-white/10">
                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold">i</div>
                            More Info
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
