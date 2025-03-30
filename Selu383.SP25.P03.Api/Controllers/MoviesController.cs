using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/movies")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;

        public MoviesController(DataContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Movies
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
                    TrailerId = m.TrailerId,
                })
                .ToListAsync();
        }

        // GET: api/Movies/id
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieDetailsDto>> GetMovie(int id)
        {
            var movie = await _context.Movies
                .Include(m => m.Showtimes)
                .ThenInclude(s => s.Hall)
                .ThenInclude(h => h.Theater)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (movie == null)
            {
                return NotFound();
            }

            return new MovieDetailsDto
            {
                Id = movie.Id,
                Title = movie.Title,
                Description = movie.Description,
                Director = movie.Director,
                Duration = movie.Duration,
                Rating = movie.Rating,
                PosterUrl = movie.PosterUrl,
                ReleaseDate = movie.ReleaseDate,
                Genre = movie.Genre,
                TrailerId = movie.TrailerId,
                Showtimes = movie.Showtimes
                    .Where(s => s.StartTime > DateTime.UtcNow) // Only include future showtimes
                    .Select(s => new ShowtimeDto
                    {
                        Id = s.Id,
                        MovieId = s.MovieId,
                        MovieTitle = movie.Title,
                        HallId = s.HallId,
                        HallNumber = s.Hall.HallNumber,
                        TheaterId = s.Hall.TheaterId,
                        TheaterName = s.Hall.Theater.Name, 
                        StartTime = s.StartTime,
                        EndTime = s.EndTime,
                        Price = s.TicketPrice,
                        Is3D = s.Is3D,
                        AvailableSeats = s.Hall.Capacity - _context.Tickets.Count(t => t.ShowtimeId == s.Id)
                    }).ToList()
            };
        }

        // POST: api/Movies
        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<MovieDto>> CreateMovie(CreateMovieDto dto)
        {
            // Validate required fields
            if (string.IsNullOrWhiteSpace(dto.Title) ||
                string.IsNullOrWhiteSpace(dto.Genre) ||
                string.IsNullOrWhiteSpace(dto.PosterUrl) ||
                dto.Duration <= 0)
            {
                return BadRequest("Missing required fields or invalid data");
            }

            var movie = new Movie
            {
                Title = dto.Title,
                Description = dto.Description ?? "",
                Director = dto.Director ?? "Unknown",
                Duration = dto.Duration,
                Rating = dto.Rating ?? "NR",
                PosterUrl = dto.PosterUrl,
                ReleaseDate = dto.ReleaseDate,
                TrailerId = dto.TrailerId,
                Genre = dto.Genre
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetMovie),
                new { id = movie.Id },
                new MovieDto
                {
                    Id = movie.Id,
                    Title = movie.Title,
                    Description = movie.Description,
                    Director = movie.Director,
                    Duration = movie.Duration,
                    Rating = movie.Rating,
                    PosterUrl = movie.PosterUrl,
                    ReleaseDate = movie.ReleaseDate,
                    Genre = movie.Genre,
                    TrailerId = movie.TrailerId,
                });
        }

        // PUT: api/Movies/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateMovie(int id, UpdateMovieDto dto)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            // Check if this movie has any showtimes
            bool hasShowtimes = await _context.Set<Showtime>()
                .AnyAsync(s => s.MovieId == id);

            // Validate required fields
            if (string.IsNullOrWhiteSpace(dto.Title) ||
                string.IsNullOrWhiteSpace(dto.Genre) ||
                string.IsNullOrWhiteSpace(dto.PosterUrl) ||
                dto.Duration <= 0)
            {
                return BadRequest("Missing required fields or invalid data");
            }

            // If the movie has showtimes, don't allow changing the duration
            if (hasShowtimes && dto.Duration != movie.Duration)
            {
                return BadRequest("Cannot change movie duration when showtimes exist");
            }

            movie.Title = dto.Title;
            movie.Description = dto.Description ?? "";
            movie.Director = dto.Director ?? "Unknown";
            movie.Duration = dto.Duration;
            movie.Rating = dto.Rating ?? "NR";
            movie.PosterUrl = dto.PosterUrl;
            movie.ReleaseDate = dto.ReleaseDate;
            movie.Genre = dto.Genre;
            movie.TrailerId = dto.TrailerId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Movies/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            // Check if movie has any showtimes
            bool hasShowtimes = await _context.Set<Showtime>()
                .AnyAsync(s => s.MovieId == id);

            if (hasShowtimes)
            {
                return BadRequest("Cannot delete a movie with scheduled showtimes");
            }

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MovieExists(int id)
        {
            return _context.Movies.Any(e => e.Id == id);
        }
    }
}