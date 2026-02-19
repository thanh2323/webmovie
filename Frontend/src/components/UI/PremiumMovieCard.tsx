import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Play, Plus, Star, Check } from 'lucide-react';
import { resizeImage } from '../../lib/utils';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

interface PremiumMovieCardProps {
    id: string | number;
    title: string;
    image: string;
    year?: string;
    rating?: number;
}

export function PremiumMovieCard({ id, title, image, year, rating }: PremiumMovieCardProps) {
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
                    movieThumbUrl: image,
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
        <Link to={`/title/${id}`} className="group relative aspect-[2/3] overflow-hidden rounded-xl bg-[#1a1f2e] poster-hover cursor-pointer ring-1 ring-white/10 hover:ring-primary/50 transition-all duration-500 block">
            <img
                alt={title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out"
                src={resizeImage(image)}
                loading="lazy"
            />
            <div className="overlay absolute inset-0 movie-card-gradient opacity-0 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-5">
                <div className="mb-auto flex justify-end">
                    <button className="size-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-primary transition-colors"
                        onClick={handleToggleFavorite}
                        disabled={isLoading}
                    >
                        {favorite ? <Check className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
                    </button>
                </div>

                <div className="mb-4 flex justify-center scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                    <div className="size-12 md:size-14 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/50 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                </div>

                <div className="space-y-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold leading-tight text-sm md:text-base line-clamp-1">{title}</p>
                    <div className="flex items-center justify-between text-[10px] text-white/70 font-bold uppercase tracking-wider">
                        <span>{year || '2024'}</span>
                        <span className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-3 h-3 fill-current" />
                            {rating || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
