using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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
            string filePath = "FileSave//";
            try
            {
                var user = HttpContext.Current.User;
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
                        for (int i = 0; i < context.Request.Files.Count; ++i)
                        {
                            HttpPostedFile file = context.Request.Files[i];
                            file.SaveAs(context.Server.MapPath(filePath + file.FileName));
                            lstFile.Add(file);
                        };
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