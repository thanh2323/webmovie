using FluentAssertions;
using Moq;
using WebMovie.Application.DTOs.MovieApi;
using WebMovie.Application.Interfaces;
using WebMovie.Application.Services;
using Xunit;

namespace WebMovie.Tests.Application;

public class MovieServiceTests
{
    private readonly Mock<IMovieApiService> _mockMovieApiService;
    private readonly MovieService _movieService;

    public MovieServiceTests()
    {
        _mockMovieApiService = new Mock<IMovieApiService>();
        _movieService = new MovieService(_mockMovieApiService.Object);
    }

    [Fact]
    public async Task GetNewMoviesAsync_DelegatesToApiService()
    {
        // Arrange
        var expectedResponse = new MovieListResponse { Status = true };
        _mockMovieApiService.Setup(x => x.GetNewMoviesAsync(1))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _movieService.GetNewMoviesAsync(1);

        // Assert
        result.Should().BeEquivalentTo(expectedResponse);
        _mockMovieApiService.Verify(x => x.GetNewMoviesAsync(1), Times.Once);
    }

    [Fact]
    public async Task GetMovieDetailAsync_DelegatesToApiService()
    {
        // Arrange
        var slug = "test-movie";
        var expectedResponse = new MovieDetailResponse { Status = true };
        _mockMovieApiService.Setup(x => x.GetMovieDetailAsync(slug))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _movieService.GetMovieDetailAsync(slug);

        // Assert
        result.Should().BeEquivalentTo(expectedResponse);
        _mockMovieApiService.Verify(x => x.GetMovieDetailAsync(slug), Times.Once);
    }

    [Fact]
    public async Task GetMoviesByTypeAsync_DelegatesToApiService()
    {
        // Arrange
        var type = "phim-le";
        var page = 1;
        var category = "action";
        var country = "us";
        var year = 2023;
        var expectedResponse = new FilteredMovieListResponse { Status = true };

        _mockMovieApiService.Setup(x => x.GetMoviesByTypeAsync(type, page, category, country, year))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _movieService.GetMoviesByTypeAsync(type, page, category, country, year);

        // Assert
        result.Should().BeEquivalentTo(expectedResponse);
        _mockMovieApiService.Verify(x => x.GetMoviesByTypeAsync(type, page, category, country, year), Times.Once);
    }

    [Fact]
    public async Task SearchMoviesAsync_DelegatesToApiService()
    {
        // Arrange
        var keyword = "test";
        var limit = 10;
        var expectedResponse = new FilteredMovieListResponse { Status = true };

        _mockMovieApiService.Setup(x => x.SearchMoviesAsync(keyword, limit))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _movieService.SearchMoviesAsync(keyword, limit);

        // Assert
        result.Should().BeEquivalentTo(expectedResponse);
        _mockMovieApiService.Verify(x => x.SearchMoviesAsync(keyword, limit), Times.Once);
    }

    [Fact]
    public async Task GetCategoriesAsync_DelegatesToApiService()
    {
        // Arrange
        var expectedResponse = new CategoryResponseDTO { Status = true };
        _mockMovieApiService.Setup(x => x.GetCategoriesAsync())
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _movieService.GetCategoriesAsync();

        // Assert
        result.Should().BeEquivalentTo(expectedResponse);
        _mockMovieApiService.Verify(x => x.GetCategoriesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetCountriesAsync_DelegatesToApiService()
    {
        // Arrange
        var expectedResponse = new CountryResponseDTO { Status = true };
        _mockMovieApiService.Setup(x => x.GetCountriesAsync())
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _movieService.GetCountriesAsync();

        // Assert
        result.Should().BeEquivalentTo(expectedResponse);
        _mockMovieApiService.Verify(x => x.GetCountriesAsync(), Times.Once);
    }
}
