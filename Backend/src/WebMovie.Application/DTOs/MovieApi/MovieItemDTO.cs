using System.Text.Json.Serialization;

namespace WebMovie.Application.DTOs.MovieApi;

public class MovieItemDTO
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("slug")]
    public string Slug { get; set; } = string.Empty;

    [JsonPropertyName("origin_name")]
    public string OriginName { get; set; } = string.Empty;

    [JsonPropertyName("thumb_url")]
    public string ThumbUrl { get; set; } = string.Empty;

    [JsonPropertyName("poster_url")]
    public string PosterUrl { get; set; } = string.Empty;

    [JsonPropertyName("year")]
    public int Year { get; set; }
}
