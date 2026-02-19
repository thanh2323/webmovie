import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { PremiumMovieCard } from "../components/UI/PremiumMovieCard";
import MovieService from "../services/movieService";
import { MovieItem, Pagination } from "../types/api";
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export function CategoryPage() {
    const { slug, type } = useParams<{ slug?: string; type?: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1');

    const [movies, setMovies] = useState<MovieItem[]>([]);
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!slug && !type) return;
            setIsLoading(true);
            try {
                let data;
                if (type === 'phim-moi' || type === 'phim-moi-cap-nhat') {
                    // Special case for new movies
                    const response = await MovieService.getNewMovies(currentPage);
                    data = {
                        status: response.status,
                        data: {
                            seoOnPage: {},
                            breadCrumb: [],
                            titlePage: 'Phim Mới Cập Nhật',
                            items: response.items,
                            params: {
                                pagination: response.pagination
                            },
                            type_list: 'danh-sach'
                        }
                    };
                } else if (type) {
                    // Fetch movies by type
                    data = await MovieService.getMoviesByType(type, currentPage);
                } else if (slug) {
                    // Fetch movies by category slug
                    data = await MovieService.getMoviesByCategory(slug, currentPage);
                }

                if (data && data.status) {
                    setMovies(data.data?.items || []);
                    setTitle(data.data?.titlePage || (type || slug || ""));
                    if (data.data?.params?.pagination) {
                        setPagination(data.data.params.pagination);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch movies", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovies();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [slug, type, currentPage]);

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0e17] text-white">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#0a0e17] font-sans text-slate-100">
            <main className="flex-1 pt-24 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto w-full">
                {/* Header */}
                <div>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter mb-4 capitalize">{title}</h1>
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

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="mt-20 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                {currentPage > 3 && (
                                    <>
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                                        >
                                            1
                                        </button>
                                        <span className="text-gray-500">...</span>
                                    </>
                                )}

                                {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i)
                                    .filter(page => page > 0 && page <= pagination.totalPages)
                                    .map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 rounded-full border border-white/10 text-white transition-colors ${currentPage === page
                                                ? 'bg-primary border-primary font-bold'
                                                : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                {currentPage < pagination.totalPages - 2 && (
                                    <>
                                        <span className="text-gray-500">...</span>
                                        <button
                                            onClick={() => handlePageChange(pagination.totalPages)}
                                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                                        >
                                            {pagination.totalPages}
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.totalPages}
                                    className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        )}

                        <div className="mt-8 text-center">
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                                Showing {movies.length} titles
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-400 py-24 bg-white/5 rounded-xl border border-white/10">
                        <Search className="w-12 h-12 mx-auto text-white/20 mb-4" />
                        <p className="text-lg">No movies found in this category.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
