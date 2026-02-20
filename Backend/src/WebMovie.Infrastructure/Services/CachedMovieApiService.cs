using Microsoft.Extensions.Logging;
using WebMovie.Application.DTOs.MovieApi;
using WebMovie.Application.Interfaces;

namespace WebMovie.Infrastructure.Services;

public class CachedMovieApiService : IMovieApiService
{
    private readonly IMovieApiService _inner;
    private readonly ICacheService _cache;
    private readonly ILogger<CachedMovieApiService> _logger;

    private static readonly TimeSpan DefaultTtl = TimeSpan.FromHours(24);

    public CachedMovieApiService(
        IMovieApiService inner,
        ICacheService cache,
        ILogger<CachedMovieApiService> logger)
    {
        _inner = inner;
        _cache = cache;
        _logger = logger;
    }

    public async Task<MovieListResponse> GetNewMoviesAsync(int page = 1)
    {
        var key = $"movies:new:page:{page}";
        return await GetOrSetAsync(key, () => _inner.GetNewMoviesAsync(page));
    }

    public async Task<MovieDetailResponse> GetMovieDetailAsync(string slug)
    {
        var key = $"movies:detail:{slug}";
        return await GetOrSetAsync(key, () => _inner.GetMovieDetailAsync(slug));
    }

    public async Task<FilteredMovieListResponse> GetMoviesByTypeAsync(
        string type, int page = 1, string? category = null, string? country = null, int? year = null)
    {
        var key = $"movies:type:{type}:p:{page}:cat:{category ?? "all"}:co:{country ?? "all"}:y:{year?.ToString() ?? "all"}";
        return await GetOrSetAsync(key, () => _inner.GetMoviesByTypeAsync(type, page, category, country, year));
    }

    public async Task<FilteredMovieListResponse> SearchMoviesAsync(string keyword, int limit = 10)
    {
        var key = $"movies:search:{keyword}:limit:{limit}";
        return await GetOrSetAsync(key, () => _inner.SearchMoviesAsync(keyword, limit));
    }

    public async Task<CategoryResponseDTO> GetCategoriesAsync()
    {
        var key = "movies:categories";
        return await GetOrSetAsync(key, () => _inner.GetCategoriesAsync());
    }

    public async Task<CountryResponseDTO> GetCountriesAsync()
    {
        var key = "movies:countries";
        return await GetOrSetAsync(key, () => _inner.GetCountriesAsync());
    }

    public async Task<FilteredMovieListResponse> GetMoviesByCategoryAsync(
        string slug, int page = 1, string? country = null, int? year = null)
    {
        var key = $"movies:category:{slug}:p:{page}:co:{country ?? "all"}:y:{year?.ToString() ?? "all"}";
        return await GetOrSetAsync(key, () => _inner.GetMoviesByCategoryAsync(slug, page, country, year));
    }

    private async Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory) where T : new()
    {
        var cached = await _cache.GetAsync<T>(key);
        if (cached is not null)
        {
            _logger.LogInformation("Cache HIT: {Key}", key);
            return cached;
        }

        _logger.LogInformation("Cache MISS: {Key} — calling external API", key);
        var result = await factory();
        await _cache.SetAsync(key, result, DefaultTtl);
        return result;
    }
}
