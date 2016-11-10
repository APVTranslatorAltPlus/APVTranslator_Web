using APVTranslator_Common;
using APVTranslator_Entity.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace APVTranslator_Model.Models
{
    public class DashBoardModel : TranslatorModel
    {
        /// <summary>
        /// Get List Project
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public virtual List<Project> Proc_GetListProject(Nullable<int> userID)
        {
            var userIDParameter = userID.HasValue ?
            new SqlParameter("@userID", userID) :
            new SqlParameter("@userID", typeof(int));
            List<Project> listProjects = this.Database.SqlQuery<Project>("Proc_GetListProject @userID", userIDParameter).ToList();
            return listProjects;
        }

        public virtual List<ProjectFile> Proc_GetListFileProject(object projectId)
        {
            var userIDParameter = new SqlParameter("@projectId", projectId);
            List<ProjectFile> listProjects = this.Database.SqlQuery<ProjectFile>("Proc_GetListProjectFile @projectId", userIDParameter).ToList();
            return listProjects;
        }

        public virtual Boolean InsertProjectFile(int projectId, string importPath, List<HttpPostedFile> lstFile)
        {
            try
            {
                bool bSuccess = true;
                using (var dbContextTransaction = this.Database.BeginTransaction())
                {
                    try
                    {
                        foreach (var file in lstFile)
                        {
                            int fileType = 1;//default excel
                            var ext = Path.GetExtension(file.FileName);
                            switch (ext)
                            {
                                case ".xls":
                                case ".xlsx":
                                    fileType = (int)FileTypes.EXCEL;
                                    break;
                                case ".doc":
                                case ".docx":
                                    fileType = (int)FileTypes.WORD;
                                    break;
                                case ".ppt":
                                case ".pptx":
                                    fileType = (int)FileTypes.POWERPOINT;
                                    break;
                                case ".pdf":
                                    fileType = (int)FileTypes.PDF;
                                    break;
                            }
                            this.Database.ExecuteSqlCommand("Proc_InsertFileToProject @projectId, @FileName, @FilePath, @FileType, @IsLoadText ,@LastUpdate",
                                                                                          new SqlParameter("@projectId", projectId),
                                                                                          new SqlParameter("@FileName", file.FileName),
                                                                                          new SqlParameter("@FilePath", importPath),
                                                                                          new SqlParameter("@FileType", fileType),
                                                                                          new SqlParameter("@IsLoadText", false),
                                                                                          new SqlParameter("@LastUpdate", DateTime.Now));
                        }
                        this.SaveChanges();
                        dbContextTransaction.Commit();
                    }
                    catch (Exception ex)
                    {
                        bSuccess = false;
                        dbContextTransaction.Rollback();
                    }
                }
                return bSuccess;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
