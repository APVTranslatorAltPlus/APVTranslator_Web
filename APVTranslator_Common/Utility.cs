using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace APVTranslator_Common
{
    public static class Utility
    {
        public static string GetRootPath()
        {
            return System.Web.Hosting.HostingEnvironment.MapPath("~");
        }
    }
}
