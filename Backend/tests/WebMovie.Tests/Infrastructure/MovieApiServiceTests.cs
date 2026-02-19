using System.Net;
using System.Text.Json;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Moq.Protected;
using WebMovie.Application.DTOs.MovieApi;
using WebMovie.Infrastructure.ExternalApis;
using Xunit;

namespace WebMovie.Tests.Infrastructure;

public class MovieApiServiceTests
{
    private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler;
    private readonly Mock<IOptions<MovieApiSettings>> _mockSettings;
    private readonly Mock<ILogger<MovieApiService>> _mockLogger;
    private readonly MovieApiService _service;

    public MovieApiServiceTests()
    {
        _mockHttpMessageHandler = new Mock<HttpMessageHandler>();
        _mockSettings = new Mock<IOptions<MovieApiSettings>>();
        _mockLogger = new Mock<ILogger<MovieApiService>>();

        _mockSettings.Setup(s => s.Value).Returns(new MovieApiSettings 
        { 
            BaseUrl = "https://phimapi.com",
            ImageBaseUrl = "https://phimimg.com"
        });

        var httpClient = new HttpClient(_mockHttpMessageHandler.Object)
        {
            BaseAddress = new Uri("https://phimapi.com")
        };

        _service = new MovieApiService(httpClient, _mockSettings.Object, _mockLogger.Object);
    }

    private void SetupMockResponse(string content)
    {
        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(content)
            });
    }

    [Fact]
    public async Task GetNewMoviesAsync_ReturnsDeserializedResponse()
    {
        // Arrange
        var expectedResponse = new MovieListResponse { Status = true };
        var jsonResponse = JsonSerializer.Serialize(expectedResponse);
        SetupMockResponse(jsonResponse);

        // Act
        var result = await _service.GetNewMoviesAsync(1);

        // Assert
        result.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task GetMovieDetailAsync_ReturnsDeserializedResponse()
    {
        // Arrange
        var expectedResponse = new MovieDetailResponse { Status = true, Msg = "Found" };
        var jsonResponse = JsonSerializer.Serialize(expectedResponse);
        SetupMockResponse(jsonResponse);

        // Act
        var result = await _service.GetMovieDetailAsync("test-slug");

        // Assert
        result.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task GetMoviesByTypeAsync_ReturnsDeserializedResponse()
    {
        // Arrange
        var expectedResponse = new FilteredMovieListResponse { Status = true };
        var jsonResponse = JsonSerializer.Serialize(expectedResponse);
        SetupMockResponse(jsonResponse);

        // Act
        var result = await _service.GetMoviesByTypeAsync("phim-le");

        // Assert
        result.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task SearchMoviesAsync_ReturnsDeserializedResponse()
    {
        // Arrange
        var expectedResponse = new FilteredMovieListResponse { Status = true };
        var jsonResponse = JsonSerializer.Serialize(expectedResponse);
        SetupMockResponse(jsonResponse);

        // Act
        var result = await _service.SearchMoviesAsync("test");

        // Assert
        result.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task GetCategoriesAsync_ReturnsDeserializedResponse()
    {
        // Arrange
        var categories = new List<CategoryDTO>();
        var jsonResponse = JsonSerializer.Serialize(categories);
        SetupMockResponse(jsonResponse);

        var expectedResponse = new CategoryResponseDTO
        {
            Status = true,
            Msg = "Success",
            Data = new CategoryDataDTO { Items = categories }
        };

        // Act
        var result = await _service.GetCategoriesAsync();

        // Assert
        result.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task GetCountriesAsync_ReturnsDeserializedResponse()
    {
        // Arrange
        var countries = new List<CountryDTO>();
        var jsonResponse = JsonSerializer.Serialize(countries);
        SetupMockResponse(jsonResponse);

        var expectedResponse = new CountryResponseDTO
        {
            Status = true,
            Msg = "Success",
            Data = new CountryDataDTO { Items = countries }
        };

        // Act
        var result = await _service.GetCountriesAsync();

        // Assert
        result.Should().BeEquivalentTo(expectedResponse);
    }
}
