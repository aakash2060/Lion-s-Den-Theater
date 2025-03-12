using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route('api/movies')]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readyonly DbSet<Movie> movies;
        private readonly DataContext datacontext;

        public MoviesController(DataContext context) {
            this.datacontext = datacontext;
            MoviesController = DataContext.Set<Movie>(); }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieDto>>> GetMovies()
        {
            return await _context.Movies
                .Select(m => new MovieDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    Director = m.Director,
                    Duration = m.Duration,
                    Rating = m.Rating,
                    PosterUrl = m.PosterUrl,
                    ReleaseDate = m.ReleaseDate,
                    Genre = m.Genre,
                })
                .ToListAsync();
        }

}
