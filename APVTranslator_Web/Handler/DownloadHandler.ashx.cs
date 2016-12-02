using APVTranslator_Common;
using APVTranslator_Entity.Models;
using APVTranslator_Model.Models;
using APVTranslator_Web.Handler.Class;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace APVTranslator_Web.Handler
{
    /// <summary>
    /// Summary description for DownloadHandler
    /// </summary>
    public class DownloadHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                var user = HttpContext.Current.User;
                var projectId = context.Request["projectId"];
                var fileId = context.Request["fileId"];
                if (user.Identity.IsAuthenticated && projectId != null && fileId != null && GetUserPermission(SessionUser.GetUserId(), Convert.ToInt32(projectId)))
                {

                    TranslateModel translateModel = new TranslateModel();
                    Project project = translateModel.GetProject(Convert.ToInt32(projectId));
                    ProjectFile file = translateModel.GetFile(Convert.ToInt32(projectId), Convert.ToInt32(fileId));
                    if (project != null && file != null)
                    {
                        context.Response.Clear();
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.AddHeader("Content-Disposition", "attachment; filename=" + file.FileName);
                        string exportPath = Utility.GetRootPath() + Contanst.rootProject + "\\" + project.Title + "\\Exports\\" + file.FileName;
                        var fileExt = Path.GetExtension(file.FileName);
                        string translatedFile = exportPath.Replace(fileExt, $"_Export{fileExt}");
                        context.Response.WriteFile(translatedFile);
                        context.Response.End();
                    }
                    else
                    {
                        //error
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }

        }

        private bool GetUserPermission(int userId, int projectId)
        {
            try
            {
                TranslateModel translateModel = new TranslateModel();
                ApplicationDbContext appDb = new ApplicationDbContext();
                List<Role> lstUserRoles = appDb.GetUserRoleId(userId);
                if (lstUserRoles.Any(r => r.Id == (int)UserRoles.Admin))
                {
                    return true;
                }
                return translateModel.GetUserPermission(userId, projectId);
            }
            catch (Exception)
            {
                return false;
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