import { Facebook, Twitter, Instagram, Youtube, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

export function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-black text-gray-400 border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-primary blur-[100px] opacity-20"></div>

            <div className="container mx-auto px-4 md:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 inline-block">
                            <img src={logo} alt="StreamFlix Logo" className="w-8 h-8 object-contain" />
                            <span className="text-2xl font-black text-primary tracking-tighter uppercase font-display">
                                Stream<span className="text-white">Flix</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Experience the future of cinema. Immersive storytelling, crystal clear quality, and a library that never sleeps.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary hover:text-white transition-all duration-300">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {[
                        { title: "Browse", links: ["Home", "Movies", "TV Shows", "New & Popular"] },
                        { title: "Support", links: ["FAQ", "Help Center", "Terms of Use", "Privacy Policy"] },
                        { title: "Account", links: ["My Profile", "Subscription", "Watchlist", "Settings"] }
                    ].map((col) => (
                        <div key={col.title}>
                            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">{col.title}</h4>
                            <ul className="space-y-3">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm hover:text-primary transition-colors duration-200 flex items-center gap-2 group">
                                            <span className="w-0 h-px bg-primary transition-all duration-300 group-hover:w-2"></span>
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-600">
                        © {new Date().getFullYear()} StreamFlix Inc. All rights reserved.
                    </p>

                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors group"
                    >
                        Back to Top
                        <ArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>
        </footer>
    );
}
