using WebMovie.Domain.Entities;

namespace WebMovie.Application.Interfaces;

public record TokenResult(string AccessToken, string RefreshToken, string RefreshTokenHash, DateTime RefreshTokenExpiry);

public interface IJwtTokenGenerator
{
    TokenResult GenerateTokens(User user);
    string HashToken(string token);
}
