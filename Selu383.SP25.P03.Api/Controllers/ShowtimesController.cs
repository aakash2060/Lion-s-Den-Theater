using System;
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
    [Route("api/showtimes")]
    [ApiController]
    public class ShowtimesController : ControllerBase
    {
        private readonly DbSet<Showtime> showtimes;
        private readonly DbSet<Movie> movies;
        private readonly DbSet<Hall> halls;
        private readonly DbSet<Ticket> tickets;
        private readonly DataContext dataContext;
        private readonly UserManager<User> userManager;

        public ShowtimesController(DataContext dataContext, UserManager<User> userManager)
        {
            this.dataContext = dataContext;
            this.userManager = userManager;
            showtimes = dataContext.Set<Showtime>();
            movies = dataContext.Set<Movie>();
            halls = dataContext.Set<Hall>();
            tickets = dataContext.Set<Ticket>();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShowtimeDto>>> GetAllShowtimes()
        {
            var result = await GetShowtimeDtos(showtimes).ToListAsync();
            return Ok(result);
        }

        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<ShowtimeDto>>> GetUpcomingShowtimes()
        {
            var result = await GetShowtimeDtos(showtimes.Where(s => s.StartTime > DateTime.UtcNow))
                .ToListAsync();
            return Ok(result);
        }

        [HttpGet("theater/{theaterId}")]
        public async Task<ActionResult<IEnumerable<ShowtimeDto>>> GetShowtimesByTheater(int theaterId)
        {
            // Check if theater exists
            var theaterExists = await dataContext.Set<Theater>().AnyAsync(t => t.Id == theaterId);
            if (!theaterExists)
            {
                return NotFound("Theater not found");
            }

            var result = await GetShowtimeDtos(showtimes
                .Where(s => s.Hall.TheaterId == theaterId))
                .ToListAsync();
            return Ok(result);
        }

        [HttpGet("movie/{movieId}")]
        public async Task<ActionResult<IEnumerable<ShowtimeDto>>> GetShowtimesByMovie(int movieId)
        {
            // Check if movie exists
            var movieExists = await movies.AnyAsync(m => m.Id == movieId);
            if (!movieExists)
            {
                return NotFound("Movie not found");
            }

            var result = await GetShowtimeDtos(showtimes
                .Where(s => s.MovieId == movieId))
                .ToListAsync();
            return Ok(result);
        }
        private static DateTime ConvertToLocalTime(DateTime utcTime)
        {
            var centralTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time");

            return TimeZoneInfo.ConvertTimeFromUtc(utcTime, centralTimeZone);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ShowtimeDetailDto>> GetShowtimeById(int id)
        {
            var showtime = await showtimes
                .Include(s => s.Movie)
                .Include(s => s.Hall)
                .ThenInclude(h => h.Theater)
                .Include(s => s.Tickets)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (showtime == null)
            {
                return NotFound();
            }

            var result = new ShowtimeDetailDto
            {
                Id = showtime.Id,
                MovieId = showtime.MovieId,
                MovieTitle = showtime.Movie.Title,
                MoviePoster = showtime.Movie.PosterUrl,
                MovieDuration = showtime.Movie.Duration,
                HallId = showtime.HallId,
                HallNumber = showtime.Hall.HallNumber,
                TheaterId = showtime.Hall.TheaterId,
                TheaterName = showtime.Hall.Theater.Name,
                StartTime = ConvertToLocalTime(showtime.StartTime),
                EndTime = ConvertToLocalTime(showtime.EndTime),
                Price = showtime.TicketPrice,
                Is3D = showtime.Is3D,
                TotalSeats = showtime.Hall.Capacity,
                AvailableSeats = showtime.Hall.Capacity - showtime.Tickets.Count,
                IsSoldOut = showtime.Tickets.Count >= showtime.Hall.Capacity
            };

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<ShowtimeDto>> CreateShowtime(CreateShowtimeDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest("Invalid showtime data");
            }

            var movie = await movies.FindAsync(dto.MovieId);
            if (movie == null)
            {
                return BadRequest("Movie not found");
            }

            var hall = await halls
                .Include(h => h.Theater)
                .FirstOrDefaultAsync(h => h.Id == dto.HallId);

            if (hall == null)
            {
                return BadRequest("Hall not found");
            }

            // Check if the current user is a manager and manages this theater
            if (User.IsInRole(UserRoleNames.Manager) && !User.IsInRole(UserRoleNames.Admin))
            {
                var currentUser = await userManager.GetUserAsync(User);
                if (currentUser == null || hall.Theater.ManagerId != currentUser.Id)
                {
                    return Forbid();
                }
            }

            // Calculate end time based on movie duration
            var endTime = dto.StartTime.AddMinutes(movie.Duration);

            // Check if hall is already booked for this time
            var conflictingShowtime = await showtimes
                .Where(s => s.HallId == dto.HallId)
                .Where(s => (dto.StartTime >= s.StartTime && dto.StartTime < s.EndTime) ||
                          (endTime > s.StartTime && endTime <= s.EndTime) ||
                          (dto.StartTime <= s.StartTime && endTime >= s.EndTime))
                .FirstOrDefaultAsync();

            if (conflictingShowtime != null)
            {
                return BadRequest("The hall is already booked for this time");
            }

            var showtime = new Showtime
            {
                MovieId = dto.MovieId,
                HallId = dto.HallId,
                StartTime = dto.StartTime,
                EndTime = endTime,
                TicketPrice = dto.TicketPrice,
                Is3D = dto.Is3D,
            };

            showtimes.Add(showtime);
            await dataContext.SaveChangesAsync();

            var result = new ShowtimeDto
            {
                Id = showtime.Id,
                MovieId = showtime.MovieId,
                MovieTitle = movie.Title,
                HallId = showtime.HallId,
                HallNumber = hall.HallNumber,
                TheaterId = hall.TheaterId,
                TheaterName = hall.Theater.Name,
                StartTime = ConvertToLocalTime(showtime.StartTime),
                EndTime = ConvertToLocalTime(showtime.EndTime),
                Price = showtime.TicketPrice,
                Is3D = showtime.Is3D,
                AvailableSeats = hall.Capacity
            };

            return CreatedAtAction(nameof(GetShowtimeById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<ShowtimeDto>> UpdateShowtime(int id, UpdateShowtimeDto dto)
        {
            var showtime = await showtimes
                .Include(s => s.Movie)
                .Include(s => s.Hall)
                .ThenInclude(h => h.Theater)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (showtime == null)
            {
                return NotFound();
            }

            // Check if the current user is a manager and manages this theater
            if (User.IsInRole(UserRoleNames.Manager) && !User.IsInRole(UserRoleNames.Admin))
            {
                var currentUser = await userManager.GetUserAsync(User);
                if (currentUser == null || showtime.Hall.Theater.ManagerId != currentUser.Id)
                {
                    return Forbid();
                }
            }

            // Check if tickets have been sold
            var ticketCount = await tickets.CountAsync(t => t.ShowtimeId == id);
            if (ticketCount > 0)
            {
                return BadRequest("Cannot update a showtime with sold tickets");
            }

            // Calculate end time based on movie duration
            var endTime = dto.StartTime.AddMinutes(showtime.Movie.Duration);

            // Check if hall is already booked for this time (excluding current showtime)
            var conflictingShowtime = await showtimes
                .Where(s => s.HallId == showtime.HallId && s.Id != id)
                .Where(s => (dto.StartTime >= s.StartTime && dto.StartTime < s.EndTime) ||
                          (endTime > s.StartTime && endTime <= s.EndTime) ||
                          (dto.StartTime <= s.StartTime && endTime >= s.EndTime))
                .FirstOrDefaultAsync();

            if (conflictingShowtime != null)
            {
                return BadRequest("The hall is already booked for this time");
            }

            showtime.StartTime = dto.StartTime;
            showtime.EndTime = endTime;
            showtime.TicketPrice = dto.TicketPrice;
            showtime.Is3D = dto.Is3D;

            await dataContext.SaveChangesAsync();

            var result = new ShowtimeDto
            {
                Id = showtime.Id,
                MovieId = showtime.MovieId,
                MovieTitle = showtime.Movie.Title,
                HallId = showtime.HallId,
                HallNumber = showtime.Hall.HallNumber,
                TheaterId = showtime.Hall.TheaterId,
                TheaterName = showtime.Hall.Theater.Name,
                StartTime = ConvertToLocalTime(showtime.StartTime),
                EndTime = ConvertToLocalTime(showtime.EndTime),
                Price = showtime.TicketPrice,
                Is3D = showtime.Is3D,
                AvailableSeats = showtime.Hall.Capacity - await tickets.CountAsync(t => t.ShowtimeId == showtime.Id)
            };

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> DeleteShowtime(int id)
        {
            var showtime = await showtimes
                .Include(s => s.Hall)
                .ThenInclude(h => h.Theater)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (showtime == null)
            {
                return NotFound();
            }

            // Check if the current user is a manager and manages this theater
            if (User.IsInRole(UserRoleNames.Manager) && !User.IsInRole(UserRoleNames.Admin))
            {
                var currentUser = await userManager.GetUserAsync(User);
                if (currentUser == null || showtime.Hall.Theater.ManagerId != currentUser.Id)
                {
                    return Forbid();
                }
            }

            // Check if tickets have been sold
            var ticketCount = await tickets.CountAsync(t => t.ShowtimeId == id);
            if (ticketCount > 0)
            {
                return BadRequest("Cannot delete a showtime with sold tickets");
            }

            showtimes.Remove(showtime);
            await dataContext.SaveChangesAsync();

            return Ok();
        }


        private bool IsInvalid(CreateShowtimeDto dto)
        {
            return dto.MovieId <= 0 ||
                   dto.HallId <= 0 ||
                   dto.StartTime < DateTime.UtcNow ||
                   dto.TicketPrice <= 0;
        }

        private IQueryable<ShowtimeDto> GetShowtimeDtos(IQueryable<Showtime> showtimes)
        {
            return showtimes
                .Include(s => s.Movie)
                .Include(s => s.Hall)
                .ThenInclude(h => h.Theater)
                .Select(s => new ShowtimeDto
                {
                    Id = s.Id,
                    MovieId = s.MovieId,
                    MovieTitle = s.Movie.Title,
                    HallId = s.HallId,
                    HallNumber = s.Hall.HallNumber,
                    TheaterId = s.Hall.TheaterId,
                    TheaterName = s.Hall.Theater.Name,
                    StartTime = ConvertToLocalTime(s.StartTime),
                    EndTime = ConvertToLocalTime(s.EndTime),
                    Price = s.TicketPrice,
                    Is3D = s.Is3D,
                    AvailableSeats = s.Hall.Capacity - tickets.Count(t => t.ShowtimeId == s.Id)
                });
        }
    }
}