using APVTranslator_Common;
using APVTranslator_Entity.Models;
using APVTranslator_Model.Models;
using APVTranslator_Services.Untity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Web;

namespace APVTranslator_Services.Services
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "DashboardService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select DashboardService.svc or DashboardService.svc.cs at the Solution Explorer and start debugging.
    public class DashboardService : IDashboardService
    {
        /// <summary>
        /// Get List Project 
        /// </summary>
        /// <returns></returns>
        public ServiceResult GetListProject()
        {
            ServiceResult sResult = new ServiceResult();
            try
            {
                var user = HttpContext.Current.User;
                if (user.Identity.IsAuthenticated)
                {
                    var userId = Convert.ToInt32(Utility.GetCurrentUserID(HttpContext.Current.User.Identity));
                    DashBoardModel dbModel = new DashBoardModel();
                    sResult.Value = dbModel.Proc_GetListProject(userId);
                }
            }
            catch (Exception ex)
            {
                sResult.IsSuccess = false;
                sResult.Message = ex.Message;
            }
            return sResult;
        }

        public ServiceResult GetListFileProject(object projectID)
        {
            ServiceResult sResult = new ServiceResult();
            try
            {
                DashBoardModel dbModel = new DashBoardModel();
                sResult.Value = dbModel.Proc_GetListFileProject(projectID);
            }
            catch (Exception ex)
            {
                sResult.IsSuccess = false;
                sResult.Message = ex.Message;
            }
            return sResult;
        }


        public bool CreateNewProject(object newProject)
        {
            dynamic stuff = JObject.Parse(newProject.ToString());
            // ctvar project = (Project)newProject;
            // Console.WriteLine("aaaa"+stuff.Title);
            string title = stuff.Title;
            string translateLanguage = stuff.TranslateLanguage;
            Debug.WriteLine(title);
            Debug.WriteLine(translateLanguage);
            return true;
        }
        
        public ServiceResult GetListUser()
        {
            ServiceResult sResult = new ServiceResult();
            try
            {
                var user = HttpContext.Current.User;
                if (user.Identity.IsAuthenticated)
                {
                    //var userId = Convert.ToInt32(Utility.GetCurrentUserID(HttpContext.Current.User.Identity));
                    DashBoardModel dbModel = new DashBoardModel();
                    sResult.Value = dbModel.Proc_GetListMember();
                }
            }
            catch (Exception ex)
            {
                sResult.IsSuccess = false;
                sResult.Message = ex.Message;
            }
            return sResult;
        }
    }
}
