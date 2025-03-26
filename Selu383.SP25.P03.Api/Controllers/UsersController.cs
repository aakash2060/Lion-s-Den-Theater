using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Recovery;
using Selu383.SP25.P03.Api.Features.Users;
using Microsoft.AspNetCore.Identity.UI.Services;
using EmailService;
using System.Text;
using System.Text.RegularExpressions;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;
        private readonly DataContext dataContext;
        private readonly EmailService.IEmailSender emailSender;
        private DbSet<Role> roles;

        public UsersController(
            RoleManager<Role> roleManager,
            UserManager<User> userManager,
            DataContext dataContext,
            EmailService.IEmailSender emailSender)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
            this.dataContext = dataContext;
            this.emailSender = emailSender;
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

            // Validate password strength
            if (!IsValidPassword(dto.Password))
            {
                return BadRequest("Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.");
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

            // Generate email confirmation token
            var emailConfirmationToken = await userManager.GenerateEmailConfirmationTokenAsync(newUser);

            // Encode the token for added security
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailConfirmationToken));

            // Send the confirmation token in an email (instead of a link)
            var subject = "Email Confirmation Request";
            var body = $"<p>Thank you for registering! Your email confirmation token is: <strong>{encodedToken}</strong></p>";

            var message = new Message(new[] { dto.Email }, subject, body);

            // Send the email with the token
            try
            {
                await emailSender.SendEmailAsync(message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error sending email: {ex.Message}");
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

        // Forgot Password
        [HttpPost("forgotpassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPassword)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request.");

            var user = await userManager.FindByEmailAsync(forgotPassword.Email!);
            if (user == null)
                return NotFound("User not found.");

            try
            {
                // Generate password reset token
                var token = await userManager.GeneratePasswordResetTokenAsync(user);

                // Encode the token for added security
                var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                // Send the reset token in an email (instead of a clickable link)
                var subject = "Password Reset Request";
                var body = $"<p>We received a request to reset your password. Your password reset token is: <strong>{encodedToken}</strong></p>";

                var message = new Message(new[] { forgotPassword.Email! }, subject, body);

                // Send the email with the token
                await emailSender.SendEmailAsync(message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error sending email: {ex.Message}");
            }

            return Ok("Password reset email sent.");
        }

        // Reset Password
        [HttpPost("resetpassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPassword)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid password reset request.");

            var user = await userManager.FindByEmailAsync(resetPassword.Email);
            if (user == null)
                return BadRequest("User not found.");

            try
            {
                var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(resetPassword.Token));
                var result = await userManager.ResetPasswordAsync(user, decodedToken, resetPassword.NewPassword);

                if (!result.Succeeded)
                {
                    return BadRequest("Password reset failed.");
                }

                return Ok("Password has been reset successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error processing password reset: {ex.Message}");
            }
        }

        // Confirm Email
        [HttpGet("confirmemail")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (userId == null || token == null)
            {
                return BadRequest("Invalid email confirmation request.");
            }

            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            try
            {
                var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
                var result = await userManager.ConfirmEmailAsync(user, decodedToken);

                if (!result.Succeeded)
                {
                    return BadRequest("Email confirmation failed.");
                }

                return Ok("Email confirmed successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error confirming email: {ex.Message}");
            }
        }

        // Helper method to validate password strength
        private bool IsValidPassword(string password)
        {
            // Password should be at least 8 characters long, contain an uppercase letter, a number, and a special character
            var regex = new Regex(@"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$");
            return regex.IsMatch(password);
        }
    }
}
