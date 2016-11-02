using APVTranslator_Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using System.Net;
using APVTranslator_Entity.Models;
using Microsoft.AspNet.Identity;

namespace APVTranslator_Controllers.Controllers
{
    
    public class HomeController : Controller
    {
        TranslatorModel db = new TranslatorModel();

        [Authorize]
        public ActionResult Index()
        {
            var list = db.Proc_GetListProject(1).ToList();
            var list2 = db.AspNetUsers.ToList();
            int userId = int.Parse(User.Identity.GetUserId());
            IQueryable<Project> custQuery = from pm in db.ProjectMembers
                                            where pm.UserID == userId
                                            select pm.Project;


            var list3 = custQuery.ToList();

         
            return View(list3);
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