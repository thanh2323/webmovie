using WebMovie.Application.DTOs.Favorites;

namespace WebMovie.Application.Interfaces;

public interface IFavoriteService
{
    Task<FavoriteResponse> AddFavoriteAsync(Guid userId, AddFavoriteRequest request);
    Task RemoveFavoriteAsync(Guid userId, string movieSlug);
    Task<IEnumerable<FavoriteResponse>> GetFavoritesAsync(Guid userId);
    Task<bool> IsFavoriteAsync(Guid userId, string movieSlug);
}
