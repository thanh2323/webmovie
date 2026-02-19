    using Microsoft.AspNetCore.Mvc;
    using WebMovie.Application.DTOs.MovieApi;
    using WebMovie.Application.Interfaces;

    namespace WebMovie.API.Controllers;

    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public MoviesController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet("new")]
        public async Task<ActionResult<MovieListResponse>> GetNewMovies([FromQuery] int page = 1)
        {
            var result = await _movieService.GetNewMoviesAsync(page);
            return Ok(result);
        }

        [HttpGet("{slug}")]
        public async Task<ActionResult<MovieDetailResponse>> GetMovieDetail(string slug)
        {
            var result = await _movieService.GetMovieDetailAsync(slug);
            if (!result.Status && string.IsNullOrEmpty(result.Msg))
                return NotFound("Movie not found");

            return Ok(result);
        }

        [HttpGet("list/{type}")]
        public async Task<ActionResult<FilteredMovieListResponse>> GetMoviesByType(
            string type,
            [FromQuery] int page = 1,
            [FromQuery] string? category = null,
            [FromQuery] string? country = null,
            [FromQuery] int? year = null)
        {
            var result = await _movieService.GetMoviesByTypeAsync(type, page, category, country, year);
            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<ActionResult<FilteredMovieListResponse>> SearchMovies(
            [FromQuery] string keyword,
            [FromQuery] int limit = 10)
        {
            var result = await _movieService.SearchMoviesAsync(keyword, limit);
            return Ok(result);
        }

        [HttpGet("categories")]
        public async Task<ActionResult<CategoryResponseDTO>> GetCategories()
        {
            var result = await _movieService.GetCategoriesAsync();
            return Ok(result);
        }

        [HttpGet("countries")]
        public async Task<ActionResult<CountryResponseDTO>> GetCountries()
        {
            var result = await _movieService.GetCountriesAsync();
            return Ok(result);
        }

        [HttpGet("category/{slug}")]
        public async Task<ActionResult<FilteredMovieListResponse>> GetMoviesByCategory(
            string slug, 
            [FromQuery] int page = 1,
            [FromQuery] string? country = null,
            [FromQuery] int? year = null)
        {
            var result = await _movieService.GetMoviesByCategoryAsync(slug, page, country, year);
            return Ok(result);
        }
    }
