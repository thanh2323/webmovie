import { Link } from 'react-router-dom';
import { Search, Bell, Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import MovieService from '../../services/movieService';
import { Category } from '../../types/api';
import logo from '../../assets/logo.svg';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, isAuthenticated, logout } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await MovieService.getCategories();
                if (response.status && response.data) {
                    // Filter out "Phim 18+" category
                    const filteredCategories = response.data.items.filter(
                        (category) => category.slug !== 'phim-18' && !category.name.includes('18+')
                    );
                    setCategories(filteredCategories);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);
    // Removed unused location

    // Effect to handle scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    return (
        <nav
            className={cn(
                "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent",
                isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg border-white/5" : "bg-gradient-to-b from-black/80 to-transparent"
            )}
        >
            <div className="px-4 md:px-8 lg:px-8 xl:px-12 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="StreamFlix Logo" className="w-8 h-8 lg:w-10 lg:h-10 object-contain" />
                        <span className="text-2xl lg:text-3xl font-black text-primary tracking-tighter uppercase font-display">
                            Stream<span className="text-white">Flix</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-4 lg:gap-6 text-sm font-medium text-text-secondary">
                        <Link to="/" className="text-white hover:text-primary transition-colors">Trang Chủ</Link>
                        <Link to="/danh-sach/phim-moi-cap-nhat" className="hover:text-primary transition-colors">Phim Mới</Link>

                        <Link to="/danh-sach/phim-le" className="hover:text-primary transition-colors">Phim Lẻ</Link>
                        <Link to="/danh-sach/phim-bo" className="hover:text-primary transition-colors">Phim Bộ</Link>

                        {/* Movies Dropdown Group */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors focus:outline-none py-2">
                                Thể Loại
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute left-0 top-full mt-0 w-64 bg-surface border border-white/10 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 max-h-[80vh] overflow-y-auto grid grid-cols-2 gap-1 p-2">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        to={`/the-loai/${category.slug}`}
                                        className="block px-4 py-2 hover:bg-white/10 hover:text-primary transition-colors text-text-secondary hover:text-white text-sm rounded"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link to="/my-list" className="hover:text-primary transition-colors">Phim của tôi</Link>
                    </div>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-4 text-white">
                    {/* Search Bar */}
                    <div className={`flex items-center bg-transparent border border-white/0 rounded-full transition-all duration-300 ${isSearchOpen ? 'bg-white/10 border-white/20 pl-4 py-1.5' : 'p-2'}`}>
                        {isSearchOpen && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (searchQuery.trim()) {
                                        window.location.href = `/tim-kiem?keyword=${encodeURIComponent(searchQuery)}`;
                                        setIsSearchOpen(false);
                                    }
                                }}
                                className="mr-2"
                            >
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm..."
                                    className="bg-transparent border-none focus:outline-none text-white text-sm w-32 lg:w-48 placeholder-gray-400"
                                    autoFocus
                                />
                            </form>
                        )}
                        <button
                            onClick={() => {
                                if (isSearchOpen && searchQuery.trim()) {
                                    window.location.href = `/tim-kiem?keyword=${encodeURIComponent(searchQuery)}`;
                                    setIsSearchOpen(false);
                                } else {
                                    setIsSearchOpen(!isSearchOpen);
                                }
                            }}
                            className={`${isSearchOpen ? 'pr-3' : 'hover:bg-white/10 p-0 rounded-full'} transition-colors`}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    </button>

                    {/* Profile Dropdown */}
                    {isAuthenticated ? (
                        <div className="hidden lg:flex items-center gap-2 cursor-pointer group relative">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded overflow-hidden border border-white/20 group-hover:border-primary transition-colors duration-300">
                                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=60" alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-sm font-medium hidden lg:block">{user?.displayName}</span>
                                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                            </div>

                            <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-white/10 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div className="px-4 py-2 border-b border-white/5 mb-1">
                                    <p className="text-xs text-gray-400">Đăng nhập với</p>
                                    <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden lg:flex items-center gap-4">
                            <Link to="/login" className="text-sm font-bold hover:text-primary transition-colors">Đăng Nhập</Link>
                            <Link to="/register" className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-4 py-2 rounded transition-colors">Đăng Ký</Link>
                        </div>
                    )}

                    {/* Mobile Menu Button - Visible on lg and below */}
                    <button
                        className="lg:hidden text-white ml-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-surface border-t border-white/10 p-4 flex flex-col gap-4 lg:hidden animate-slide-up shadow-2xl h-[calc(100vh-80px)] overflow-y-auto">
                    <Link
                        to="/"
                        className="text-gray-300 hover:text-white py-2 font-medium border-b border-white/5"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Trang Chủ
                    </Link>
                    <Link
                        to="/danh-sach/phim-le"
                        className="text-gray-300 hover:text-white py-2 font-medium border-b border-white/5"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Phim Lẻ
                    </Link>
                    <Link
                        to="/danh-sach/phim-bo"
                        className="text-gray-300 hover:text-white py-2 font-medium border-b border-white/5"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Phim Bộ
                    </Link>

                    {/* Mobile Categories Dropdown */}
                    <div className="border-b border-white/5 pb-2">
                        <button
                            onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                            className="flex items-center justify-between w-full text-gray-300 hover:text-white py-2 font-medium"
                        >
                            Thể Loại
                            <ChevronDown className={cn("w-4 h-4 transition-transform", isMobileCategoryOpen ? "rotate-180" : "")} />
                        </button>

                        {isMobileCategoryOpen && (
                            <div className="pl-4 flex flex-col gap-2 mt-2 border-l border-white/10 ml-2">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        to={`/the-loai/${category.slug}`}
                                        className="text-gray-400 hover:text-primary py-1 text-sm block"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/my-list"
                        className="text-gray-300 hover:text-white py-2 font-medium border-b border-white/5"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Danh Sách
                    </Link>

                    {!isAuthenticated && (
                        <div className="flex flex-col gap-3 mt-2">
                            <Link
                                to="/login"
                                className="text-center w-full py-2 rounded border border-white/10 hover:bg-white/5 transition-colors text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Đăng Nhập
                            </Link>
                            <Link
                                to="/register"
                                className="text-center w-full py-2 rounded bg-primary hover:bg-primary/90 transition-colors text-white font-bold"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Đăng Ký
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
