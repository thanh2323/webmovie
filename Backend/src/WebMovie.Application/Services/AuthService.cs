using Microsoft.Extensions.Logging;
using WebMovie.Application.DTOs.Auth;
using WebMovie.Application.Interfaces;
using WebMovie.Domain.Entities;

namespace WebMovie.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _logger = logger;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        _logger.LogInformation("Attempting login for {Email}", request.Email);

        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null)
        {
            throw new Exception("Invalid credentials");
        }

        if (!_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new Exception("Invalid credentials");
        }

        var tokens = _jwtTokenGenerator.GenerateTokens(user);

        // Store refresh token hash + expiry in DB
        user.RefreshTokenHash = tokens.RefreshTokenHash;
        user.RefreshTokenExpiry = tokens.RefreshTokenExpiry;
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return new AuthResponse
        {
            Success = true,
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshToken,
            Message = "Login success"
        };
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        _logger.LogInformation("Attempting register for {Email}", request.Email);

        if (await _userRepository.ExistsByEmailAsync(request.Email))
        {
            throw new Exception("Email already exists");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            DisplayName = request.DisplayName,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        var tokens = _jwtTokenGenerator.GenerateTokens(user);

        // Store refresh token hash + expiry in DB
        user.RefreshTokenHash = tokens.RefreshTokenHash;
        user.RefreshTokenExpiry = tokens.RefreshTokenExpiry;
        await _userRepository.UpdateAsync(user);

        return new AuthResponse
        {
            Success = true,
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshToken,
            Message = "Register success"
        };
    }

    public async Task<AuthResponse> RefreshAsync(string refreshToken)
    {
        _logger.LogInformation("Attempting token refresh");

        // Hash the incoming token to compare with DB
        var incomingHash = _jwtTokenGenerator.HashToken(refreshToken);

        // Find user by refresh token hash
        var user = await _userRepository.GetByRefreshTokenHashAsync(incomingHash);
        if (user == null)
        {
            throw new Exception("Invalid refresh token");
        }

        // Check expiry
        if (user.RefreshTokenExpiry == null || user.RefreshTokenExpiry < DateTime.UtcNow)
        {
            // Revoke expired token
            user.RefreshTokenHash = null;
            user.RefreshTokenExpiry = null;
            await _userRepository.UpdateAsync(user);
            throw new Exception("Refresh token expired");
        }

        // Rotate: generate new tokens
        var tokens = _jwtTokenGenerator.GenerateTokens(user);
        user.RefreshTokenHash = tokens.RefreshTokenHash;
        user.RefreshTokenExpiry = tokens.RefreshTokenExpiry;
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return new AuthResponse
        {
            Success = true,
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshToken,
            Message = "Token refreshed"
        };
    }

    public async Task<object?> GetMeAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return null;

        return new
        {
            id = user.Id,
            email = user.Email,
            displayName = user.DisplayName,
            avatarUrl = user.AvatarUrl
        };
    }
}
