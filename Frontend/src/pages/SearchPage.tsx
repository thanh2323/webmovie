import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PremiumMovieCard } from "../components/UI/PremiumMovieCard";
import MovieService from "../services/movieService";
import { MovieItem } from "../types/api";
import { Loader2, Search } from 'lucide-react';


export function SearchPage() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    const [movies, setMovies] = useState<MovieItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!keyword) {
                setMovies([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await MovieService.searchMovies(keyword, 20); // Limit 20 for better grid fill
                if (response.status && response.data) {
                    setMovies(response.data.items || []);
                }
            } catch (error) {
                console.error("Failed to search movies", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [keyword]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0e17] text-white">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#0a0e17] font-sans text-slate-100">
            {/* 
               We assume this page is routed within MainLayout in App.tsx, so Navbar is already there.
               If it's not, we would need <Navbar /> here. 
               Let's check App.tsx layout structure. 
               If it is NOT in MainLayout, we should uncomment line below or add it to MainLayout routes.
               For consistency with other pages like CategoryPage which seems to be in MainLayout (based on its padding), 
               we should probably put this in MainLayout.
            */}

            <main className="flex-1 pt-24 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto w-full">
                {/* Header */}
                <div className="mb-8">
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Search Results for</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter">"{keyword}"</h1>
                </div>

                {/* Movies Grid */}
                {movies.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                            {movies.map((movie) => (
                                <PremiumMovieCard
                                    key={movie.slug}
                                    id={movie.slug}
                                    title={movie.name}
                                    image={movie.poster_url}
                                    year={movie.year.toString()}
                                />
                            ))}
                        </div>

                        <div className="mt-12 text-center border-t border-white/5 pt-8">
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                                Found {movies.length} matches
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="bg-white/5 p-6 rounded-full mb-6">
                            <Search className="w-12 h-12 text-white/30" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                        <p className="text-gray-400 max-w-md">
                            We couldn't find any movies matching "{keyword}". Try searching with a different keyword or check the spelling.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
