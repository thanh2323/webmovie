using WebMovie.Application.DTOs.Auth;

namespace WebMovie.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshAsync(string refreshToken);
    Task<object?> GetMeAsync(Guid userId);
}
