using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebMovie.Application.DTOs.Favorites;
using WebMovie.Application.Interfaces;

namespace WebMovie.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;

    public FavoritesController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        return userId;
    }

    [HttpPost]
    public async Task<ActionResult<FavoriteResponse>> AddFavorite(AddFavoriteRequest request)
    {
        var userId = GetUserId();
        var result = await _favoriteService.AddFavoriteAsync(userId, request);
        return Ok(result);
    }

    [HttpDelete("{slug}")]
    public async Task<IActionResult> RemoveFavorite(string slug)
    {
        var userId = GetUserId();
        await _favoriteService.RemoveFavoriteAsync(userId, slug);
        return NoContent();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FavoriteResponse>>> GetFavorites()
    {
        var userId = GetUserId();
        var result = await _favoriteService.GetFavoritesAsync(userId);
        return Ok(result);
    }

    [HttpGet("check/{slug}")]
    public async Task<ActionResult<bool>> CheckFavoriteStatus(string slug)
    {
        var userId = GetUserId();
        var isFavorite = await _favoriteService.IsFavoriteAsync(userId, slug);
        return Ok(isFavorite);
    }
}
