namespace WebMovie.Application.DTOs.Favorites;

public class FavoriteResponse
{
    public Guid Id { get; set; }
    public string MovieSlug { get; set; } = string.Empty;
    public string MovieName { get; set; } = string.Empty;
    public string? MoviePosterUrl { get; set; }
    public string? MovieThumbUrl { get; set; }
    public int? MovieYear { get; set; }
    public DateTime CreatedAt { get; set; }
}
