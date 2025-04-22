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
        private static readonly Dictionary<string, (string Pin, DateTime Expiration)> resetPins = new();
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

            var subject = "Welcome to Lion's Den Theaters";
            var body = $@"
                        <div style='font-family:Segoe UI, sans-serif; background-color:#fff8f0; padding:20px; border-radius:10px; border:1px solid #ffe0b3; max-width:500px; margin:auto;'>
                            <h2 style='color:#c0392b;'>🎟️ Welcome to Lion's Den Theaters</h2>
                            <p style='font-size:16px; color:#333;'>Dear {dto.FirstName},</p>
                            <p style='font-size:16px; color:#333;'>We're absolutely thrilled to have you join our community of movie lovers! 🎉</p>
                            <p style='font-size:16px; color:#333;'>Get ready to enjoy the magic of cinema, special treats, and unforgettable moments.</p>
                            <p style='font-size:16px; color:#333;'>🍿 Your seat is reserved. Let the stories begin!</p>
                            <p style='font-size:16px; color:#333;'>Warm regards,</p>
                            <p style='font-weight:bold; color:#c0392b;'>The Lion's Den Team 🦁</p>
                        </div>";

            var message = new Message(new[] { dto.Email }, subject, body);

            await emailSender.SendEmailAsync(message);

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

            var pin = new Random().Next(100000, 999999).ToString();
            resetPins[forgotPassword.Email!] = (pin, DateTime.UtcNow.AddMinutes(2));
            var subject = "Lion's Den Theaters Password Reset PIN";
            var body = $@"
                        <div style='font-family:Segoe UI, sans-serif; color:#333; max-width:600px; margin:auto;'>
                            <h2 style='color:#b91c1c;'>🦁 Lion's Den Theaters</h2>
                            <p style='font-size:16px;'>Hello,</p>
                            <p style='font-size:16px;'>
                                We received a request to reset your password. Please use the following 6-digit PIN to proceed:
                            </p>
                            <p style='font-size:20px; font-weight:bold; color:#1d4ed8; margin:16px 0;'>
                                {pin}
                            </p>
                            <p style='font-size:14px; color:#555;'>This PIN is valid for <strong>2 minutes</strong>.</p>
                            <p style='font-size:14px; color:#555;'>If you did not request this, you can safely ignore this email.</p>
                            <br/>
                            <p style='font-size:14px;'>Stay cozy and enjoy the magic of the movies 🎬</p>
                            <p style='font-weight:bold;'>– Lion's Den Team</p>
                        </div>";

            var message = new Message(new[] { forgotPassword.Email! }, subject, body);
            await emailSender.SendEmailAsync(message);

            return Ok("Password reset email sent.");
        }

        // Reset Password
        [HttpPost("resetpassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPassword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid password reset request.");
            }

            if (!resetPins.TryGetValue(resetPassword.Email, out var pinInfo))
            {
                return BadRequest("No reset PIN found for this email.");
            }

            if (DateTime.UtcNow > pinInfo.Expiration)
            {
                resetPins.Remove(resetPassword.Email);
                return BadRequest("Reset PIN has expired.");
            }

            if (pinInfo.Pin != resetPassword.Token)
            {
                return BadRequest("Invalid reset PIN.");
            }

            var user = await userManager.FindByEmailAsync(resetPassword.Email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var result = await userManager.ResetPasswordAsync(user, token, resetPassword.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest("Password reset failed.");
            }

            // Invalidate the used PIN
            resetPins.Remove(resetPassword.Email);

            return Ok("Password has been reset successfully.");
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
