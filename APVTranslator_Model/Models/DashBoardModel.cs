﻿using APVTranslator_Common;
using APVTranslator_Entity.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Diagnostics;
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
        /// <summary>
        /// Insert file to project
        /// </summary>
        /// <param name="projectId"></param>
        /// <param name="importPath"></param>
        /// <param name="lstFile"></param>
        /// <returns>true/false</returns>
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
        /// <summary>
        /// check user has permission to delete file
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns>true/false</returns>
        public Boolean CheckUserPermissionToDelete(int projectId)
        {
            try
            {
                var roleInProject = this.Database.SqlQuery<Int16>("Proc_CheckUserPermissionToDelete @userId, @projectId",
                                                                                                 new SqlParameter("@userId", SessionUser.GetUserId()),
                                                                                                 new SqlParameter("@projectId", projectId)).FirstOrDefault();
                if (roleInProject == 1)
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public Boolean DeleteFileProject(int projectId, int fileId)
        {
            try
            {
                int rowEffect = this.Database.ExecuteSqlCommand("[dbo].[Proc_DeleteFileProject] @projectId, @fileId",
                                                                                           new SqlParameter("@projectId", projectId),
                                                                                           new SqlParameter("@fileId", fileId));
                if (rowEffect > 0)
                {
                    return true;
                }
                return false;
            }
            catch (Exception)
            {
                throw;
            }
        }


        public virtual List<AspNetUser> Proc_GetListMember()
        {
            //var userIDParameter = userID.HasValue ?
            //new SqlParameter("@userID", userID) :
            //new SqlParameter("@userID", typeof(int));

            //var textSearchParameter = textSearch!=null?
            //    new SqlParameter("@TextSearch", textSearch) :
            //    new SqlParameter("@TextSearch", typeof(string));

            List<AspNetUser> listUsers = this.Database.SqlQuery<AspNetUser>("Proc_SelectAllUsers").ToList();
            return listUsers;
        }

        public virtual bool CreateNewProject(Project newProject, IEnumerable<int> listMember)
        {
            using (System.Data.Entity.DbContextTransaction dbTran = this.Database.BeginTransaction())
            {
                try
                {
                    this.Projects.Add(newProject);
                    this.SaveChanges();
                    int newId = newProject.Id;
                    Debug.WriteLine("PROJECTID=" + newId);
                    foreach (var id in listMember)
                    {
                        Debug.WriteLine("ID=" + id);
                        Debug.WriteLine("pair ==" + id + "/" + newId);
                        var sql = @"INSERT INTO ProjectMembers VALUES({0}, {1}, 0)";
                        this.Database.ExecuteSqlCommand(sql, newId, id);
                    }

                    dbTran.Commit();
                    return true;
                }
                catch (Exception e)
                {
                    dbTran.Rollback();
                    Debug.WriteLine("Error: " + e.Message);
                    return false;
                }
            }


        }
    }
}