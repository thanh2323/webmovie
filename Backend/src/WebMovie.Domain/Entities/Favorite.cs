namespace WebMovie.Domain.Entities;

public class Favorite
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public string MovieSlug { get; set; } = string.Empty;
    public string MovieName { get; set; } = string.Empty;
    public string? MoviePosterUrl { get; set; }
    public string? MovieThumbUrl { get; set; }
    public int? MovieYear { get; set; }

    public DateTime CreatedAt { get; set; }

 
}
