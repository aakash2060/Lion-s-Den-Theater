using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Recovery;
using Selu383.SP25.P03.Api.Features.Users;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;
        private readonly DataContext dataContext;
        private readonly IEmailSender emailSender;
        private DbSet<Role> roles;

        public UsersController(
            RoleManager<Role> roleManager,
            UserManager<User> userManager,
            DataContext dataContext,
            IEmailSender emailSender)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
            this.dataContext = dataContext;
            this.emailSender = emailSender;
            roles = dataContext.Set<Role>();
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto)
        {
            if (!dto.Roles.Any() || !dto.Roles.All(x => roles.Any(y => x == y.Name)))
            {
                return BadRequest();
            }

            var result = await userManager.CreateAsync(new User { UserName = dto.Username }, dto.Password);
            if (result.Succeeded)
            {
                await userManager.AddToRolesAsync(await userManager.FindByNameAsync(dto.Username), dto.Roles);

                var user = await userManager.FindByNameAsync(dto.Username);
                return new UserDto
                {
                    Id = user.Id,
                    UserName = dto.Username,
                    Roles = dto.Roles
                };
            }
            return BadRequest();
        }

        [HttpPost("forgotpassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPassword)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var user = await userManager.FindByEmailAsync(forgotPassword.Email!);

            if (user == null)
                return NotFound();

            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var param = new Dictionary<string, string?>
            {
                {"token", token},
                {"email", forgotPassword.Email!}
            };

            var callback = QueryHelpers.AddQueryString(forgotPassword.ClientUri!, param);

            var subject = "Password Reset Request";
            var body = $"<p>Please click the following link to reset your password: <a href='{callback}'>Reset Password</a></p>";

            await emailSender.SendEmailAsync(forgotPassword.Email!, subject, body);

            return Ok("Password reset email sent.");
        }

    }
}
