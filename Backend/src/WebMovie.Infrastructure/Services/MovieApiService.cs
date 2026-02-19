using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WebMovie.Application.DTOs.MovieApi;
using WebMovie.Application.Interfaces;

namespace WebMovie.Infrastructure.ExternalApis;

public class MovieApiService : IMovieApiService
{
    private readonly HttpClient _httpClient;
    private readonly MovieApiSettings _settings;
    private readonly ILogger<MovieApiService> _logger;

    public MovieApiService(HttpClient httpClient, IOptions<MovieApiSettings> settings, ILogger<MovieApiService> logger)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        _logger = logger;
        _httpClient.BaseAddress = new Uri(_settings.BaseUrl);
    }

    public async Task<MovieListResponse> GetNewMoviesAsync(int page = 1)
    {
        _logger.LogInformation("Fetching new movies, page {Page}", page);
        var response = await _httpClient.GetAsync($"/danh-sach/phim-moi-cap-nhat?page={page}");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<MovieListResponse>(content) ?? new MovieListResponse();
    }

    public async Task<MovieDetailResponse> GetMovieDetailAsync(string slug)
    {
        _logger.LogInformation("Fetching movie detail for slug: {Slug}", slug);
        var response = await _httpClient.GetAsync($"/phim/{slug}");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<MovieDetailResponse>(content) ?? new MovieDetailResponse();
    }

    public async Task<FilteredMovieListResponse> GetMoviesByTypeAsync(
        string type, int page = 1, string? category = null, string? country = null, int? year = null)
    {
        var queryParams = new List<string> { $"page={page}" };
        if (!string.IsNullOrEmpty(category)) queryParams.Add($"category={category}");
        if (!string.IsNullOrEmpty(country)) queryParams.Add($"country={country}");
        if (year.HasValue) queryParams.Add($"year={year}");

        var queryString = string.Join("&", queryParams);
        var url = $"/v1/api/danh-sach/{type}?{queryString}";

        _logger.LogInformation("Fetching movies by type: {Url}", url);
        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<FilteredMovieListResponse>(content) ?? new FilteredMovieListResponse();
    }

    public async Task<FilteredMovieListResponse> SearchMoviesAsync(string keyword, int limit = 10)
    {
        _logger.LogInformation("Searching movies with keyword: {Keyword}", keyword);
        var response = await _httpClient.GetAsync($"/v1/api/tim-kiem?keyword={keyword}&limit={limit}");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<FilteredMovieListResponse>(content) ?? new FilteredMovieListResponse();
    }

    public async Task<FilteredMovieListResponse> GetMoviesByCategoryAsync(string slug, int page = 1)
    {
        _logger.LogInformation("Fetching movies by category: {Slug}, page {Page}", slug, page);
        var response = await _httpClient.GetAsync($"/v1/api/the-loai/{slug}?page={page}");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<FilteredMovieListResponse>(content) ?? new FilteredMovieListResponse();
    }

    public async Task<CategoryResponseDTO> GetCategoriesAsync()
    {
        _logger.LogInformation("Fetching categories");
        var response = await _httpClient.GetAsync("/the-loai");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        var list = JsonSerializer.Deserialize<List<CategoryDTO>>(content) ?? [];
        return new CategoryResponseDTO
        {
            Status = true,
            Msg = "Success",
            Data = new CategoryDataDTO { Items = list }
        };
    }

    public async Task<CountryResponseDTO> GetCountriesAsync()
    {
        _logger.LogInformation("Fetching countries");
        var response = await _httpClient.GetAsync("/quoc-gia");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        var list = JsonSerializer.Deserialize<List<CountryDTO>>(content) ?? [];
        return new CountryResponseDTO
        {
            Status = true,
            Msg = "Success",
            Data = new CountryDataDTO { Items = list }
        };
    }
}
