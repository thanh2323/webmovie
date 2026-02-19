import { Play, Plus, Loader2, PlayCircle, Check } from 'lucide-react';
import { Section } from '../components/UI/Section';
import { CommentSection } from '../components/UI/CommentSection';
import { resizeImage } from '../lib/utils';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import MovieService from '../services/movieService';
import { MovieInfo, EpisodeServer, MovieItem } from '../types/api';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

export function MovieDetail() {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<MovieInfo | null>(null);
    const [episodes, setEpisodes] = useState<EpisodeServer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [relatedMovies, setRelatedMovies] = useState<MovieItem[]>([]);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    // Use global favorites context
    const { isFavorite: checkIsFavorite, addFavorite, removeFavorite } = useFavorites();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

    // Derived state
    const isFavorite = movie ? checkIsFavorite(movie.slug) : false;


    useEffect(() => {
        const fetchMovieDetail = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await MovieService.getMovieDetail(id);
                if (data.status && data.movie) {
                    setMovie(data.movie);
                    setEpisodes(data.episodes || []);

                    // Fetch related movies based on category if available (optional enhancement)
                    // For now, let's just fetch some random or similar movies if we had an endpoint
                    // We can reuse getNewMovies or specific category for "More Like This"
                    const similarData = await MovieService.getNewMovies(1);
                    setRelatedMovies(similarData.items.slice(0, 10)); // Just exclude current one ideally
                }
            } catch (error) {
                console.error("Failed to fetch movie details", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetail();
    }, [id]);

    const handleToggleFavorite = async () => {
        if (!movie) return;

        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }

        if (isFavoriteLoading) return;

        setIsFavoriteLoading(true);
        try {
            if (isFavorite) {
                await removeFavorite(movie.slug);
            } else {
                await addFavorite({
                    movieSlug: movie.slug,
                    movieName: movie.name,
                    moviePosterUrl: movie.poster_url,
                    movieThumbUrl: movie.thumb_url,
                    movieYear: movie.year
                });
            }
        } catch (error) {
            console.error("Failed to toggle favorite", error);
            // Ideally show a toast notification here
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!movie) {
        return <div className="min-h-screen flex items-center justify-center text-white">Movie not found</div>;
    }

    // Helper to extract text from HTML content
    const stripHtml = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const mapToSectionItems = (movies: MovieItem[]) => {
        return movies.map(m => ({
            id: m.slug,
            title: m.name,
            image: m.poster_url.startsWith('http') ? m.poster_url : `https://img.phimapi.com/${m.poster_url}`,
            match: `${m.year}`,
            age: "13+",
            duration: "N/A"
        }));
    };

    // Determine the first stream url if available for "Play" button
    const firstEpisodeUrl = episodes.length > 0 && episodes[0].server_data.length > 0
        ? episodes[0].server_data[0].link_embed
        : null;



    // Helper to get YouTube Embed URL
    const getYoutubeEmbedUrl = (url: string) => {
        try {
            const videoId = url.split('v=')[1]?.split('&')[0];
            return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
        } catch (e) {
            return url;
        }
    };

    return (
        <div className="bg-background min-h-screen text-white pb-12">
            {/* Cinematic Header */}
            <div className="relative h-auto min-h-[50vh] md:min-h-[70vh] w-full flex flex-col justify-end">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${resizeImage(movie.poster_url)}')` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                </div>

                <div className="relative z-10 w-full p-4 md:p-16 flex flex-col justify-end pt-32 md:pt-0">
                    <div className="max-w-4xl animate-fade-in">
                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-black mb-4 font-display italic tracking-tighter">
                            {movie.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm font-medium text-gray-300 mb-6">
                            <span className="text-green-500 font-bold">{movie.year}</span>
                            <span>{movie.country.map(c => c.name).join(', ')}</span>
                            <span className="border border-gray-500 px-1 rounded text-[10px] md:text-xs">{movie.quality}</span>
                            <span>{movie.time}</span>
                            <span className="border border-gray-500 px-1 rounded text-[10px] md:text-xs">{movie.lang}</span>
                        </div>

                        <p className="text-sm md:text-lg text-gray-200 mb-8 leading-relaxed max-w-2xl drop-shadow-md line-clamp-3 md:line-clamp-none">
                            {stripHtml(movie.content).substring(0, 300)}...
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            {firstEpisodeUrl ? (
                                <Link to={`/watch/${movie.slug}`} className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded font-bold hover:bg-gray-200 transition">
                                    <Play className="w-5 h-5 fill-current" />
                                    Play
                                </Link>
                            ) : (
                                <button disabled className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-gray-300 rounded font-bold cursor-not-allowed">
                                    <Play className="w-5 h-5 fill-current" />
                                    Not Available
                                </button>
                            )}

                            <button
                                onClick={handleToggleFavorite}
                                disabled={isFavoriteLoading}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500/50 backdrop-blur-md text-white rounded font-bold hover:bg-gray-500/70 transition disabled:opacity-50"
                            >
                                {isFavorite ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        My List
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        My List
                                    </>
                                )}
                            </button>

                        </div>
                    </div>
                </div>
                <div className="hidden md:flex absolute right-0 bottom-[30%] h-12 bg-white/10 backdrop-blur-md px-4 items-center border-l-2 border-white">
                    <span className="text-gray-300 font-medium">13+</span>
                </div>
            </div>

            {/* Content Body */}
            <div className="px-4 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                        <span className="font-bold text-white">Genres:</span> {movie.category.map(c => c.name).join(', ')}
                    </div>

                    <div className="bg-surface p-8 rounded-lg border border-white/5">
                        <h3 className="text-xl font-bold mb-4">About {movie.name}</h3>
                        <div
                            className="text-gray-400 leading-relaxed mb-4 text-sm"
                            dangerouslySetInnerHTML={{ __html: movie.content }}
                        />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 block">Director</span>
                                <span className="text-white">{movie.director.join(', ') || 'Unknown'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Cast</span>
                                <span className="text-white">{movie.actor.join(', ') || 'Unknown'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Origin</span>
                                <span className="text-white">{movie.origin_name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Episodes</span>
                                <span className="text-white">{movie.episode_current} / {movie.episode_total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Episode List if series */}
                    {episodes.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-bold mb-4 text-gray-300">Episodes</h3>
                            {episodes.map((server, idx) => (
                                <div key={idx} className="mb-6">
                                    <h4 className="text-sm uppercase text-gray-500 mb-2">{server.server_name}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {server.server_data.map((ep, epIdx) => (
                                            <Link
                                                key={epIdx}
                                                to={`/watch/${movie.slug}?episode=${ep.slug}`}
                                                className="px-4 py-2 bg-surface hover:bg-primary/20 border border-white/10 rounded text-sm hover:text-primary transition"
                                            >
                                                {ep.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1 order-2 lg:order-none">
                    <h3 className="text-lg font-bold mb-4 text-gray-300">Trailers & More</h3>
                    <div className="space-y-4">
                        {movie.trailer_url ? (
                            <div className="group cursor-pointer" onClick={() => setIsTrailerOpen(true)}>
                                <div className="block relative aspect-video rounded-md overflow-hidden mb-2">
                                    <img src={resizeImage(movie.thumb_url)} alt="Trailer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                                        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                                            <PlayCircle className="w-10 h-10 fill-white/20 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">No trailer available</div>
                        )}
                    </div>
                </div>

                {/* Comment Section - Moved here to be after Trailers on Mobile, but wrap correctly on Desktop */}
                <div className="mt-8 lg:mt-0 lg:col-span-2 order-3 lg:order-none">
                    <CommentSection />
                </div>
            </div>

            <Section title="Usefull Movies" items={mapToSectionItems(relatedMovies)} />

            {/* Trailer Modal */}
            {isTrailerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setIsTrailerOpen(false)}>
                    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsTrailerOpen(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                        <iframe
                            className="w-full h-full"
                            src={getYoutubeEmbedUrl(movie.trailer_url)}
                            title="Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
}
