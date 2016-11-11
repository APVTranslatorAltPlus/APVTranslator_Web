﻿using APVTranslator_Common;
using APVTranslator_Entity.Models;
using APVTranslator_Model.Models;
using APVTranslator_Services.Untity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
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
                    var userId = SessionUser.GetUserId();
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

        public ServiceResult DeleteFileProject(int projectId, string projectName, int fileId, string fileName)
        {
            ServiceResult sResult = new ServiceResult();
            try
            {
                var user = HttpContext.Current.User;
                if (user.Identity.IsAuthenticated)
                {
                    DashBoardModel dbModel = new DashBoardModel();
                    ApplicationDbContext db = new ApplicationDbContext();
                    List<Role> lstUserRoles = db.GetUserRoleId(SessionUser.GetUserId());
                    if (lstUserRoles.Any(r => r.Id == (int)UserRoles.Admin) || dbModel.CheckUserPermissionToDelete(projectId))
                    {
                        sResult.IsSuccess = dbModel.DeleteFileProject(projectId, fileId);
                    }
                    //delete File
                    if (sResult.IsSuccess)
                    {
                        try
                        {
                            string filePath = Utility.GetRootPath() + "Projects\\" + projectName + "\\Imports\\" + fileName;
                            if (File.Exists(filePath))
                            {
                                File.Delete(filePath);
                            }
                        }
                        catch (Exception ex)
                        {
                            sResult.IsSuccess = false;
                            sResult.Message = "Can't delete physical file!\n" + ex.Message;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                sResult.IsSuccess = false;
                sResult.Message = ex.Message;
            }
            return sResult;
        }


        public bool CreateNewProject(object newProject, IEnumerable<int> listMember)
        {
            try
            {
                dynamic stuff = JObject.Parse(newProject.ToString());

                string title = stuff.Title;
                int translateLanguage = stuff.TranslateLanguage;
                string descriptions = stuff.Descriptions;
                string path = stuff.Path;
                List<string> IdList = new List<string>();
                var user = HttpContext.Current.User;
                string createBy = user.Identity.Name;

                string startDate = null;
                string deadline = null;
                DateTime? dtDeadline = null;
                DateTime? dtStartDate = null;

                if (stuff.CreateAt != null && stuff.CreateAt != "")
                {
                    startDate = stuff.CreateAt;
                    dtStartDate = Convert.ToDateTime(startDate);

                }
                if (stuff.Deadline != null && stuff.Deadline != "")
                {
                    deadline = stuff.Deadline;
                    dtDeadline = Convert.ToDateTime(deadline);
                }

                Project newProjectToDB = new Project(title, null, path, 0, null, null, createBy, dtStartDate, dtDeadline, translateLanguage, descriptions);
                // Debug.WriteLine("Year: {0}, Month: {1}, Day: {2}", dt.Year, dt.Month, dt.Day);
                //Debug.WriteLine("Title = " + newProjectToDB.Title);
                //Debug.WriteLine("UseCompanyDB = " + newProjectToDB.UseCompanyDB);
                //Debug.WriteLine("Path = " + newProjectToDB.Path);
                //Debug.WriteLine("ProjectTypeID = " + newProjectToDB.ProjectTypeID);
                //Debug.WriteLine("Status = " + newProjectToDB.Status);
                //Debug.WriteLine("Progress = " + newProjectToDB.Progress);
                //Debug.WriteLine("CreateBy = " + newProjectToDB.CreateBy);
                //Debug.WriteLine("StartDate = " + newProjectToDB.CreateAt);
                //Debug.WriteLine("Deadline = " + newProjectToDB.DeadLine);
                //Debug.WriteLine("TranslateLanguage = " + newProjectToDB.TranslateLanguageID);
                //Debug.WriteLine("Description = " + newProjectToDB.Descriptions);

                try
                {
                    DashBoardModel dbModel = new DashBoardModel();
                    return dbModel.CreateNewProject(newProjectToDB, listMember);
                }
                catch (System.Data.SqlClient.SqlException e)
                {
                    Debug.WriteLine("Error: " + e.ToString());
                    return false;
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("Error: " + ex.ToString());
                    return false;
                }

            }
            catch (Exception e)
            {
                Debug.WriteLine("Error: " + e.ToString());
                return false;
            }

        }

        public ServiceResult GetListUser()
        {
            ServiceResult sResult = new ServiceResult();
            try
            {
                var user = HttpContext.Current.User;
                if (user.Identity.IsAuthenticated)
                {
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
