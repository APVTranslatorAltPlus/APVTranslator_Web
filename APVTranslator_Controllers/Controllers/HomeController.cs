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

namespace APVTranslator_Controllers.Controllers
{
  
    public class HomeController : Controller
    {
        DashBoardModel db = new DashBoardModel();
        
        [Authorize(Roles = "Admin")]
        public ActionResult Index()
        {
            //var list=db.Proc_GetListProject(1).ToList();
            //var list2 = db.Projects.ToList();
            //if (User.Identity.IsAuthenticated)
            //{
            //    var userID = User.Identity.GetUserId<int>();
            //    var user = User.Identity;
            //    ApplicationDbContext context = new ApplicationDbContext();
            //    var UserManager = new UserManager<ApplicationUser, int>(new UserStore(context));
            //    var s = UserManager.GetRoles(userID);
                //if (s[0].CompareTo("Admin")==0)
                //{
                //    Console.WriteLine("Admin");
                //}
                //else
                //{
                //    Console.WriteLine(s[0].ToString());
                //}
            //}
            return View();
        }

        public string GetListProject()
        {
            var listProject = db.Proc_GetListProject(1).ToList();
            return JsonConvert.SerializeObject(listProject);
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