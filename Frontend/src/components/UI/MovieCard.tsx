import { Play, Plus, ThumbsUp, Check } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn, resizeImage } from '../../lib/utils';
import { useState } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

interface MovieCardProps {
    id: string | number;
    title: string;
    image: string;
    year?: string;
    match?: string;
    age?: string;
    duration?: string;
    variant?: 'landscape' | 'portrait';
    badge?: string; // e.g. "NEW", "TOP 10"
}

export function MovieCard({ id, title, image, year, match, age, duration, variant = 'landscape', badge }: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    const slug = id.toString();
    const favorite = isFavorite(slug);

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }

        if (isLoading) return;

        setIsLoading(true);
        try {
            if (favorite) {
                await removeFavorite(slug);
            } else {
                await addFavorite({
                    movieSlug: slug,
                    movieName: title,
                    moviePosterUrl: image,
                    movieThumbUrl: image, // Assuming thumb is same as poster if not provided separately
                    movieYear: year ? parseInt(year) : undefined
                });
            }
        } catch (error) {
            console.error("Failed to toggle favorite", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Link to={`/title/${id}`}
            className={cn(
                "relative group block transition-all duration-300 z-0 hover:z-50 cursor-pointer overflow-hidden rounded-lg shadow-xl ring-0 hover:ring-2 hover:ring-white/20",
                variant === 'landscape'
                    ? "w-[280px] aspect-[16/9] bg-surface"
                    : "w-[160px] md:w-[200px] aspect-[2/3] bg-surface border border-white/5"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {imageError ? (
                <div className="w-full h-full bg-surface-hover flex items-center justify-center p-4">
                    <span className="text-sm font-bold text-gray-400 text-center">{title}</span>
                </div>
            ) : (
                <img
                    src={resizeImage(image)}
                    alt={title}
                    className={cn(
                        "w-full h-full object-cover transition-opacity duration-300",
                        isHovered ? "opacity-100" : "opacity-80"
                    )}
                    loading="lazy"
                    onError={() => setImageError(true)}
                />
            )}

            {/* Badges */}
            {badge && (
                <div className={cn(
                    "absolute shadow-sm font-bold rounded px-2 py-0.5 z-20",
                    badge === "TOP 10" ? "top-2 right-2 text-[10px] bg-primary text-white" : "top-2 left-2 text-[10px] bg-primary text-white"
                )}>
                    {badge}
                </div>
            )}

            {/* Content Overlays */}
            {variant === 'landscape' ? (
                <>
                    {/* Bottom Gradient with Title (Always visible) & Metadata (Hover) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex flex-col justify-end p-4 z-10 transition-opacity duration-300">
                        <h3 className="font-bold text-white text-lg drop-shadow-md leading-tight">{title}</h3>
                        <div className={cn(
                            "flex flex-wrap items-center gap-2 text-xs text-text-secondary mt-1 transition-all duration-300 delay-100",
                            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                        )}>
                            {match && <span className="text-green-400 font-bold">{match} Match</span>}
                            {match && <span>•</span>}
                            <span>{year || "2024"}</span>
                            <span>•</span>
                            <span className="border border-white/20 px-1 rounded text-[10px]">{age || "16+"}</span>
                            <span>{duration || "1h 45m"}</span>
                        </div>
                    </div>

                    {/* Center Buttons (Hover Only) */}
                    <div className={cn(
                        "absolute inset-0 flex items-center justify-center gap-2 bg-background/60 backdrop-blur-[2px] transition-opacity duration-300 z-20",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}>
                        <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                            <Play className="w-5 h-5 fill-current" />
                        </button>
                        <button
                            className="w-10 h-10 rounded-full bg-black/60 border border-white/30 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                            onClick={handleToggleFavorite}
                            disabled={isLoading}
                        >
                            {favorite ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </button>
                        <button className="w-10 h-10 rounded-full bg-black/60 border border-white/30 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                            <ThumbsUp className="w-5 h-5" />
                        </button>
                    </div>
                </>
            ) : (
                /* Portrait Overlay */
                <div className={cn(
                    "absolute inset-0 bg-background/90 transition-all duration-300 flex flex-col justify-center items-center gap-3 p-4 text-center z-10",
                    isHovered ? "opacity-100" : "opacity-0"
                )}>
                    <h3 className="font-bold text-white text-lg leading-tight">{title}</h3>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                            <Play className="w-5 h-5 fill-current" />
                        </button>
                        <button
                            className="w-10 h-10 rounded-full bg-transparent border-2 border-white text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                            onClick={handleToggleFavorite}
                            disabled={isLoading}
                        >
                            {favorite ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </button>
                    </div>
                    <span className="text-xs text-text-secondary">Movie • {year || "2024"}</span>
                </div>
            )}
        </Link>
    );
}
