using System.Text.Json.Serialization;


namespace WebMovie.Application.DTOs.MovieApi;

public class FilteredParamsDTO
{
    [JsonPropertyName("type_slug")]
    public string TypeSlug { get; set; } = string.Empty;

    [JsonPropertyName("filterCategory")]
    public IEnumerable<string> FilterCategory { get; set; } = [];

    [JsonPropertyName("filterCountry")]
    public IEnumerable<string> FilterCountry { get; set; } = [];

    [JsonPropertyName("filterYear")]
    public IEnumerable<string> FilterYear { get; set; } = [];

    [JsonPropertyName("sortType")]
    public string SortType { get; set; } = string.Empty;

    [JsonPropertyName("pagination")]
    public PaginationDTO? Pagination { get; set; }
}

public class FilteredDataDTO
{
    [JsonPropertyName("seoOnPage")]
    public object? SeoOnPage { get; set; }

    [JsonPropertyName("breadCrumb")]
    public IEnumerable<object> BreadCrumb { get; set; } = [];

    [JsonPropertyName("titlePage")]
    public string TitlePage { get; set; } = string.Empty;

    [JsonPropertyName("items")]
    public IEnumerable<MovieItemDTO> Items { get; set; } = [];

    [JsonPropertyName("params")]
    public FilteredParamsDTO? Params { get; set; }
    
    [JsonPropertyName("type_list")]
    public string TypeList { get; set; } = string.Empty;
    
    [JsonPropertyName("APP_DOMAIN_CDN_IMAGE")]
    public string AppDomainCdnImage { get; set; } = string.Empty;
}

public class FilteredMovieListResponse
{
    [JsonPropertyName("status")]
    public object Status { get; set; }
    
    [JsonPropertyName("msg")]
    public string Msg { get; set; } = string.Empty;

    [JsonPropertyName("data")]
    public FilteredDataDTO? Data { get; set; }
}
