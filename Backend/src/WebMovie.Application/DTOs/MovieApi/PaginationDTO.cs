using System.Text.Json.Serialization;

namespace WebMovie.Application.DTOs.MovieApi;

public class PaginationDTO
{
    [JsonPropertyName("totalItems")]
    public int TotalItems { get; set; }

    [JsonPropertyName("totalItemsPerPage")]
    public int TotalItemsPerPage { get; set; }

    [JsonPropertyName("currentPage")]
    public int CurrentPage { get; set; }

    [JsonPropertyName("totalPages")]
    public int TotalPages { get; set; }
}
