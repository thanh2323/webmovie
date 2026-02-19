import api from './api';
import {
    MovieListResponse,
    MovieDetailResponse,
    FilteredMovieListResponse,
    CategoryResponse,
    CountryResponse
} from '../types/api';

const MovieService = {
    getNewMovies: async (page: number = 1): Promise<MovieListResponse> => {
        const response = await api.get<MovieListResponse>('/movies/new', {
            params: { page }
        });
        return response.data;
    },

    getMovieDetail: async (slug: string): Promise<MovieDetailResponse> => {
        const response = await api.get<MovieDetailResponse>(`/movies/${slug}`);
        return response.data;
    },

    getMoviesByType: async (
        type: string,
        page: number = 1,
        category?: string,
        country?: string,
        year?: number
    ): Promise<FilteredMovieListResponse> => {
        const params: any = { page };
        if (category) params.category = category;
        if (country) params.country = country;
        if (year) params.year = year;

        const response = await api.get<FilteredMovieListResponse>(`/movies/list/${type}`, {
            params
        });
        return response.data;
    },

    searchMovies: async (keyword: string, limit: number = 10): Promise<FilteredMovieListResponse> => {
        const response = await api.get<FilteredMovieListResponse>('/movies/search', {
            params: { keyword, limit }
        });
        return response.data;
    },

    getCategories: async (): Promise<CategoryResponse> => {
        const response = await api.get<CategoryResponse>('/movies/categories');
        return response.data;
    },

    getCountries: async (): Promise<CountryResponse> => {
        const response = await api.get<CountryResponse>('/movies/countries');
        return response.data;
    },

    getMoviesByCategory: async (
        slug: string,
        page: number = 1,
        country?: string,
        year?: number
    ): Promise<FilteredMovieListResponse> => {
        const params: any = { page };
        if (country) params.country = country;
        if (year) params.year = year;

        const response = await api.get<FilteredMovieListResponse>(`/movies/category/${slug}`, {
            params
        });
        return response.data;
    },
};

export default MovieService;
