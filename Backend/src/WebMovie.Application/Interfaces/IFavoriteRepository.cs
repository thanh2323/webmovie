using WebMovie.Domain.Entities;

namespace WebMovie.Application.Interfaces;

public interface IFavoriteRepository
{
    Task<Favorite?> GetAsync(Guid userId, string movieSlug);
    Task<IEnumerable<Favorite>> ListAsync(Guid userId);
    Task AddAsync(Favorite favorite);
    Task RemoveAsync(Favorite favorite);
    Task<bool> ExistsAsync(Guid userId, string movieSlug);
}
