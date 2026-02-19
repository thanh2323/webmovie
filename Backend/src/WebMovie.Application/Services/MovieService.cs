using WebMovie.Application.DTOs.MovieApi;
using WebMovie.Application.Interfaces;

namespace WebMovie.Application.Services;

public class MovieService : IMovieService
{
    private readonly IMovieApiService _movieApiService;

    public MovieService(IMovieApiService movieApiService)
    {
        _movieApiService = movieApiService;
    }

    public async Task<MovieListResponse> GetNewMoviesAsync(int page = 1)
        => await _movieApiService.GetNewMoviesAsync(page);

    public async Task<MovieDetailResponse> GetMovieDetailAsync(string slug)
        => await _movieApiService.GetMovieDetailAsync(slug);

    public async Task<FilteredMovieListResponse> GetMoviesByTypeAsync(
        string type, int page = 1, string? category = null, string? country = null, int? year = null)
        => await _movieApiService.GetMoviesByTypeAsync(type, page, category, country, year);

    public async Task<FilteredMovieListResponse> SearchMoviesAsync(string keyword, int limit = 10)
        => await _movieApiService.SearchMoviesAsync(keyword, limit);

    public async Task<CategoryResponseDTO> GetCategoriesAsync()
        => await _movieApiService.GetCategoriesAsync();

    public async Task<CountryResponseDTO> GetCountriesAsync()
        => await _movieApiService.GetCountriesAsync();

    public async Task<FilteredMovieListResponse> GetMoviesByCategoryAsync(string slug, int page = 1, string? country = null, int? year = null)
        => await _movieApiService.GetMoviesByCategoryAsync(slug, page, country, year);
}
