using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Users;
using System.Linq;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;
        private readonly DataContext dataContext;
        private DbSet<Role> roles;

        public UsersController(
            RoleManager<Role> roleManager,
            UserManager<User> userManager,
            DataContext dataContext)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
            this.dataContext = dataContext;
            roles = dataContext.Set<Role>();
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto)
        {
            // Ensure all required fields are provided
            if (string.IsNullOrWhiteSpace(dto.FirstName) ||
                string.IsNullOrWhiteSpace(dto.LastName) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password) ||
                string.IsNullOrWhiteSpace(dto.Username))
            {
                return BadRequest("All fields are required.");
            }

            // Check if email already exists
            if (await userManager.FindByEmailAsync(dto.Email) != null)
            {
                return BadRequest("Email is already taken.");
            }

            // Check if username already exists
            if (await userManager.FindByNameAsync(dto.Username) != null)
            {
                return BadRequest("Username is already taken.");
            }

            // Create the new user
            var newUser = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                UserName = dto.Username,
                Email = dto.Email
            };

            // Create user with Identity
            var result = await userManager.CreateAsync(newUser, dto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Assign roles if provided
            if (dto.Roles != null && dto.Roles.Length > 0)
            {
                var validRoles = await roles.Select(r => r.Name).ToListAsync();
                if (!dto.Roles.All(role => validRoles.Contains(role)))
                {
                    return BadRequest("Invalid roles provided.");
                }

                await userManager.AddToRolesAsync(newUser, dto.Roles);
            }

            // Return created user
            return new UserDto
            {
                Id = newUser.Id,
                UserName = newUser.UserName,
                Roles = dto.Roles ?? new string[] { } // Return empty array if no roles
            };
        }
    }
}
