using System.Text.Json.Serialization;

namespace WebMovie.Application.DTOs.MovieApi;

public class MovieInfoDTO
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("slug")]
    public string Slug { get; set; } = string.Empty;

    [JsonPropertyName("origin_name")]
    public string OriginName { get; set; } = string.Empty;

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("thumb_url")]
    public string ThumbUrl { get; set; } = string.Empty;

    [JsonPropertyName("poster_url")]
    public string PosterUrl { get; set; } = string.Empty;

    [JsonPropertyName("is_copyright")]
    public bool IsCopyright { get; set; }

    [JsonPropertyName("sub_docquyen")]
    public bool SubDocquyen { get; set; }

    [JsonPropertyName("chieurap")]
    public bool Chieurap { get; set; }

    [JsonPropertyName("trailer_url")]
    public string TrailerUrl { get; set; } = string.Empty;

    [JsonPropertyName("time")]
    public string Time { get; set; } = string.Empty;

    [JsonPropertyName("episode_current")]
    public string EpisodeCurrent { get; set; } = string.Empty;

    [JsonPropertyName("episode_total")]
    public string EpisodeTotal { get; set; } = string.Empty;

    [JsonPropertyName("quality")]
    public string Quality { get; set; } = string.Empty;

    [JsonPropertyName("lang")]
    public string Lang { get; set; } = string.Empty;

    [JsonPropertyName("notify")]
    public string Notify { get; set; } = string.Empty;

    [JsonPropertyName("showtimes")]
    public string Showtimes { get; set; } = string.Empty;

    [JsonPropertyName("year")]
    public int Year { get; set; }

    [JsonPropertyName("view")]
    public int View { get; set; }

    [JsonPropertyName("actor")]
    public IEnumerable<string> Actor { get; set; } = [];

    [JsonPropertyName("director")]
    public IEnumerable<string> Director { get; set; } = [];

    [JsonPropertyName("category")]
    public IEnumerable<CategoryDTO> Category { get; set; } = [];

    [JsonPropertyName("country")]
    public IEnumerable<CountryDTO> Country { get; set; } = [];
}
