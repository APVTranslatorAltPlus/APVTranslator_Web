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
using System.Diagnostics;
using Newtonsoft.Json.Linq;

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

        public virtual List<ListProjectFileViewModel> Proc_GetListFileProject(object projectId)
        {
            var userIDParameter = new SqlParameter("@projectId", projectId);
            List<ListProjectFileViewModel> listProjects = this.Database.SqlQuery<ListProjectFileViewModel>("Proc_GetListPorjectFileViewModel @projectId", userIDParameter).ToList();
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
                        string sTargetLang = "vi";
                        TranslatorLanguage oTranslatorLanguage = GetTranslateLanguage(projectId);
                        if (oTranslatorLanguage != null && !String.IsNullOrEmpty(oTranslatorLanguage.LanguagePair))
                        {
                            var arrLang = oTranslatorLanguage.LanguagePair.Split('|');
                            if (arrLang.Length == 2 && !String.IsNullOrEmpty(arrLang[1]))
                            {
                                sTargetLang = arrLang[1];
                            }
                        }
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
                            this.Database.ExecuteSqlCommand("Proc_InsertFileToProject @projectId, @FileName, @FilePath, @FileType, @IsLoadText ,@LastUpdate,@TargetLang",
                                                                                          new SqlParameter("@projectId", projectId),
                                                                                          new SqlParameter("@FileName", file.FileName),
                                                                                          new SqlParameter("@FilePath", importPath),
                                                                                          new SqlParameter("@FileType", fileType),
                                                                                          new SqlParameter("@IsLoadText", false),
                                                                                          new SqlParameter("@LastUpdate", DateTime.Now),
                                                                                          new SqlParameter("@TargetLang", sTargetLang));
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

        private TranslatorLanguage GetTranslateLanguage(int projectId)
        {
            try
            {
                if (projectId == default(int))
                {
                    return null;
                }
                else
                {
                    var translateLang = Projects
                                    .Where(p => p.Id == projectId)
                                    .Join(TranslatorLanguages, p => p.TranslateLanguageID, tl => tl.TranslatorLanguageID, (tl, p) => p)
                                    .Select(tl => new { tl.TranslatorLanguageID, tl.LanguageDescription, tl.LanguagePair })
                                    .FirstOrDefault();
                    if (translateLang != null)
                    {
                        return new TranslatorLanguage() { TranslatorLanguageID = translateLang.TranslatorLanguageID, LanguageDescription = translateLang.LanguageDescription, LanguagePair = translateLang.LanguagePair };
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch (Exception)
            {
                return null;
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
                    int? newId = newProject.Id;
                    foreach (var id in listMember)
                    {
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

        public virtual Project GetProjectInfo(int projectId)
        {
            return this.Projects.Find(projectId);
        }

        public virtual List<AspNetUser> GetListProjectMember(int projectId)
        {
            //var L2EQuery = from p in this.ProjectMembers
            //               join 
            //               u in this.AspNetUsers
            //               on p.UserID equals u.Id
            //               where p.ProjectID == projectId 
            //               select u;

            //List<AspNetUser> listMember = L2EQuery.ToList();
            ////foreach (var u in listMember)
            ////{
            ////    Debug.WriteLine("USEr"+u.ToString());

            ////}
            //Debug.WriteLine("USEr" + listMember[0].ToString());
            //Debug.WriteLine(listMember);
            //return listMember;
            var projectIdParameter = new SqlParameter("@Id", projectId);
            List<AspNetUser> listUsers = this.Database.SqlQuery<AspNetUser>("Proc_GetListProjectMember @Id", projectIdParameter).ToList();

            return listUsers;
        }

        public bool UpdateProject(Project project, IEnumerable<int> newlyInsertedIDList, IEnumerable<int> deletedIDList)
        {
            using (System.Data.Entity.DbContextTransaction dbTran = this.Database.BeginTransaction())
            {
                try
                {
                    foreach (var memberId in newlyInsertedIDList)
                    {
                        var sql = @"INSERT INTO ProjectMembers VALUES({0}, {1}, 0)";
                        this.Database.ExecuteSqlCommand(sql, project.Id, memberId);
                    }


                    foreach (var memberId in deletedIDList)
                    {
                        var sql = @"DELETE FROM ProjectMembers WHERE  ProjectMembers.ProjectID = {0} AND ProjectMembers.UserID = {1}";
                        this.Database.ExecuteSqlCommand(sql, project.Id, memberId);
                    }

                    this.Entry(project).State = System.Data.Entity.EntityState.Modified;
                    this.SaveChanges();

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

        public bool DeleteProject(int projectId)
        {
            using (System.Data.Entity.DbContextTransaction dbTran = this.Database.BeginTransaction())
            {
                try
                {

                    //Delete all files of this project from DB
                    var sql = @"DELETE FROM ProjectFiles WHERE  ProjectFiles.ProjectID = {0} ";
                    this.Database.ExecuteSqlCommand(sql, projectId);

                    //Delete all members of this project from DB
                    var sql2 = @"DELETE FROM ProjectMembers WHERE ProjectID = {0} ";
                    this.Database.ExecuteSqlCommand(sql2, projectId);

                    //Delete this project
                    var sql3 = @"DELETE FROM Projects WHERE Id = {0} ";
                    this.Database.ExecuteSqlCommand(sql3, projectId);

                    this.SaveChanges();

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

        public virtual List<Project> Proc_GetListProjectDBReference(int projectId)
        {
            var projectIdParameter = new SqlParameter("@Id", projectId);
            List<Project> listProjects = this.Database.SqlQuery<Project>("Proc_GetListProjectDBReference @Id", projectIdParameter).ToList();

            return listProjects;
        }

        public bool SaveChangeProjectSetting(object updateProject, IEnumerable<int> newlyInsertedIDList, IEnumerable<int> deletedIDList)
        {
            using (System.Data.Entity.DbContextTransaction dbTran = this.Database.BeginTransaction())
            {
                try
                {

                    dynamic stuff = JObject.Parse(updateProject.ToString());

                    int Id = stuff.Id;
                    int UseCompanyDB = stuff.UseCompanyDB;
                    int TranslateLanguageID = stuff.TranslateLanguage;
                    foreach (var referId in newlyInsertedIDList)
                    {
                        var sql = @"INSERT INTO ReferenceDB VALUES({0}, {1})";
                        this.Database.ExecuteSqlCommand(sql, Id, referId);
                    }


                    foreach (var referId in deletedIDList)
                    {
                        var sql = @"DELETE FROM ReferenceDB WHERE ReferenceDB.ID = {0} AND ReferenceDB.ProjectReferID = {1}";
                        this.Database.ExecuteSqlCommand(sql, Id, referId);
                    }

                    var sql2 = @"UPDATE Projects SET Projects.UseCompanyDB = {0},Projects.TranslateLanguageID = {1} WHERE Projects.Id = {2}";
                    this.Database.ExecuteSqlCommand(sql2, UseCompanyDB, TranslateLanguageID, Id);

                    this.SaveChanges();

                    dbTran.Commit();
                    return true;
                }
                catch (Exception e)
                {
                    dbTran.Rollback();
                    Debug.WriteLine("Error2: " + e.Message);
                    return false;
                }
            }
        }

        public virtual List<MemberSettingViewModel> Proc_GetInfoForMemberSetting(int projectId)
        {

            var projectIdParameter = new SqlParameter("@Id", projectId);
            List<MemberSettingViewModel> listUsers = this.Database.SqlQuery<MemberSettingViewModel>("Proc_GetInfoForMemberSetting @Id", projectIdParameter).ToList();

            return listUsers;
        }

        public virtual bool SaveChangeMemberSetting(int projectId, string modifiedIsAMemberList, string modifiedNotAMemberList)
        {
            using (System.Data.Entity.DbContextTransaction dbTran = this.Database.BeginTransaction())
            {
                try
                {

                    //Save changes to user who was already a member of project
                    List<MemberSettingViewModel> isAMemberViewList = new List<MemberSettingViewModel>();

                    JArray a = JArray.Parse(modifiedIsAMemberList);

                    foreach (JObject o in a.Children<JObject>())
                    {
                        var memberView = new MemberSettingViewModel();
                        dynamic stuff = JObject.Parse(o.ToString());
                        memberView.UserID = stuff.UserID;
                        memberView.UserName = stuff.UserName;
                        memberView.ProjectRole = stuff.ProjectRole;
                        memberView.isAMember = stuff.isAMember;
                        isAMemberViewList.Add(memberView);
                    }

                    foreach (var memberView in isAMemberViewList)
                    {
                        //If member is removed from project then delete from database
                        if (memberView.isAMember == 0)
                        {
                            var sql = @"DELETE FROM ProjectMembers WHERE ProjectID = {0} AND UserID = {1}";
                            this.Database.ExecuteSqlCommand(sql, projectId, memberView.UserID);
                        }
                        //If member is modified but remains in project then update database
                        else
                        {
                            var sql2 = @"UPDATE ProjectMembers SET ProjectRole = {0} WHERE ProjectID = {1} AND UserID = {2}";
                            this.Database.ExecuteSqlCommand(sql2, memberView.ProjectRole, projectId, memberView.UserID);
                        }
                    }

                    // Save changes to user who was not a member of project
                    List<MemberSettingViewModel> notAMemberViewList = new List<MemberSettingViewModel>();

                    JArray b = JArray.Parse(modifiedNotAMemberList);

                    foreach (JObject o in b.Children<JObject>())
                    {
                        var memberView = new MemberSettingViewModel();
                        dynamic stuff = JObject.Parse(o.ToString());
                        memberView.UserID = stuff.UserID;
                        memberView.UserName = stuff.UserName;
                        memberView.ProjectRole = stuff.ProjectRole;
                        memberView.isAMember = stuff.isAMember;
                        notAMemberViewList.Add(memberView);
                    }

                    foreach (var memberView in notAMemberViewList)
                    {
                        //If member is added to project then insert to database
                        if (memberView.isAMember == 1)
                        {
                            var sql3 = @"INSERT INTO ProjectMembers VALUES({0}, {1},{2})";
                            this.Database.ExecuteSqlCommand(sql3, projectId, memberView.UserID, memberView.ProjectRole);
                        }
                    }

                    this.SaveChanges();

                    dbTran.Commit();
                    return true;
                }
                catch (Exception e)
                {
                    dbTran.Rollback();
                    Debug.WriteLine("Error2: " + e.Message);
                    return false;
                }
            }


        }
        public virtual List<SearchViewModel> Proc_GetTextSearch(string textSearch)
        {

            var textSearchParameter = new SqlParameter("@sTextSearch", textSearch);
            List<SearchViewModel> textSearchResult = this.Database.SqlQuery<SearchViewModel>("Proc_GetTextSearch @sTextSearch", textSearchParameter).ToList();
            return textSearchResult;
        }

        public virtual List<Dictionary> GetListDictionary(int projectId)
        {
            var projectIdParameter = new SqlParameter("@Id", projectId);
            List<Dictionary> listDictionaries = new List<Dictionary>();
            listDictionaries = this.Dictionaries.Where(d => d.ProjectID == projectId).Select(d => new Dictionary()).ToList();
            return listDictionaries;
        }
    }
}