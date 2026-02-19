using System.Text.Json.Serialization;

namespace WebMovie.Application.DTOs.MovieApi;

public class EpisodeDataDTO
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("slug")]
    public string Slug { get; set; } = string.Empty;

    [JsonPropertyName("filename")]
    public string Filename { get; set; } = string.Empty;

    [JsonPropertyName("link_embed")]
    public string LinkEmbed { get; set; } = string.Empty;

    [JsonPropertyName("link_m3u8")]
    public string LinkM3u8 { get; set; } = string.Empty;
}

public class EpisodeServerDTO
{
    [JsonPropertyName("server_name")]
    public string ServerName { get; set; } = string.Empty;

    [JsonPropertyName("server_data")]
    public IEnumerable<EpisodeDataDTO> ServerData { get; set; } = [];
}
