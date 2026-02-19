import { useEffect, useState } from "react";
import { Hero } from "../components/UI/Hero";
import { Section } from "../components/UI/Section";
import { Loader2 } from 'lucide-react';
import MovieService from "../services/movieService";
import { MovieItem, MovieInfo } from "../types/api";

export function Home() {
    const [heroMovie, setHeroMovie] = useState<MovieInfo | null>(null);
    const [newMovies, setNewMovies] = useState<MovieItem[]>([]);
    const [trendingMovies, setTrendingMovies] = useState<MovieItem[]>([]);
    const [seriesMovies, setSeriesMovies] = useState<MovieItem[]>([]);
    const [cartoonMovies, setCartoonMovies] = useState<MovieItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch new movies
                const newMoviesData = await MovieService.getNewMovies(1);
                setNewMovies(newMoviesData.items);

                // Set Hero movie (first of new movies)
                if (newMoviesData.items.length > 0) {
                    const firstMovieSlug = newMoviesData.items[0].slug;
                    const heroData = await MovieService.getMovieDetail(firstMovieSlug);
                    if (heroData.movie) {
                        setHeroMovie(heroData.movie);
                    }
                }

                // Fetch other categories in parallel
                const [trendingData, seriesData, cartoonData] = await Promise.all([
                    MovieService.getMoviesByType('phim-le', 1),
                    MovieService.getMoviesByType('phim-bo', 1),
                    MovieService.getMoviesByType('hoat-hinh', 1)
                ]);

                setTrendingMovies(trendingData.data?.items || []);
                setSeriesMovies(seriesData.data?.items || []);
                setCartoonMovies(cartoonData.data?.items || []);

            } catch (error) {
                console.error("Failed to fetch home data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    // Map API data to component props format
    const mapToSectionItems = (movies: MovieItem[]) => {
        return movies.map(m => ({
            id: m.slug, // Using slug as ID for navigation
            title: m.name,
            image: m.poster_url, // resizeImage in MovieCard handles this
            match: `${m.year}`,
            age: "13+", // Default
            duration: "N/A" // Default
        }));
    };

    return (
        <div className="pb-20">
            {/* Hero Section */}
            {heroMovie && (
                <Hero
                    title={heroMovie.name}
                    description={heroMovie.content.replace(/<[^>]*>?/gm, '').substring(0, 200) + "..."}
                    image={heroMovie.poster_url}
                    year={heroMovie.year.toString()}
                    match="New"
                    age="16+"
                    duration={heroMovie.time}
                    id={heroMovie.slug}
                />
            )}

            {/* Content Section with Responsive Negative Margin to overlap Hero slightly without breaking layout */}
            <div className="-mt-10 md:-mt-12 relative z-20 space-y-6">
                <Section
                    title="Phim Mới Cập Nhật"
                    items={mapToSectionItems(newMovies)}
                    variant="portrait"
                    link="/danh-sach/phim-moi"
                />

                <Section
                    title="Phim Lẻ Hot"
                    items={mapToSectionItems(trendingMovies)}
                    variant="portrait"
                    link="/danh-sach/phim-le"
                />

                <Section
                    title="Phim Bộ Tuyển Chọn"
                    items={mapToSectionItems(seriesMovies)}
                    variant="portrait"
                    link="/danh-sach/phim-bo"
                />

                <Section
                    title="Hoạt Hình Đặc Sắc"
                    items={mapToSectionItems(cartoonMovies)}
                    variant="portrait"
                    link="/danh-sach/hoat-hinh"
                />
            </div>
        </div>
    );
}
