using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace Selu383.SP25.P03.Api.Features.Users
{
    public class User : IdentityUser<int>
    {
        
        public virtual ICollection<UserRole> UserRoles { get; } = new List<UserRole>();

        
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }
}
