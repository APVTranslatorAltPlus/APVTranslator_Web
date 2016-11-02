using APVTranslator_Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using System.Net;
using Newtonsoft.Json;

namespace APVTranslator_Controllers.Controllers
{
    public class HomeController : Controller
    {
        DashBoardModel db = new DashBoardModel();
        public ActionResult Index()
        {
            //var list=db.Proc_GetListProject(1).ToList();
            //var list2 = db.Projects.ToList();
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