using System.Text.Json.Serialization;

namespace WebMovie.Application.DTOs.MovieApi;

public class CountryDataDTO
{
    [JsonPropertyName("items")]
    public IEnumerable<CountryDTO> Items { get; set; } = [];
}

public class CountryResponseDTO
{
    [JsonPropertyName("status")]
    public bool Status { get; set; }

    [JsonPropertyName("msg")]
    public string Msg { get; set; } = string.Empty;

    [JsonPropertyName("data")]
    public CountryDataDTO? Data { get; set; }
}
