using System.Text.Json.Serialization;

namespace WebMovie.Application.DTOs.MovieApi;

public class CategoryDataDTO
{
    [JsonPropertyName("items")]
    public IEnumerable<CategoryDTO> Items { get; set; } = [];
}

public class CategoryResponseDTO
{
    [JsonPropertyName("status")]
    public bool Status { get; set; }

    [JsonPropertyName("msg")]
    public string Msg { get; set; } = string.Empty;

    [JsonPropertyName("data")]
    public CategoryDataDTO? Data { get; set; }
}
