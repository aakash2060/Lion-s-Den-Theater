using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/theaters")]
    [ApiController]
    public class TheatersController : ControllerBase
    {
        private readonly DbSet<Theater> theaters;
        private readonly DataContext dataContext;
        private readonly UserManager<User> userManager;

        public TheatersController(DataContext dataContext, UserManager<User> userManager)
        {
            this.dataContext = dataContext;
            theaters = dataContext.Set<Theater>();
            this.userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTheaters()
        {
            var theaterDtos = await GetTheaterDtos(theaters).ToListAsync();
            return Ok(theaterDtos);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<TheaterDto>> GetTheaterById(int id)
        {
            var result = await GetTheaterDtos(theaters.Where(x => x.Id == id)).FirstOrDefaultAsync();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult<TheaterDto>> CreateTheater(TheaterDto dto)
        {
            if (await IsInvalid(dto))
            {
                return BadRequest("Invalid theater data");
            }

            // Validate manager if provided
            if (dto.ManagerId.HasValue)
            {
                var user = await userManager.FindByIdAsync(dto.ManagerId.Value.ToString());
                if (user == null)
                {
                    return BadRequest("Manager not found");
                }

                // Ensure user has Manager role
                if (!await userManager.IsInRoleAsync(user, UserRoleNames.Manager))
                {
                    // Add to manager role if not already
                    await userManager.AddToRoleAsync(user, UserRoleNames.Manager);
                }
            }

            var theater = new Theater
            {
                Name = dto.Name,
                Address = dto.Address,
                SeatCount = dto.SeatCount,
                ManagerId = dto.ManagerId
            };

            theaters.Add(theater);
            await dataContext.SaveChangesAsync();

            dto.Id = theater.Id;

            return CreatedAtAction(nameof(GetTheaterById), new { id = dto.Id }, dto);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize]
        public async Task<ActionResult<TheaterDto>> UpdateTheater(int id, TheaterDto dto)
        {
            if (await IsInvalid(dto))
            {
                return BadRequest("Invalid theater data");
            }

            var theater = await theaters
                .Include(t => t.Manager)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (theater == null)
            {
                return NotFound();
            }

            var currentUser = await userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            // Only Admin or the assigned Manager can update theater
            bool isAdmin = User.IsInRole(UserRoleNames.Admin);
            bool isManager = User.IsInRole(UserRoleNames.Manager);

            if (!isAdmin && (!isManager || theater.ManagerId != currentUser.Id))
            {
                return Forbid();
            }

            theater.Name = dto.Name;
            theater.Address = dto.Address;
            theater.SeatCount = dto.SeatCount;

            // Only Admin can change the manager
            if (isAdmin && dto.ManagerId != theater.ManagerId)
            {
                // Validate new manager if provided
                if (dto.ManagerId.HasValue)
                {
                    var newManager = await userManager.FindByIdAsync(dto.ManagerId.Value.ToString());
                    if (newManager == null)
                    {
                        return BadRequest("Manager not found");
                    }

                    // Ensure user has Manager role
                    if (!await userManager.IsInRoleAsync(newManager, UserRoleNames.Manager))
                    {
                        await userManager.AddToRoleAsync(newManager, UserRoleNames.Manager);
                    }
                }

                theater.ManagerId = dto.ManagerId;
            }

            await dataContext.SaveChangesAsync();

            dto.Id = theater.Id;
            dto.ManagerId = theater.ManagerId;

            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult> DeleteTheater(int id)
        {
            var theater = await theaters
                .Include(t => t.Halls)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (theater == null)
            {
                return NotFound();
            }

            // Check if theater has any halls
            if (theater.Halls != null && theater.Halls.Any())
            {
                return BadRequest("Cannot delete theater with existing halls. Delete halls first.");
            }

            theaters.Remove(theater);
            await dataContext.SaveChangesAsync();

            return Ok();
        }

        private async Task<bool> IsInvalid(TheaterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) || dto.Name.Length > 120 ||
                string.IsNullOrWhiteSpace(dto.Address) || dto.SeatCount <= 0)
            {
                return true;
            }

            // Check if manager exists
            if (dto.ManagerId.HasValue)
            {
                var user = await userManager.FindByIdAsync(dto.ManagerId.Value.ToString());
                return user == null;
            }

            return false;
        }

        private IQueryable<TheaterDto> GetTheaterDtos(IQueryable<Theater> theaters)
        {
            return theaters
                .Include(x => x.Manager)
                .Select(x => new TheaterDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Address = x.Address,
                    SeatCount = x.SeatCount,
                    ManagerId = x.ManagerId
                });
        }
    }
}