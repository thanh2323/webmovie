using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using WebMovie.API.Controllers;
using WebMovie.Application.DTOs.MovieApi;
using WebMovie.Application.Interfaces;
using Xunit;

namespace WebMovie.Tests.API;

public class MoviesControllerTests
{
    private readonly Mock<IMovieService> _mockMovieService;
    private readonly MoviesController _controller;

    public MoviesControllerTests()
    {
        _mockMovieService = new Mock<IMovieService>();
        _controller = new MoviesController(_mockMovieService.Object);
    }

    [Fact]
    public async Task GetNewMovies_ReturnsOkResult()
    {
        // Arrange
        var expectedResponse = new MovieListResponse { Status = true };
        _mockMovieService.Setup(x => x.GetNewMoviesAsync(1))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.GetNewMovies(1);

        // Assert
        var actionResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        actionResult.Value.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task GetMovieDetail_ReturnsOk_WhenMovieFound()
    {
        // Arrange
        var slug = "test-movie";
        var expectedResponse = new MovieDetailResponse { Status = true, Msg = "Found" };
        _mockMovieService.Setup(x => x.GetMovieDetailAsync(slug))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.GetMovieDetail(slug);

        // Assert
        var actionResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        actionResult.Value.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task GetMovieDetail_ReturnsNotFound_WhenMovieNotFound()
    {
        // Arrange
        var slug = "not-found";
        var expectedResponse = new MovieDetailResponse { Status = false, Msg = "" };
        _mockMovieService.Setup(x => x.GetMovieDetailAsync(slug))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.GetMovieDetail(slug);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task GetMoviesByType_ReturnsOkResult()
    {
        // Arrange
        var type = "phim-le";
        var expectedResponse = new FilteredMovieListResponse { Status = true };
        _mockMovieService.Setup(x => x.GetMoviesByTypeAsync(type, 1, null, null, null))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.GetMoviesByType(type);

        // Assert
        var actionResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        actionResult.Value.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task SearchMovies_ReturnsOkResult()
    {
        // Arrange
        var keyword = "test";
        var expectedResponse = new FilteredMovieListResponse { Status = true };
        _mockMovieService.Setup(x => x.SearchMoviesAsync(keyword, 10))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.SearchMovies(keyword);

        // Assert
        var actionResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        actionResult.Value.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task GetCategories_ReturnsOkResult()
    {
        // Arrange
        var expectedResponse = new CategoryResponseDTO { Status = true };
        _mockMovieService.Setup(x => x.GetCategoriesAsync())
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.GetCategories();

        // Assert
        var actionResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        actionResult.Value.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task GetCountries_ReturnsOkResult()
    {
        // Arrange
        var expectedResponse = new CountryResponseDTO { Status = true };
        _mockMovieService.Setup(x => x.GetCountriesAsync())
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.GetCountries();

        // Assert
        var actionResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        actionResult.Value.Should().BeEquivalentTo(expectedResponse);
    }
}
