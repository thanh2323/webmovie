using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WebMovie.Application.Interfaces;
using WebMovie.Application.Services;
using WebMovie.Infrastructure.Data;
using WebMovie.Infrastructure.ExternalApis;

namespace WebMovie.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        // External API
        services.Configure<MovieApiSettings>(configuration.GetSection(MovieApiSettings.SectionName));
        services.AddHttpClient<IMovieApiService, MovieApiService>();

        // Authentication
        services.Configure<Authentication.JwtSettings>(configuration.GetSection(Authentication.JwtSettings.SectionName));
        services.AddSingleton<IJwtTokenGenerator, Authentication.JwtTokenGenerator>();
        services.AddSingleton<IPasswordHasher, Authentication.PasswordHasher>();
        services.AddScoped<IUserRepository, Persistence.UserRepository>();
        services.AddScoped<IAuthService, AuthService>();

        // Application Services
        services.AddScoped<IMovieService, MovieService>();

        return services;
    }
}
