import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, Globe, SkipForward } from 'lucide-react';
import MovieService from '../services/movieService';
import { MovieInfo, EpisodeServer, EpisodeData } from '../types/api';
import { CommentSection } from '../components/UI/CommentSection';

export function WatchPage() {
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const episodeSlug = searchParams.get('episode');

    const [movie, setMovie] = useState<MovieInfo | null>(null);
    const [episodes, setEpisodes] = useState<EpisodeServer[]>([]);
    const [currentEpisode, setCurrentEpisode] = useState<EpisodeData | null>(null);
    const [currentServer, setCurrentServer] = useState<EpisodeServer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await MovieService.getMovieDetail(id);
                if (data.status && data.movie) {
                    setMovie(data.movie);
                    setEpisodes(data.episodes || []);

                    if (data.episodes && data.episodes.length > 0) {
                        let selectedServer = data.episodes[0];
                        let selectedEpisode = data.episodes[0].server_data[0];

                        // Try to find the requested episode in all servers
                        if (episodeSlug) {
                            for (const server of data.episodes) {
                                const foundEp = server.server_data.find(e => e.slug === episodeSlug);
                                if (foundEp) {
                                    selectedServer = server;
                                    selectedEpisode = foundEp;
                                    break;
                                }
                            }
                        }

                        setCurrentServer(selectedServer);
                        setCurrentEpisode(selectedEpisode);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch movie", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovie();
    }, [id, episodeSlug]); // Re-run if ID or episodeSlug changes

    const handleEpisodeChange = (episode: EpisodeData) => {
        setSearchParams({ episode: episode.slug });
        setCurrentEpisode(episode);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!movie || !currentEpisode) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
                <h2 className="text-2xl font-bold mb-4">Movie or Episode Not Found</h2>
                <Link to="/" className="text-primary hover:underline">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen text-white pb-12 pt-20">
            {/* Player Container - Theater Mode */}
            <div className="w-full max-w-[1600px] mx-auto px-0 md:px-4 mb-8">
                <div className="relative aspect-video w-full bg-black shadow-2xl md:rounded-xl overflow-hidden border border-white/5">
                    <iframe
                        src={currentEpisode.link_embed}
                        title={`Watching ${movie.name} - ${currentEpisode.name}`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Control Bar / Info */}
                <div className="bg-surface border-x border-b border-white/5 md:rounded-b-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
                            {movie.name} <span className="text-gray-400 font-normal text-lg">- {currentEpisode.name}</span>
                        </h1>
                        <div className="flex flex-wrap gap-4 text-xs md:text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{movie.year}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{movie.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Globe className="w-4 h-4" />
                                <span>{movie.country.map(c => c.name).join(', ')}</span>
                            </div>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition text-sm font-bold">
                        <SkipForward className="w-4 h-4" />
                        Next Episode
                    </button>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Episodes & Server Selection */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Server Selection */}
                    {episodes.length > 1 && (
                        <div className="bg-surface rounded-xl p-6 border border-white/5">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                Select Server
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {episodes.map((server, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentServer(server)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentServer?.server_name === server.server_name
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                            }`}
                                    >
                                        {server.server_name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Episode List */}
                    {currentServer && (
                        <div className="bg-surface rounded-xl p-6 border border-white/5">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                Episodes
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                                {currentServer.server_data.map((ep, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleEpisodeChange(ep)}
                                        className={`py-2 px-1 rounded-md text-xs sm:text-sm font-medium transition truncate ${currentEpisode?.slug === ep.slug
                                            ? 'bg-primary text-white'
                                            : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                            }`}
                                    >
                                        {ep.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comments */}
                    <div className="mt-8">
                        <CommentSection />
                    </div>
                </div>

                {/* Right Column: Movie Info & Suggestions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-surface rounded-xl p-6 border border-white/5 sticky top-24">
                        <div className="flex gap-4 mb-4">
                            <img src={movie.thumb_url} alt={movie.name} className="w-24 h-36 object-cover rounded-lg shadow-lg" />
                            <div>
                                <h3 className="font-bold text-white mb-2 line-clamp-2">{movie.name}</h3>
                                <p className="text-gray-400 text-xs mb-2">{movie.origin_name}</p>
                                <div className="flex flex-wrap gap-1">
                                    {movie.category.map(c => (
                                        <span key={c.id} className="text-[10px] px-2 py-1 bg-white/5 rounded text-gray-300">
                                            {c.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-6 hover:line-clamp-none transition-all cursor-pointer">
                            <div dangerouslySetInnerHTML={{ __html: movie.content }} />
                        </div>

                        <Link to={`/title/${movie.slug}`} className="block w-full py-2 text-center bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-gray-300 transition">
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
