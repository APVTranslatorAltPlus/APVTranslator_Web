using APVTranslator_Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using System.Net;

namespace APVTranslator_Controllers.Controllers
{
    public class HomeController : Controller
    {
        TranslatorModel db = new TranslatorModel();
        public ActionResult Index()
        {
            var list=db.Proc_GetListProject(1).ToList();
            var list2 = db.Projects.ToList();
            return View(list);
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