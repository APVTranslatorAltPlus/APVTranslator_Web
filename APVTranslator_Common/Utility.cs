using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace APVTranslator_Common
{
    public static class Utility
    {
        public static string GetCurrentUserID(IIdentity identity)
        {
            return IdentityExtensions.GetUserId(identity);
        }
    }
}
