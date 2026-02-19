using System.Text.Json.Serialization;

namespace WebMovie.Application.DTOs.MovieApi;

public class MovieDetailResponse
{
    [JsonPropertyName("status")]
    public bool Status { get; set; }

    [JsonPropertyName("msg")]
    public string Msg { get; set; } = string.Empty;

    [JsonPropertyName("movie")]
    public MovieInfoDTO? Movie { get; set; }

    [JsonPropertyName("episodes")]
    public IEnumerable<EpisodeServerDTO> Episodes { get; set; } = [];
}
