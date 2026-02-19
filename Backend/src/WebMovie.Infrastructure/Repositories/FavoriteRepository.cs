using Microsoft.EntityFrameworkCore;
using WebMovie.Application.Interfaces;
using WebMovie.Domain.Entities;
using WebMovie.Infrastructure.Data;

namespace WebMovie.Infrastructure.Repositories;

public class FavoriteRepository : IFavoriteRepository
{
    private readonly AppDbContext _context;

    public FavoriteRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Favorite?> GetAsync(Guid userId, string movieSlug)
    {
        return await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.MovieSlug == movieSlug);
    }

    public async Task<IEnumerable<Favorite>> ListAsync(Guid userId)
    {
        return await _context.Favorites
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(Favorite favorite)
    {
        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveAsync(Favorite favorite)
    {
        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(Guid userId, string movieSlug)
    {
        return await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.MovieSlug == movieSlug);
    }
}
