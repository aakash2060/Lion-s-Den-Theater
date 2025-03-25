namespace Selu383.SP25.P03.Api.Features.Users
{
    public class CreateUserDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string[]? Roles { get; set; }
    }
}
