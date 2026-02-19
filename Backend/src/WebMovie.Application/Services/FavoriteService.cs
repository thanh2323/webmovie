using WebMovie.Application.DTOs.Favorites;
using WebMovie.Application.Interfaces;
using WebMovie.Domain.Entities;

namespace WebMovie.Application.Services;

public class FavoriteService : IFavoriteService
{
    private readonly IFavoriteRepository _favoriteRepository;

    public FavoriteService(IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task<FavoriteResponse> AddFavoriteAsync(Guid userId, AddFavoriteRequest request)
    {
        var existingFavorite = await _favoriteRepository.GetAsync(userId, request.MovieSlug);

        if (existingFavorite != null)
        {
            return MapToResponse(existingFavorite);
        }

        var favorite = new Favorite
        {
            UserId = userId,
            MovieSlug = request.MovieSlug,
            MovieName = request.MovieName,
            MoviePosterUrl = request.MoviePosterUrl,
            MovieThumbUrl = request.MovieThumbUrl,
            MovieYear = request.MovieYear,
            CreatedAt = DateTime.UtcNow
        };

        await _favoriteRepository.AddAsync(favorite);

        return MapToResponse(favorite);
    }

    public async Task RemoveFavoriteAsync(Guid userId, string movieSlug)
    {
        var favorite = await _favoriteRepository.GetAsync(userId, movieSlug);

        if (favorite != null)
        {
            await _favoriteRepository.RemoveAsync(favorite);
        }
    }

    public async Task<IEnumerable<FavoriteResponse>> GetFavoritesAsync(Guid userId)
    {
        var favorites = await _favoriteRepository.ListAsync(userId);
        return favorites.Select(MapToResponse);
    }

    public async Task<bool> IsFavoriteAsync(Guid userId, string movieSlug)
    {
        return await _favoriteRepository.ExistsAsync(userId, movieSlug);
    }

    private static FavoriteResponse MapToResponse(Favorite favorite)
    {
        return new FavoriteResponse
        {
            Id = favorite.Id,
            MovieSlug = favorite.MovieSlug,
            MovieName = favorite.MovieName,
            MoviePosterUrl = favorite.MoviePosterUrl,
            MovieThumbUrl = favorite.MovieThumbUrl,
            MovieYear = favorite.MovieYear,
            CreatedAt = favorite.CreatedAt
        };
    }
}
