using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using APVTranslator_Model.Models;
using APVTranslator_Common;

namespace APVTranslator_Web.Handler
{
    /// <summary>
    /// Summary description for UploadHandler
    /// </summary>
    public class UploadHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            //context.Response.ContentType = "multipart/form-data";
            //context.Response.Expires = -1;

            try
            {
                var user = HttpContext.Current.User;
                var projectId = context.Request["projectId"];
                var projectName = context.Request["projectName"];
                if (user.Identity.IsAuthenticated)
                {
                    List<HttpPostedFile> lstFile = new List<HttpPostedFile>();
                    //write your handler implementation here.
                    if (context.Request.Files.Count <= 0)
                    {
                        context.Response.Write("No file uploaded");
                    }
                    else
                    {
                        //check again projectID and projectName
                        DashBoardModel dbm = new DashBoardModel();
                        string rootPath = Utility.GetRootPath();
                        string importPath = rootPath + Contanst.rootProject + "\\" + projectName + "\\Imports";
                        string exportPath = rootPath + Contanst.rootProject + "\\" + projectName + "\\Exports";
                        if (!Directory.Exists(importPath))
                        {
                            Directory.CreateDirectory(importPath);
                        }
                        if (!Directory.Exists(exportPath))
                        {
                            Directory.CreateDirectory(exportPath);
                        }
                        for (int i = 0; i < context.Request.Files.Count; ++i)
                        {
                            try
                            {
                                HttpPostedFile file = context.Request.Files[i];
                                string fileExt = Path.GetExtension(file.FileName);
                                if (Contanst.fileType.Contains(fileExt))
                                {
                                    file.SaveAs(importPath + "\\" + file.FileName);
                                    lstFile.Add(file);
                                }
                            }
                            catch (Exception ex)
                            {
                                continue;
                            }
                        };
                        dbm.InsertProjectFile(Convert.ToInt32(projectId), importPath, lstFile);
                    }
                }
            }
            catch (Exception ex)
            {
                context.Response.Write("Error: " + ex.Message);
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}