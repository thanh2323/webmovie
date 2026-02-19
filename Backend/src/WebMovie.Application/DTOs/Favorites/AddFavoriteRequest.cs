using System.ComponentModel.DataAnnotations;

namespace WebMovie.Application.DTOs.Favorites;

public class AddFavoriteRequest
{
    [Required]
    public string MovieSlug { get; set; } = string.Empty;

    [Required]
    public string MovieName { get; set; } = string.Empty;

    public string? MoviePosterUrl { get; set; }
    public string? MovieThumbUrl { get; set; }
    public int? MovieYear { get; set; }
}
