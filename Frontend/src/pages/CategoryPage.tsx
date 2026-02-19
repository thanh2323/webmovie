import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { PremiumMovieCard } from "../components/UI/PremiumMovieCard";
import MovieService from "../services/movieService";
import { MovieItem, Pagination, Category, Country } from "../types/api";
import { Loader2, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export function CategoryPage() {
    const { slug, type } = useParams<{ slug?: string; type?: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1');

    const [movies, setMovies] = useState<MovieItem[]>([]);
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    // Filter data
    const [categories, setCategories] = useState<Category[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);

    // Active Filter states (used for fetching)
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [activeCountry, setActiveCountry] = useState<string>("");
    const [activeYear, setActiveYear] = useState<string>("");

    // Pending Filter states (ui input)
    const [pendingCategory, setPendingCategory] = useState<string>("");
    const [pendingCountry, setPendingCountry] = useState<string>("");
    const [pendingYear, setPendingYear] = useState<string>("");

    // Generate years list (current year back to 2000)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2000 }, (_, i) => currentYear - i);

    // Track previous route to handle resets
    const lastRouteRef = useRef({ slug, type });

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [categoryData, countryData] = await Promise.all([
                    MovieService.getCategories(),
                    MovieService.getCountries()
                ]);
                if (categoryData.data?.items) setCategories(categoryData.data.items);
                if (countryData.data?.items) setCountries(countryData.data.items);
            } catch (error) {
                console.error("Failed to fetch filters", error);
            }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!slug && !type) return;
            setIsLoading(true);
            try {
                // Check if route changed to force reset filters
                const isRouteChanged = lastRouteRef.current.slug !== slug || lastRouteRef.current.type !== type;
                let effectiveCategory = activeCategory;
                let effectiveCountry = activeCountry;
                let effectiveYear = activeYear;

                if (isRouteChanged) {
                    effectiveCategory = "";
                    effectiveCountry = "";
                    effectiveYear = "";

                    // Reset UI state
                    setActiveCategory("");
                    setActiveCountry("");
                    setActiveYear("");
                    setPendingCategory("");
                    setPendingCountry("");
                    setPendingYear("");

                    // Update Ref
                    lastRouteRef.current = { slug, type };
                }

                let data;
                if (type === 'phim-moi' || type === 'phim-moi-cap-nhat') {
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
                    data = await MovieService.getMoviesByType(
                        type,
                        currentPage,
                        effectiveCategory,
                        effectiveCountry,
                        effectiveYear ? parseInt(effectiveYear) : undefined
                    );
                } else if (slug) {
                    data = await MovieService.getMoviesByCategory(
                        slug,
                        currentPage,
                        effectiveCountry,
                        effectiveYear ? parseInt(effectiveYear) : undefined
                    );
                }

                if (data && data.status) {
                    setMovies(data.data?.items || []);

                    setTitle(data.data?.titlePage || (type || slug || ""));

                    if (data.data?.params?.pagination) {
                        setPagination(data.data.params.pagination);
                    }
                } else {
                    setMovies([]);
                }
            } catch (error) {
                console.error("Failed to fetch movies", error);
                setMovies([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [slug, type, currentPage, activeCategory, activeCountry, activeYear]);

    // Auto-reset handled in main useEffect


    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() });
    };

    const handleApplyFilter = () => {
        setActiveCategory(pendingCategory);
        setActiveCountry(pendingCountry);
        setActiveYear(pendingYear);
        setSearchParams({ page: '1' }); // Reset to page 1
    };

    const handleClearFilter = () => {
        setPendingCategory("");
        setPendingCountry("");
        setPendingYear("");
        setActiveCategory("");
        setActiveCountry("");
        setActiveYear("");
        setSearchParams({ page: '1' });
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#0a0e17] font-sans text-slate-100">
            <main className="flex-1 pt-24 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto w-full">
                {/* Header & Filters */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter mb-6 capitalize leading-tight">{title}</h1>

                    {/* Filter Bar */}
                    {(type || slug) && (type !== 'phim-moi' && type !== 'phim-moi-cap-nhat') && (
                        <div className="p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                <div className="flex items-center gap-2 text-primary font-bold min-w-fit mb-2 md:mb-0">
                                    <Filter size={20} />
                                    <span>Bộ Lọc:</span>
                                </div>

                                <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 w-full">
                                    {/* Category Filter - Hide if on specific category page */}
                                    {!slug && (
                                        <div className="relative col-span-1 md:w-auto">
                                            <select
                                                value={pendingCategory}
                                                onChange={(e) => setPendingCategory(e.target.value)}
                                                className="w-full appearance-none bg-[#0a0e17] border border-white/20 text-white py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm md:text-base cursor-pointer hover:border-white/40"
                                            >
                                                <option value="">thể loại</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-white/50">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    )}

                                    {/* Country Filter */}
                                    <div className="relative col-span-1 md:w-auto">
                                        <select
                                            value={pendingCountry}
                                            onChange={(e) => setPendingCountry(e.target.value)}
                                            className="w-full appearance-none bg-[#0a0e17] border border-white/20 text-white py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm md:text-base cursor-pointer hover:border-white/40"
                                        >
                                            <option value="">quốc gia</option>
                                            {countries.map(country => (
                                                <option key={country.id} value={country.slug}>{country.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-white/50">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>

                                    {/* Year Filter */}
                                    <div className="relative col-span-1 md:w-auto">
                                        <select
                                            value={pendingYear}
                                            onChange={(e) => setPendingYear(e.target.value)}
                                            className="w-full appearance-none bg-[#0a0e17] border border-white/20 text-white py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm md:text-base cursor-pointer hover:border-white/40"
                                        >
                                            <option value="">năm</option>
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-white/50">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>

                                    {/* Apply Button */}
                                    <button
                                        onClick={handleApplyFilter}
                                        className="col-span-1 md:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/25"
                                    >
                                        Lọc
                                    </button>

                                    {/* Clear Filter Button */}
                                    {(activeCategory || activeCountry || activeYear || pendingCategory || pendingCountry || pendingYear) && (
                                        <button
                                            onClick={handleClearFilter}
                                            className="col-span-1 md:w-auto bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-6 rounded-xl transition-all active:scale-95"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
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

                                        {/* Pagination Numbers - Responsive Hide */}
                                        <div className="hidden sm:flex items-center gap-2">
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
                                        </div>

                                        {/* Mobile Page Indicator */}
                                        <span className="sm:hidden mx-2 text-sm text-gray-400 font-medium">
                                            {currentPage} / {pagination.totalPages}
                                        </span>

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
                                <p className="text-lg mb-2">Không tìm thấy phim phù hợp.</p>
                                <p className="text-sm text-gray-500 mb-6">Thử điều chỉnh bộ lọc để tìm kết quả khác.</p>
                                <button
                                    onClick={handleClearFilter}
                                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
