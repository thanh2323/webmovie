using System.Text.Json.Serialization;

namespace WebMovie.Application.DTOs.MovieApi;

public class MovieListResponse
{
    [JsonPropertyName("status")]
    public bool Status { get; set; }

    [JsonPropertyName("items")]
    public IEnumerable<MovieItemDTO> Items { get; set; } = [];

    [JsonPropertyName("pagination")]
    public PaginationDTO? Pagination { get; set; }
}
