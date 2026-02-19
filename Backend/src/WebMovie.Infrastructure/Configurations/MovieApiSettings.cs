namespace WebMovie.Infrastructure.ExternalApis;

public class MovieApiSettings
{
    public const string SectionName = "MovieApi";
    public string BaseUrl { get; set; } = "https://phimapi.com";
    public string ImageBaseUrl { get; set; } = "https://phimimg.com";
}
