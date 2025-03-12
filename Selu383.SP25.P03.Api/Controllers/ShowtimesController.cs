using System.Net.Sockets;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;

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

        public ShowtimesController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            showtimes = dataContext.Set<Showtime>();
            movies = dataContext.Set<Movie>();
            halls = dataContext.Set<Hall>();
            tickets = dataContext.Set<Ticket>();
        }

        [HttpGet]
        public IQueryable<ShowtimeDto> GetAllShowtimes()
        {
            return GetShowtimeDtos(showtimes);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<ShowtimeDetailDto> GetShowtimeById(int id)
        {
            var showtime = showtimes
                .Include(s => s.Movie)
                .Include(s => s.Hall)
                .ThenInclude(h => h.Theater)
                .Include(s => s.Tickets)
                .FirstOrDefault(x => x.Id == id);

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
                StartTime = showtime.StartTime,
                EndTime = showtime.EndTime,
                TicketPrice = showtime.TicketPrice,
                Is3D = showtime.Is3D,
                TotalSeats = showtime.Hall.Capacity,
                AvailableSeats = showtime.Hall.Capacity - showtime.Tickets.Count,
                IsSoldOut = showtime.IsSoldOut
            };

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<ShowtimeDto> CreateShowtime(CreateShowtimeDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var movie = movies.Find(dto.MovieId);
            if (movie == null)
            {
                return BadRequest("Movie not found");
            }

            var hall = halls.Find(dto.HallId);
            if (hall == null)
            {
                return BadRequest("Hall not found");
            }

            // Calculate end time based on movie duration
            var endTime = dto.StartTime.AddMinutes(movie.Duration);

            // Check if hall is already booked for this time
            var conflictingShowtime = showtimes
                .Where(s => s.HallId == dto.HallId)
                .Where(s => (dto.StartTime >= s.StartTime && dto.StartTime < s.EndTime) ||
                          (endTime > s.StartTime && endTime <= s.EndTime) ||
                          (dto.StartTime <= s.StartTime && endTime >= s.EndTime))
                .FirstOrDefault();

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
            dataContext.SaveChanges();

            // Load theater information for the response
            dataContext.Entry(hall)
                .Reference(h => h.Theater)
                .Load();

            var result = new ShowtimeDto
            {
                Id = showtime.Id,
                MovieId = showtime.MovieId,
                MovieTitle = movie.Title,
                HallId = showtime.HallId,
                HallNumber = hall.HallNumber,
                TheaterId = hall.TheaterId,
                TheaterName = hall.Theater?.Name,
                StartTime = showtime.StartTime,
                EndTime = showtime.EndTime,
                TicketPrice = showtime.TicketPrice,
                Is3D = showtime.Is3D,
                AvailableSeats = hall.Capacity
            };

            return CreatedAtAction(nameof(GetShowtimeById), new { id = result.Id }, result);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin + ",")]
        public ActionResult<ShowtimeDto> UpdateShowtime(int id, UpdateShowtimeDto dto)
        {
            var showtime = showtimes
                .Include(s => s.Movie)
                .Include(s => s.Hall)
                .ThenInclude(h => h.Theater)
                .FirstOrDefault(x => x.Id == id);

            if (showtime == null)
            {
                return NotFound();
            }

            // Calculate end time based on movie duration
            var endTime = dto.StartTime.AddMinutes(showtime.Movie.Duration);

            // Check if hall is already booked for this time (excluding current showtime)
            var conflictingShowtime = showtimes
                .Where(s => s.HallId == showtime.HallId && s.Id != id)
                .Where(s => (dto.StartTime >= s.StartTime && dto.StartTime < s.EndTime) ||
                          (endTime > s.StartTime && endTime <= s.EndTime) ||
                          (dto.StartTime <= s.StartTime && endTime >= s.EndTime))
                .FirstOrDefault();

            if (conflictingShowtime != null)
            {
                return BadRequest("The hall is already booked for this time");
            }

            showtime.StartTime = dto.StartTime;
            showtime.EndTime = endTime;
            showtime.TicketPrice = dto.TicketPrice;
            showtime.Is3D = dto.Is3D;

            dataContext.SaveChanges();

            var result = new ShowtimeDto
            {
                Id = showtime.Id,
                MovieId = showtime.MovieId,
                MovieTitle = showtime.Movie.Title,
                HallId = showtime.HallId,
                HallNumber = showtime.Hall.HallNumber,
                TheaterId = showtime.Hall.TheaterId,
                TheaterName = showtime.Hall.Theater.Name,
                StartTime = showtime.StartTime,
                EndTime = showtime.EndTime,
                TicketPrice = showtime.TicketPrice,
                Is3D = showtime.Is3D,
                AvailableSeats = showtime.Hall.Capacity - tickets.Count(t => t.ShowtimeId == showtime.Id)
            };

            return Ok(result);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin + "," )]
        public ActionResult DeleteShowtime(int id)
        {
            var showtime = showtimes.Find(id);
            if (showtime == null)
            {
                return NotFound();
            }

            // Check if tickets have been sold
            var ticketCount = tickets.Count(t => t.ShowtimeId == id);
            if (ticketCount > 0)
            {
                return BadRequest("Cannot delete a showtime with sold tickets");
            }

            showtimes.Remove(showtime);
            dataContext.SaveChanges();

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
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    TicketPrice = s.TicketPrice,
                    Is3D = s.Is3D,
                    AvailableSeats = s.Hall.Capacity - tickets.Count(t => t.ShowtimeId == s.Id)
                });
        }
    }
}