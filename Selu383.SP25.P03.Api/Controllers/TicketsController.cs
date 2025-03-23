using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;
using System.Security.Claims;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/tickets")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly DbSet<Ticket> tickets;
        private readonly DbSet<Showtime> showtimes;
        private readonly DataContext dataContext;
        //private readonly UserManager<User> userManager;

        public TicketsController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            tickets = dataContext.Set<Ticket>();
            showtimes = dataContext.Set<Showtime>();
            //this.userManager = userManager;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetTickets()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole(UserRoleNames.Admin);

            var query = tickets
                .Include(t => t.Showtime)
                .ThenInclude(s => s.Movie)
                .Include(t => t.Showtime)
                .ThenInclude(s => s.Hall)
                .ThenInclude(h => h.Theater)
                .AsQueryable();

            // If not admin, only show user's tickets
            if (!isAdmin)
            {
                //query = query.Where(t => t.UserId == userId);
            }

            var result = await query
                .Select(t => new TicketDto
                {
                    Id = t.Id,
                    ShowtimeId = t.ShowtimeId,
                    //UserId = t.UserId,
                    PurchaseDate = t.PurchaseDate,
                    SeatNumber = t.SeatNumber,
                    Price = t.Price,
                    IsCheckedIn = t.IsCheckedIn,
                    TicketType = t.TicketType,
                    ConfirmationNumber = t.ConfirmationNumber,
                    MovieTitle = t.Showtime.Movie.Title,
                    TheaterName = t.Showtime.Hall.Theater.Name,
                    HallNumber = t.Showtime.Hall.HallNumber,
                    ShowtimeStart = t.Showtime.StartTime
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet]
        [Route("{id}")]
        [Authorize]
        public async Task<ActionResult<TicketDetailDto>> GetTicket(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole(UserRoleNames.Admin) || User.IsInRole(UserRoleNames.Manager);

            var ticket = await tickets
                .Include(t => t.Showtime)
                .ThenInclude(s => s.Movie)
                .Include(t => t.Showtime)
                .ThenInclude(s => s.Hall)
                .ThenInclude(h => h.Theater)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
            {
                return NotFound();
            }

            // If not admin and not owner, forbid access
            //if (!isAdmin && ticket.UserId != userId)
            //{
            //    return Forbid();
            //}

            var result = new TicketDetailDto
            {
                Id = ticket.Id,
                ShowtimeId = ticket.ShowtimeId,
                //UserId = ticket.UserId,
                PurchaseDate = ticket.PurchaseDate,
                SeatNumber = ticket.SeatNumber,
                Price = ticket.Price,
                IsCheckedIn = ticket.IsCheckedIn,
                TicketType = ticket.TicketType,
                ConfirmationNumber = ticket.ConfirmationNumber,
                MovieTitle = ticket.Showtime.Movie.Title,
                MoviePoster = ticket.Showtime.Movie.PosterUrl,
                TheaterName = ticket.Showtime.Hall.Theater.Name,
                HallNumber = ticket.Showtime.Hall.HallNumber,
                ShowtimeStart = ticket.Showtime.StartTime,
                ShowtimeEnd = ticket.Showtime.EndTime,
                Is3D = ticket.Showtime.Is3D,
            };

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<TicketDto>> PurchaseTicket(PurchaseTicketDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if showtime exists
            var showtime = await showtimes
                .Include(s => s.Movie)
                .Include(s => s.Hall)
                .ThenInclude(h => h.Theater)
                .FirstOrDefaultAsync(s => s.Id == dto.ShowtimeId);

            if (showtime == null)
            {
                return BadRequest("Showtime not found");
            }

            // Check if showtime is in the past
            if (showtime.StartTime < DateTime.UtcNow)
            {
                return BadRequest("Cannot purchase tickets for past showtimes");
            }

            // Check if sold out
            if (showtime.IsSoldOut)
            {
                return BadRequest("This showtime is sold out");
            }

            // Check for available seats
            var ticketCount = await tickets.CountAsync(t => t.ShowtimeId == dto.ShowtimeId);
            if (ticketCount >= showtime.Hall.Capacity)
            {
                showtime.IsSoldOut = true;
                await dataContext.SaveChangesAsync();
                return BadRequest("This showtime is sold out");
            }

            // Check if seat is already taken
            if (!string.IsNullOrEmpty(dto.SeatNumber))
            {
                var seatTaken = await tickets
                    .AnyAsync(t => t.ShowtimeId == dto.ShowtimeId && t.SeatNumber == dto.SeatNumber);

                if (seatTaken)
                {
                    return BadRequest("This seat is already taken");
                }
            }

            // Generate confirmation code
            var confirmationNumber = GenerateConfirmationCode();

            var ticket = new Ticket
            {
                ShowtimeId = dto.ShowtimeId,
                //UserId = userId,
                PurchaseDate = DateTime.UtcNow,
                SeatNumber = dto.SeatNumber,
                Price = showtime.TicketPrice,
                TicketType = dto.TicketType,
                ConfirmationNumber = confirmationNumber
            };

            tickets.Add(ticket);
            await dataContext.SaveChangesAsync();

            var result = new TicketDto
            {
                Id = ticket.Id,
                ShowtimeId = ticket.ShowtimeId,
                //UserId = ticket.UserId,
                PurchaseDate = ticket.PurchaseDate,
                SeatNumber = ticket.SeatNumber,
                Price = ticket.Price,
                IsCheckedIn = ticket.IsCheckedIn,
                TicketType = ticket.TicketType,
                ConfirmationNumber = ticket.ConfirmationNumber,
                MovieTitle = showtime.Movie.Title,
                TheaterName = showtime.Hall.Theater.Name,
                HallNumber = showtime.Hall.HallNumber,
                ShowtimeStart = showtime.StartTime
            };

            return CreatedAtAction(nameof(GetTicket), new { id = result.Id }, result);
        }

        [HttpPut]
        [Route("{id}/checkin")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<IActionResult> CheckInTicket(int id)
        {
            var ticket = await tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            // Only check in if not already checked in
            if (!ticket.IsCheckedIn)
            {
                ticket.IsCheckedIn = true;
                await dataContext.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize]
        public async Task<IActionResult> CancelTicket(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole(UserRoleNames.Admin) ;

            var ticket = await tickets
                .Include(t => t.Showtime)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
            {
                return NotFound();
            }

            // If not admin and not owner, forbid access
            //if (!isAdmin && ticket.UserId != userId)
            //{
            //    return Forbid();
            //}

            // Check if showtime is in the past or within 1 hour
            if (ticket.Showtime.StartTime <= DateTime.UtcNow.AddHours(1))
            {
                return BadRequest("Cannot cancel tickets within 1 hour of showtime");
            }

            // Check if already checked in
            if (ticket.IsCheckedIn)
            {
                return BadRequest("Cannot cancel tickets that have been checked in");
            }

            tickets.Remove(ticket);
            await dataContext.SaveChangesAsync();

            return Ok();
        }

        private bool IsInvalid(PurchaseTicketDto dto)
        {
            return dto.ShowtimeId <= 0 ||
                   string.IsNullOrWhiteSpace(dto.TicketType);
        }

        private static string GenerateConfirmationCode()
        {
            // Generate a random alphanumeric confirmation code
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 10)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}