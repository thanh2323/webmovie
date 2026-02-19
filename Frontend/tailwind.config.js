/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#E50914', // Crimson Red
                secondary: '#B81D24', // Darker Red
                background: '#050505', // Deep Black
                surface: '#121212', // Dark Gray Surface
                'surface-hover': '#1E1E1E',
                'text-primary': '#FFFFFF',
                'text-secondary': '#B3B3B3',
                accent: '#E50914',
            },
            fontFamily: {
                sans: ['"Be Vietnam Pro"', 'sans-serif'],
                display: ['"Be Vietnam Pro"', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '8px',
                'lg': '12px',
                'xl': '16px',
                '2xl': '24px',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'shimmer': {
                    '100%': { transform: 'translateX(100%)' },
                }
            },
            animation: {
                'fade-in': 'fade-in 0.5s ease-out',
                'slide-up': 'slide-up 0.7s ease-out',
                'scale-in': 'scale-in 0.3s ease-out',
                'shimmer': 'shimmer 2s infinite',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #E50914 0deg, rgba(229, 9, 20, 0.5) 180deg, #E50914 360deg)',
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar')({ nocompatible: true }),
        require('tailwindcss-animate'),
    ],
}
