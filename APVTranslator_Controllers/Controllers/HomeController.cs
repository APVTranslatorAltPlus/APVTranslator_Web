using APVTranslator_Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using System.Net;
using Newtonsoft.Json;
using Microsoft.AspNet.Identity;
using System.IO;
using APVTranslator_Common;

namespace APVTranslator_Controllers.Controllers
{

    public class HomeController : Controller
    {
        DashBoardModel db = new DashBoardModel();

        [Authorize]
        public ActionResult Index()
        {
            var user = HttpContext.User;
            if (user.Identity.IsAuthenticated)
            {
                var userId = SessionUser.GetUserId();
                ApplicationDbContext appDb = new ApplicationDbContext();
                List<Role> lstUserRoles = appDb.GetUserRoleId(userId);
                if (lstUserRoles.Any(r => r.Id == (int)UserRoles.Admin))
                {
                    ViewBag.UserRole = (int)UserRoles.Admin;
                }
                else
                {
                    ViewBag.UserRole = (int)UserRoles.Other;
                }
            }
            return View();
        }

        public ActionResult upload(IEnumerable<HttpPostedFileBase> files)
        {
            foreach (var file in files)
            {
                if (file.ContentLength > 0)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var path = Path.Combine(Server.MapPath("~/App_Data/uploads"), fileName);
                    file.SaveAs(path);
                }
            }
            return View();
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }


        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}