using EmailService;
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
        private readonly EmailService.IEmailSender emailSender;
        private readonly SignInManager<User> signInManager;

        public TicketsController(DataContext dataContext, UserManager<User> userManager, EmailService.IEmailSender emailSender, SignInManager<User> signInManager)
        {
            this.dataContext = dataContext;
            tickets = dataContext.Set<Ticket>();
            showtimes = dataContext.Set<Showtime>();
            this.userManager = userManager;
            this.emailSender = emailSender;
            this.signInManager = signInManager;
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
        public async Task<ActionResult<TicketDto>> PurchaseTicket(PurchaseTicketDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest("Invalid ticket data");
            }

            User user = null;

            try
            {
                int userId;

                if (User.Identity.IsAuthenticated)
                {
                    userId = await GetCurrentUserId();
                    user = await userManager.FindByIdAsync(userId.ToString());
                }
                else
                {
                    if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                    {
                        return BadRequest("Email and password are required for guest users.");
                    }

                    var guestUser = new User
                    {
                        UserName = $"guest{DateTime.UtcNow.Ticks}",
                        Email = dto.Email,
                        FirstName = "Guest",
                        LastName = "User",
                        EmailConfirmed = true
                    };

                    var result = await userManager.CreateAsync(guestUser, dto.Password);
                    if (!result.Succeeded)
                    {
                        return BadRequest(result.Errors);
                    }

                    await signInManager.SignInAsync(guestUser, isPersistent: false);
                    user = guestUser;
                    userId = guestUser.Id;
                }

                var showtime = await showtimes
                    .Include(s => s.Movie)
                    .Include(s => s.Hall)
                    .ThenInclude(h => h.Theater)
                    .FirstOrDefaultAsync(s => s.Id == dto.ShowtimeId);

                if (showtime == null) return BadRequest("Showtime not found");

                if (showtime.StartTime < DateTime.UtcNow) return BadRequest("Cannot purchase tickets for past showtimes");

                var ticketCount = await tickets.CountAsync(t => t.ShowtimeId == dto.ShowtimeId);
                if (ticketCount >= showtime.Hall.Capacity)
                {
                    if (!showtime.IsSoldOut)
                    {
                        showtime.IsSoldOut = true;
                        await dataContext.SaveChangesAsync();
                    }
                    return BadRequest("This showtime is sold out");
                }

                if (!string.IsNullOrEmpty(dto.SeatNumber))
                {
                    var seatTaken = await tickets
                        .AnyAsync(t => t.ShowtimeId == dto.ShowtimeId && t.SeatNumber == dto.SeatNumber);

                    if (seatTaken)
                    {
                        return BadRequest("This seat is already taken");
                    }
                }

                var confirmationNumber = GenerateConfirmationCode();

                var ticket = new Ticket
                {
                    ShowtimeId = dto.ShowtimeId,
                    UserId = user.Id,
                    PurchaseDate = DateTime.UtcNow,
                    SeatNumber = dto.SeatNumber,
                    Price = showtime.TicketPrice,
                    TicketType = dto.TicketType,
                    ConfirmationNumber = confirmationNumber
                };

                tickets.Add(ticket);
                await dataContext.SaveChangesAsync();

                if (ticketCount + 1 >= showtime.Hall.Capacity && !showtime.IsSoldOut)
                {
                    showtime.IsSoldOut = true;
                    await dataContext.SaveChangesAsync();
                }

                if (!string.IsNullOrEmpty(user?.Email))
                {
                    var emailBody = $@"
                <div style='font-family:Segoe UI, sans-serif; padding:20px; color:#333;'>
                    <h2 style='color:#d35400;'>🎟️ Your Ticket Confirmation</h2>
                    <p>Hello {user.FirstName},</p>
                    <p>Thanks for booking with <strong>Lion's Den Theaters</strong>! 🦁</p>
                    <p><strong>Movie:</strong> {showtime.Movie.Title}</p>
                    <p><strong>Theater:</strong> {showtime.Hall.Theater.Name}</p>
                    <p><strong>Hall:</strong> {showtime.Hall.HallNumber}</p>
                    <p><strong>Seat:</strong> {ticket.SeatNumber}</p>
                    <p><strong>Date & Time:</strong> {showtime.StartTime:dddd, MMM dd yyyy, h:mm tt}</p>
                    <p><strong>Ticket Type:</strong> {ticket.TicketType}</p>
                    <p><strong>Price:</strong> ${ticket.Price:F2}</p>
                    <p><strong>Confirmation:</strong> {ticket.ConfirmationNumber}</p>
                    <br />
                    <p style='font-size:14px;'>This email is your ticket. Please present it at the entrance. 🍿</p>
                    <p><strong>– The Lion’s Den Team</strong></p>
                </div>";

                    var message = new Message(new[] { user.Email }, "🎟️ Your Lion's Den Ticket Confirmation", emailBody);
                    await emailSender.SendEmailAsync(message);
                }

                var resultDto = new TicketDto
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

                return CreatedAtAction(nameof(GetTicket), new { id = resultDto.Id }, resultDto);
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

        [HttpGet("showtime/{showtimeId}")]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetTicketsByShowtime(int showtimeId)
        {
            // Check if the showtime exists
            var showtimeExists = await showtimes.AnyAsync(s => s.Id == showtimeId);
            if (!showtimeExists)
            {
                return NotFound("Showtime not found");
            }

            var result = await tickets
                .Include(t => t.Showtime)
                .ThenInclude(s => s.Movie)
                .Include(t => t.Showtime)
                .ThenInclude(s => s.Hall)
                .ThenInclude(h => h.Theater)
                .Where(t => t.ShowtimeId == showtimeId)
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
        }
    }
