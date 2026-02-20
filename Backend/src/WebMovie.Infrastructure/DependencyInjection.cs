using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WebMovie.Application.Interfaces;
using WebMovie.Application.Services;
using WebMovie.Infrastructure.Data;
using WebMovie.Infrastructure.ExternalApis;
using WebMovie.Infrastructure.Services;
using WebMovie.Infrastructure.Repositories;

namespace WebMovie.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        // Redis Cache
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration["Redis:ConnectionString"] ?? "localhost:6379";
            options.InstanceName = "WebMovie:";
        });
        services.AddSingleton<ICacheService, RedisCacheService>();

        // External API
        services.Configure<MovieApiSettings>(configuration.GetSection(MovieApiSettings.SectionName));
        services.AddHttpClient<MovieApiService>();
        services.AddSingleton<IMovieApiService>(sp =>
        {
            var inner = sp.GetRequiredService<MovieApiService>();
            var cache = sp.GetRequiredService<ICacheService>();
            var logger = sp.GetRequiredService<Microsoft.Extensions.Logging.ILogger<CachedMovieApiService>>();
            return new CachedMovieApiService(inner, cache, logger);
        });

        // Authentication
        services.Configure<Authentication.JwtSettings>(configuration.GetSection(Authentication.JwtSettings.SectionName));
        services.AddSingleton<IJwtTokenGenerator, Authentication.JwtTokenGenerator>();
        services.AddSingleton<IPasswordHasher, Authentication.PasswordHasher>();
        services.AddScoped<IUserRepository, Persistence.UserRepository>();
        services.AddScoped<IFavoriteRepository, FavoriteRepository>();
        services.AddScoped<IAuthService, AuthService>();

        // Application Services
        services.AddScoped<IMovieService, MovieService>();
        services.AddScoped<IFavoriteService, FavoriteService>();

        return services;
    }
}
