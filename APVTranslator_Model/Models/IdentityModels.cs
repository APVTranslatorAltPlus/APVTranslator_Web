using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Linq;
using System.Collections.Generic;
using System.Web.Security;
using System.Web;

namespace APVTranslator_Model.Models
{
    // New derived classes
    public class UserRole : IdentityUserRole<int>
    {
    }

    public class UserClaim : IdentityUserClaim<int>
    {
    }

    public class UserLogin : IdentityUserLogin<int>
    {
    }

    public class Role : IdentityRole<int, UserRole>
    {
        public Role() { }
        public Role(string name) { Name = name; }
    }

    public class UserStore : UserStore<ApplicationUser, Role, int,
        UserLogin, UserRole, UserClaim>, IUserStore<ApplicationUser, int>
    {
        public UserStore(ApplicationDbContext context) : base(context)
        {
        }
        public UserStore() : this(new IdentityDbContext())
        {
            base.DisposeContext = true;
        }

        public UserStore(DbContext context)
            : base(context)
        {
        }
    }

    public class RoleStore : RoleStore<Role, int, UserRole>
    {
        public RoleStore(ApplicationDbContext context) : base(context)
        {
        }
    }

    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser<int, UserLogin, UserRole, UserClaim>
    {

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser, int> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, Role, int,
    UserLogin, UserRole, UserClaim>
    {
        public ApplicationDbContext()
            : base("DefaultConnection")
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
        public List<Role> GetUserRoleId(int userId)
        {
            try
            {
                if (HttpContext.Current.Session["UserRoles"] != null)
                {
                    return (List<Role>)HttpContext.Current.Session["UserRoles"];
                }
                else
                {
                    var roles = Users
                                    .Where(u => u.Id == userId)
                                    .SelectMany(u => u.Roles)
                                    .Join(this.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r)
                                    .ToList();
                    HttpContext.Current.Session["UserRoles"] = roles;
                    return roles;
                }
            }
            catch (System.Exception)
            {
                throw;
            }

        }
    }
}