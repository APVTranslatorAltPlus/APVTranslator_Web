using APVTranslator_Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using System.Net;

namespace APVTranslator_Web.Controllers
{
    public class HomeController : Controller
    {
        private TranslatorModel db = new TranslatorModel();

        [Authorize]
        public ActionResult Index()
        {
            var s = db.Database.SqlQuery<Project>("Proc_GetListProject", new object[] { 1 });
            return View(db.Projects.ToList());
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            //
            return View();
        }
    }
}