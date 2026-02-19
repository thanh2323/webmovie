namespace WebMovie.Domain.Entities;

public class WatchHistory
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    // Thông tin phim (cache từ API bên ngoài)
    public string MovieSlug { get; set; } = string.Empty;
    public string MovieName { get; set; } = string.Empty;
    public string? MoviePosterUrl { get; set; }
    public string? MovieThumbUrl { get; set; }

    // Thông tin tập phim
    public string EpisodeSlug { get; set; } = string.Empty;
    public string EpisodeName { get; set; } = string.Empty;

    // Tiến độ xem (hỗ trợ tiếp tục xem)
    public int WatchedSeconds { get; set; }
    public int TotalSeconds { get; set; }

    public DateTime WatchedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

}
