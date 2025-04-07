using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/tickets")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly DbSet<Ticket> tickets;
        private readonly DbSet<Showtime> showtimes;
        private readonly DataContext dataContext;
        private readonly UserManager<User> userManager;

        public TicketsController(DataContext dataContext, UserManager<User> userManager)
        {
            this.dataContext = dataContext;
            tickets = dataContext.Set<Ticket>();
            showtimes = dataContext.Set<Showtime>();
            this.userManager = userManager;
        }

        // Helper method to get the current user ID
        private async Task<int> GetCurrentUserId()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }
            return user.Id;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetTickets()
        {
            try
            {
                var userId = await GetCurrentUserId();
                var isAdmin = User.IsInRole(UserRoleNames.Admin);
                var isManager = User.IsInRole(UserRoleNames.Manager);

                var query = tickets
                    .Include(t => t.Showtime)
                    .ThenInclude(s => s.Movie)
                    .Include(t => t.Showtime)
                    .ThenInclude(s => s.Hall)
                    .ThenInclude(h => h.Theater)
                    .AsQueryable();

                // Filter by user role
                if (!isAdmin)
                {
                    if (isManager)
                    {
                        // Managers can see tickets for their theaters
                        query = query.Where(t => t.Showtime.Hall.Theater.ManagerId == userId);
                    }
                    else
                    {
                        // Regular users can only see their own tickets
                        query = query.Where(t => t.UserId == userId);
                    }
                }

                var result = await query
                    .Select(t => new TicketDto
                    {
                        Id = t.Id,
                        ShowtimeId = t.ShowtimeId,
                        UserId = t.UserId,
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
            catch (InvalidOperationException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpGet("user")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetUserTickets()
        {
            try
            {
                var userId = await GetCurrentUserId();

                var result = await tickets
                    .Include(t => t.Showtime)
                    .ThenInclude(s => s.Movie)
                    .Include(t => t.Showtime)
                    .ThenInclude(s => s.Hall)
                    .ThenInclude(h => h.Theater)
                    .Where(t => t.UserId == userId)
                    .Select(t => new TicketDto
                    {
                        Id = t.Id,
                        ShowtimeId = t.ShowtimeId,
                        UserId = t.UserId,
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
            catch (InvalidOperationException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpGet]
        [Route("{id}")]
        [Authorize]
        public async Task<ActionResult<TicketDetailDto>> GetTicket(int id)
        {
            try
            {
                var userId = await GetCurrentUserId();
                var isAdmin = User.IsInRole(UserRoleNames.Admin);
                var isManager = User.IsInRole(UserRoleNames.Manager);

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

                // If not admin and not owner, check if manager of this theater
                if (!isAdmin && ticket.UserId != userId)
                {
                    if (isManager)
                    {
                        if (ticket.Showtime.Hall.Theater.ManagerId != userId)
                        {
                            return Forbid();
                        }
                    }
                    else
                    {
                        return Forbid();
                    }
                }

                var result = new TicketDetailDto
                {
                    Id = ticket.Id,
                    ShowtimeId = ticket.ShowtimeId,
                    UserId = ticket.UserId,
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
            catch (InvalidOperationException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<TicketDto>> PurchaseTicket(PurchaseTicketDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest("Invalid ticket data");
            }

            try
            {
                var userId = await GetCurrentUserId();

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

                // Check for available seats
                var ticketCount = await tickets.CountAsync(t => t.ShowtimeId == dto.ShowtimeId);
                if (ticketCount >= showtime.Hall.Capacity)
                {
                    // Update the IsSoldOut flag if needed
                    if (!showtime.IsSoldOut)
                    {
                        showtime.IsSoldOut = true;
                        await dataContext.SaveChangesAsync();
                    }
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
                    UserId = userId,
                    PurchaseDate = DateTime.UtcNow,
                    SeatNumber = dto.SeatNumber,
                    Price = showtime.TicketPrice,
                    TicketType = dto.TicketType,
                    ConfirmationNumber = confirmationNumber
                };

                tickets.Add(ticket);
                await dataContext.SaveChangesAsync();

                // Check if this was the last available seat
                if (ticketCount + 1 >= showtime.Hall.Capacity && !showtime.IsSoldOut)
                {
                    showtime.IsSoldOut = true;
                    await dataContext.SaveChangesAsync();
                }

                var result = new TicketDto
                {
                    Id = ticket.Id,
                    ShowtimeId = ticket.ShowtimeId,
                    UserId = ticket.UserId,
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
            catch (InvalidOperationException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPut]
        [Route("{id}/checkin")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> CheckInTicket(int id)
        {
            try
            {
                var userId = await GetCurrentUserId();
                var ticket = await tickets
                    .Include(t => t.Showtime)
                    .ThenInclude(s => s.Hall)
                    .ThenInclude(h => h.Theater)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (ticket == null)
                {
                    return NotFound();
                }

                // If manager, check if they manage this theater
                if (User.IsInRole(UserRoleNames.Manager) && !User.IsInRole(UserRoleNames.Admin))
                {
                    if (ticket.Showtime.Hall.Theater.ManagerId != userId)
                    {
                        return Forbid();
                    }
                }

                // Only check in if not already checked in
                if (!ticket.IsCheckedIn)
                {
                    ticket.IsCheckedIn = true;
                    await dataContext.SaveChangesAsync();
                }

                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize]
        public async Task<IActionResult> CancelTicket(int id)
        {
            try
            {
                var userId = await GetCurrentUserId();
                var isAdmin = User.IsInRole(UserRoleNames.Admin);
                var isManager = User.IsInRole(UserRoleNames.Manager);

                var ticket = await tickets
                    .Include(t => t.Showtime)
                    .ThenInclude(s => s.Hall)
                    .ThenInclude(h => h.Theater)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (ticket == null)
                {
                    return NotFound();
                }

                // If not admin and not owner, check if manager of this theater
                if (!isAdmin && ticket.UserId != userId)
                {
                    if (isManager)
                    {
                        if (ticket.Showtime.Hall.Theater.ManagerId != userId)
                        {
                            return Forbid();
                        }
                    }
                    else
                    {
                        return Forbid();
                    }
                }

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

                // Update the sold out status if removing this ticket makes seats available
                if (ticket.Showtime.IsSoldOut)
                {
                    ticket.Showtime.IsSoldOut = false;
                }

                await dataContext.SaveChangesAsync();

                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpGet("sales")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetTicketSalesData([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var query = tickets
                .Include(t => t.Showtime)
                .ThenInclude(s => s.Movie)
                .Include(t => t.Showtime)
                .ThenInclude(s => s.Hall)
                .ThenInclude(h => h.Theater)
                .AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(t => t.PurchaseDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(t => t.PurchaseDate <= endDate.Value);
            }

            var salesData = await query
                .GroupBy(t => new { t.Showtime.Movie.Title, t.Showtime.Hall.Theater.Name, t.PurchaseDate.Date })
                .Select(g => new SalesDataDto
                {
                    MovieTitle = g.Key.Title,
                    TheaterName = g.Key.Name,
                    Date = g.Key.Date,
                    TicketsSold = g.Count(),
                    TotalRevenue = g.Sum(t => t.Price)
                })
                .ToListAsync();

            return Ok(salesData);
        }

        [HttpGet("movie-ticket-sales")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetMovieTicketSalesData([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] bool groupByDate = true, [FromQuery] int? theaterId = null)
        {
            var query = tickets
                .Include(t => t.Showtime)
                .ThenInclude(s => s.Movie)
                .Include(t => t.Showtime)
                .ThenInclude(s => s.Hall)
                .ThenInclude(h => h.Theater)
                .AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(t => t.PurchaseDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(t => t.PurchaseDate <= endDate.Value);
            }

            if (theaterId.HasValue)
            {
                query = query.Where(t => t.Showtime.Hall.TheaterId == theaterId.Value);
            }

            if (groupByDate)
            {
                var groupedByDate = await query
                    .GroupBy(t => new
                    {
                        t.Showtime.Movie.Title,
                        TheaterName = t.Showtime.Hall.Theater.Name,
                        Date = t.PurchaseDate.Date
                    })
                    .Select(g => new SalesDataDto
                    {
                        MovieTitle = g.Key.Title,
                        TheaterName = g.Key.TheaterName,
                        Date = g.Key.Date,
                        TicketsSold = g.Count(),
                        TotalRevenue = g.Sum(t => t.Price)
                    })
                    .ToListAsync();

                return Ok(groupedByDate);
            }
            else
            {
                var summarized = await query
                    .GroupBy(t => new
                    {
                        t.Showtime.Movie.Title,
                        TheaterName = t.Showtime.Hall.Theater.Name
                    })
                    .Select(g => new SalesDataDto
                    {
                        MovieTitle = g.Key.Title,
                        TheaterName = g.Key.TheaterName,
                        TicketsSold = g.Count(),
                        TotalRevenue = g.Sum(t => t.Price)
                    })
                    .OrderByDescending(s => s.TicketsSold)
                    .ToListAsync();

                return Ok(summarized);
            }
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