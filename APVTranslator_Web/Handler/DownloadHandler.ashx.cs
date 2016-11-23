using APVTranslator_Common;
using APVTranslator_Model.Models;
using APVTranslator_Web.Handler.Class;
using System;
using System.Collections.Generic;
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

                    ExportFile ef = new ExportFile(Convert.ToInt32(projectId), Convert.ToInt32(fileId));
                    if (ef.BuildExportFile())
                    {
                        context.Response.Clear();
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.AddHeader("Content-Disposition", "attachment; filename=" + ef.fileName);
                        context.Response.WriteFile(ef.translatedFile);
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