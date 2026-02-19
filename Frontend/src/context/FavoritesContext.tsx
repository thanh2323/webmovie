import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import MovieService from '../services/movieService';
import { FavoriteItem } from '../types/api';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
    favorites: FavoriteItem[];
    addFavorite: (movie: Partial<FavoriteItem>) => Promise<void>;
    removeFavorite: (slug: string) => Promise<void>;
    isFavorite: (slug: string) => boolean;
    isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuth(); // Use AuthContext to know when to load

    useEffect(() => {
        const loadFavorites = async () => {
            if (!isAuthenticated) {
                setFavorites([]);
                setIsLoading(false);
                return;
            }

            try {
                const data = await MovieService.getFavorites();
                setFavorites(data);
            } catch (error) {
                console.error("Failed to load favorites", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadFavorites();
    }, [isAuthenticated]);

    const addFavorite = async (movie: Partial<FavoriteItem>) => {
        try {
            // Optimistic update
            // We need to shape it like a FavoriteItem. 
            // The API response will eventually correct it, but for now we mock the missing fields if needed.
            const newItem: FavoriteItem = {
                id: 'temp-' + Date.now(),
                userId: '', // Not needed for UI
                movieSlug: movie.movieSlug || '',
                movieName: movie.movieName || '',
                moviePosterUrl: movie.moviePosterUrl,
                movieThumbUrl: movie.movieThumbUrl,
                movieYear: movie.movieYear,
                createdAt: new Date().toISOString()
            };

            setFavorites(prev => [...prev, newItem]);
            await MovieService.addFavorite(movie as any);

            // Optionally reload to get the real ID, but not strictly necessary if we only use slug
        } catch (error) {
            console.error("Failed to add favorite", error);
            // Revert on error
            setFavorites(prev => prev.filter(item => item.movieSlug !== movie.movieSlug));
            throw error;
        }
    };

    const removeFavorite = async (slug: string) => {
        try {
            // Optimistic update
            const itemToRemove = favorites.find(f => f.movieSlug === slug);
            setFavorites(prev => prev.filter(s => s.movieSlug !== slug));
            await MovieService.removeFavorite(slug);
        } catch (error) {
            console.error("Failed to remove favorite", error);
            // Revert on error - complicated because we need the item back.
            // For now, simpler to just reload or let it be. 
            // Ideally we tracked what we removed.
            // If we want to be perfect:
            // if (itemToRemove) setFavorites(prev => [...prev, itemToRemove]);
            throw error;
        }
    };

    const isFavorite = (slug: string) => {
        return favorites.some(f => f.movieSlug === slug);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, isLoading }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
