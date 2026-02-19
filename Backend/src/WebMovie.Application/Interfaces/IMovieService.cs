using WebMovie.Application.DTOs.MovieApi;

namespace WebMovie.Application.Interfaces;

public interface IMovieService
{
    Task<MovieListResponse> GetNewMoviesAsync(int page = 1);
    Task<MovieDetailResponse> GetMovieDetailAsync(string slug);
    Task<FilteredMovieListResponse> GetMoviesByTypeAsync(string type, int page = 1, string? category = null, string? country = null, int? year = null);
    Task<FilteredMovieListResponse> SearchMoviesAsync(string keyword, int limit = 10);
    Task<CategoryResponseDTO> GetCategoriesAsync();
    Task<CountryResponseDTO> GetCountriesAsync();
    Task<FilteredMovieListResponse> GetMoviesByCategoryAsync(string slug, int page = 1);
}
