using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace APVTranslator_Common
{
    public static class SessionUser
    {
        public static int GetUserId()
        {
            if (HttpContext.Current.Session == null)
            {
                var identity = HttpContext.Current.User.Identity;
                return Convert.ToInt32(IdentityExtensions.GetUserId(identity));
            }
            else if (HttpContext.Current.Session["UserId"] != null)
            {
                return Convert.ToInt32(HttpContext.Current.Session["UserId"]);
            }
            else
            {
                var identity = HttpContext.Current.User.Identity;
                HttpContext.Current.Session.Add("UserId", IdentityExtensions.GetUserId(identity));
                return Convert.ToInt32(HttpContext.Current.Session["UserId"]);
            }
        }
        public static String GetUserName()
        {
            if (HttpContext.Current.Session["UserName"] != null)
            {
                return Convert.ToString(HttpContext.Current.Session["UserName"]);
            }
            else
            {
                var identity = HttpContext.Current.User.Identity;
                HttpContext.Current.Session.Add("UserName", IdentityExtensions.GetUserName(identity));
                return Convert.ToString(HttpContext.Current.Session["UserName"]);
            }
        }
    }
}
