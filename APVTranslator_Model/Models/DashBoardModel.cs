using APVTranslator_Entity.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public virtual List<AspNetUser> Proc_GetListMember()
        {
            //var userIDParameter = userID.HasValue ?
            //new SqlParameter("@userID", userID) :
            //new SqlParameter("@userID", typeof(int));

            //var textSearchParameter = textSearch!=null?
            //    new SqlParameter("@TextSearch", textSearch) :
            //    new SqlParameter("@TextSearch", typeof(string));

            List <AspNetUser> listUsers = this.Database.SqlQuery<AspNetUser>("Proc_SelectAllUsers").ToList();
            return listUsers;
        }
    }
}
