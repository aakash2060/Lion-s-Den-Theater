using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/halls")]
    [ApiController]
    public class HallsController : ControllerBase
    {
        private readonly DbSet<Hall> halls;
        private readonly DbSet<Theater> theaters;
        private readonly DataContext dataContext;
        private readonly UserManager<User> userManager;

        public HallsController(DataContext dataContext, UserManager<User> userManager)
        {
            this.dataContext = dataContext;
            halls = dataContext.Set<Hall>();
            theaters = dataContext.Set<Theater>();
            this.userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllHalls()
        {
            var hallDtos = await GetHallDtos(halls).ToListAsync();
            return Ok(hallDtos);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<HallDto>> GetHallById(int id)
        {
            var result = await GetHallDtos(halls.Where(x => x.Id == id)).FirstOrDefaultAsync();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet]
        [Route("theater/{theaterId}")]
        public async Task<IActionResult> GetHallsByTheater(int theaterId)
        {
            var theater = await theaters.FindAsync(theaterId);
            if (theater == null)
            {
                return NotFound("Theater not found");
            }

            var hallDtos = await GetHallDtos(halls.Where(x => x.TheaterId == theaterId)).ToListAsync();
            return Ok(hallDtos);
        }

        [HttpPost]
        [Authorize(Roles = UserRoleNames.Admin + "," + UserRoleNames.Manager)]
        public async Task<ActionResult<HallDto>> CreateHall(CreateHallDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest("Invalid hall data");
            }

            // Verify that the theater exists
            var theater = await theaters
                .Include(t => t.Manager)
                .FirstOrDefaultAsync(t => t.Id == dto.TheaterId);

            if (theater == null)
            {
                return BadRequest("Theater not found");
            }

            // If user is a manager, verify they manage this theater
            if (User.IsInRole(UserRoleNames.Manager) && !User.IsInRole(UserRoleNames.Admin))
            {
                var currentUser = await userManager.GetUserAsync(User);
                if (currentUser == null || theater.ManagerId != currentUser.Id)
                {
                    return Forbid();
                }
            }

            // Check if hall number already exists in this theater
            var hallNumberExists = await halls
                .AnyAsync(h => h.TheaterId == dto.TheaterId && h.HallNumber == dto.HallNumber);

            if (hallNumberExists)
            {
                return BadRequest("A hall with this number already exists in this theater");
            }

            var hall = new Hall
            {
                HallNumber = dto.HallNumber,
                TheaterId = dto.TheaterId,
                Capacity = dto.Capacity,
                ScreenType = dto.ScreenType ?? "Standard" // Default to Standard if not specified
            };

            halls.Add(hall);
            await dataContext.SaveChangesAsync();

            var result = new HallDto
            {
                Id = hall.Id,
                HallNumber = hall.HallNumber,
                TheaterId = hall.TheaterId,
                TheaterNumber = theater.Id, // Setting TheaterNumber based on Theater ID
                Capacity = hall.Capacity,
                ScreenType = hall.ScreenType
            };

            return CreatedAtAction(nameof(GetHallById), new { id = result.Id }, result);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize]
        public async Task<ActionResult<HallDto>> UpdateHall(int id, UpdateHallDto dto)
        {
            var hall = await halls
                .Include(h => h.Theater)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (hall == null)
            {
                return NotFound();
            }

            // If user is a manager, verify they manage this theater
            var currentUser = await userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            bool isAdmin = User.IsInRole(UserRoleNames.Admin);
            bool isManager = User.IsInRole(UserRoleNames.Manager);

            if (!isAdmin && (!isManager || hall.Theater.ManagerId != currentUser.Id))
            {
                return Forbid();
            }

            // Check if the hall number is being changed and if it would conflict
            if (hall.HallNumber != dto.HallNumber)
            {
                var hallNumberExists = await halls
                    .AnyAsync(h => h.Id != id && h.TheaterId == hall.TheaterId && h.HallNumber == dto.HallNumber);

                if (hallNumberExists)
                {
                    return BadRequest("A hall with this number already exists in this theater");
                }
            }

            // Check if there are any active showtimes
            var hasActiveShowtimes = await dataContext.Set<Showtime>()
                .AnyAsync(s => s.HallId == id && s.StartTime > DateTime.UtcNow);

            // If there are active showtimes, don't allow capacity reduction
            if (hasActiveShowtimes && dto.Capacity < hall.Capacity)
            {
                return BadRequest("Cannot reduce hall capacity while there are active showtimes");
            }

            hall.HallNumber = dto.HallNumber;
            hall.Capacity = dto.Capacity;
            hall.ScreenType = dto.ScreenType ?? hall.ScreenType;

            await dataContext.SaveChangesAsync();

            var result = new HallDto
            {
                Id = hall.Id,
                HallNumber = hall.HallNumber,
                TheaterId = hall.TheaterId,
                TheaterNumber = hall.Theater.Id,
                Capacity = hall.Capacity,
                ScreenType = hall.ScreenType
            };

            return Ok(result);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteHall(int id)
        {
            var hall = await halls
                .Include(h => h.Theater)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (hall == null)
            {
                return NotFound();
            }

            // If user is a manager, verify they manage this theater
            var currentUser = await userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            bool isAdmin = User.IsInRole(UserRoleNames.Admin);
            bool isManager = User.IsInRole(UserRoleNames.Manager);

            if (!isAdmin && (!isManager || hall.Theater.ManagerId != currentUser.Id))
            {
                return Forbid();
            }

            // Check if there are any showtimes for this hall
            var hasShowtimes = await dataContext.Set<Showtime>()
                .AnyAsync(s => s.HallId == id);

            if (hasShowtimes)
            {
                return BadRequest("Cannot delete a hall with scheduled showtimes");
            }

            halls.Remove(hall);
            await dataContext.SaveChangesAsync();

            return Ok();
        }

        private bool IsInvalid(CreateHallDto dto)
        {
            return dto.HallNumber <= 0 ||
                   dto.TheaterId <= 0 ||
                   dto.Capacity <= 0 ||
                   (dto.ScreenType != null && dto.ScreenType.Length > 50);
        }

        private IQueryable<HallDto> GetHallDtos(IQueryable<Hall> halls)
        {
            return halls
                .Include(h => h.Theater)
                .Select(h => new HallDto
                {
                    Id = h.Id,
                    HallNumber = h.HallNumber,
                    TheaterId = h.TheaterId,
                    TheaterNumber = h.Theater.Id, 
                    Capacity = h.Capacity,
                    ScreenType = h.ScreenType
                });
        }
    }
}