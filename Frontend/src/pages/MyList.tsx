import { MovieCard } from "../components/UI/MovieCard";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export function MyList() {
    const { favorites, isLoading: isFavoritesLoading } = useFavorites();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    if (isAuthLoading || isFavoritesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-white pt-24">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white pt-24 px-4">
                <p className="text-lg mb-4">Please log in to view your list.</p>
                <Link to="/login" className="px-6 py-2 bg-primary text-white rounded font-bold hover:bg-primary/80 transition">
                    Login
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 px-4 md:px-12 min-h-screen pb-12 bg-background">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-white">My List</h1>

            {favorites.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    {favorites.map((movie) => (
                        <div key={movie.movieSlug} className="w-full">
                            <MovieCard
                                id={movie.movieSlug}
                                title={movie.movieName}
                                image={movie.moviePosterUrl || ''}
                                year={movie.movieYear ? movie.movieYear.toString() : undefined}
                                variant="portrait"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <p>Your list is empty.</p>
                    <p className="text-sm mt-2">Add shows and movies that you want to watch later.</p>
                </div>
            )}
        </div>
    );
}
