using APVTranslator_Entity.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using APVTranslator_Entity;
using System.Threading;
using APVTranslator_Common;
using APVTranslators_Entity.Entity;

namespace APVTranslator_Model.Models
{
    public class TranslateModel : TranslatorModel
    {
        public List<TextSegment> GetTextSegment(int projectId, int fileId)
        {
            try
            {
                string qry = "SELECT [Id], [FileId], [ProjectId], [Type], [TextSegment1], [TextSegment2],[Row],[Col],[SheetName],[InsertTime],[Dictionary],[IsSheetName],[SheetIndex],[Suggestion] ='',[GoogleTranslate]='',[ParagraphsOrShapeIndex] FROM [dbo].[TextSegment] (NOLOCK) WHERE [FileId] = @FileId AND [ProjectId] = @ProjectId ORDER BY InsertTime ASC";
                var lstTextSegment = this.Database.SqlQuery<TextSegment>(qry,
                    new SqlParameter("@FileId", fileId),
                    new SqlParameter("@ProjectId", projectId)
                ).ToList();
                return lstTextSegment;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public TranslatorLanguage GetTranslateLanguage(int projectId)
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

                throw;
            }
        }

        public List<ReferenceDB> GetConditionData(int projectId)
        {
            try
            {
                List<ReferenceDB> listReferenceDB = new List<ReferenceDB>();
                string query = "SELECT [ID], [ProjectReferID] FROM [ReferenceDB] WHERE [ID] = @ID";
                listReferenceDB = this.Database.SqlQuery<ReferenceDB>(query, new SqlParameter("@ID", projectId)).ToList();
                return listReferenceDB;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public TextSuggestion GetSuggestion(string textSeggment1, List<Int32> lstProjectId)
        {
            try
            {
                StringBuilder sbPID = new StringBuilder();
                foreach (Int32 item in lstProjectId)
                {
                    if (String.IsNullOrEmpty(sbPID.ToString()))
                    {
                        sbPID.Append("AND ProjectId IN (");
                        sbPID.Append(item);
                    }
                    else
                    {
                        sbPID.Append(",");
                        sbPID.Append(item);
                    }
                }
                if (!String.IsNullOrEmpty(sbPID.ToString()))
                {
                    sbPID.Append(") ");
                }
                textSeggment1 = textSeggment1.Replace("\"", "\"\"");
                string fullTextSearch = "\"" + textSeggment1 + "\"";
                string qry = "select Dictionary,TextSegment1,TextSegment2,(CAST(RANK as DECIMAL)) as MatchPoint into #Table_Contains " +
                                    "from TextSegment (NOLOCK)" +
                                    "INNER JOIN CONTAINSTABLE(TextSegment, TextSegment1,@TextSegmentFTS) " +
                                    "as KEY_TBL on dbo.TextSegment.Id = KEY_TBL.[KEY] " +
                                    "where TextSegment2 != ''" + sbPID.ToString() +

                                    "select Dictionary,TextSegment1, TextSegment2,(CAST(RANK as DECIMAL)) as MatchPoint into #Table_FreeText " +
                                    "from TextSegment (NOLOCK)" +
                                    "INNER JOIN FREETEXTTABLE(TextSegment, TextSegment1,@TextSegmentFTS) " +
                                    "as KEY_TBL on dbo.TextSegment.Id = KEY_TBL.[KEY] " +
                                    "where TextSegment2 != ''" + sbPID.ToString() +

                                    "select Dictionary,TextSegment1, TextSegment2,1000 as MatchPoint into #Table_Match " +
                                    "from TextSegment (NOLOCK)" +
                                    "where TextSegment1 = @TextSegment1 and TextSegment2 != '' " + sbPID.ToString() +

                                    "select* into #Table_Union from ( " +
                                    "select * ,2 as filter " +
                                    "from #Table_Contains " +
                                    "union " +
                                    "select *,3 as filter " +
                                    "from #Table_FreeText " +
                                    "union " +
                                    "select *,1 as filter " +
                                    "from #Table_Match " +
                                    ")  as #Table_Union " +

                                    "select Dictionary,TextSegment1,TextSegment2,MatchPoint,filter from( " +
                                    "select * , ROW_NUMBER() OVER(PARTITION BY TextSegment1 ORDER BY filter) as RowNumber " +
                                    "from #Table_Union) as TableLast " +
                                    "where (filter=1 OR RowNumber=1) AND TextSegment1 != ''" +
                                    "ORDER BY Dictionary DESC,filter, MatchPoint DESC ";

                var textSegment = this.Database.SqlQuery<TextSuggestion>(qry,
                    new SqlParameter("@TextSegment1", textSeggment1),
                    new SqlParameter("@TextSegmentFTS", fullTextSearch),
                     new SqlParameter("@InListProjectID", sbPID.ToString())
                ).OrderByDescending(a => a.MatchPoint).FirstOrDefault();
                return textSegment;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public Boolean SaveTextSegment(TranslateMessage translateMessage)
        {
            try
            {
                if (translateMessage.Field == "TextSegment2")
                {
                    const string qry = "UPDATE [dbo].[TextSegment] SET [TextSegment2] = @TextSegment2 WHERE [Id] = @Id AND [TextSegment1] = @TextSegment1";
                    int rowEffect = this.Database.ExecuteSqlCommand(qry,
                        new SqlParameter("@Id", translateMessage.Id),
                        new SqlParameter("@TextSegment1", translateMessage.TextSegment1),
                        new SqlParameter("@TextSegment2", translateMessage.TextSegment2));
                    if (rowEffect > 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return true;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Project GetProject(int projectId)
        {
            try
            {
                var project = Projects.Where<Project>(p => p.Id == projectId).FirstOrDefault();
                return project;
            }
            catch (Exception)
            {

                throw;
            }

        }

        public ProjectFile GetFile(int projectId, int fileId)
        {
            try
            {
                var file = ProjectFiles.Where<ProjectFile>(p => p.FileID == fileId && p.ProjectID == projectId).FirstOrDefault();
                return file;
            }
            catch (Exception)
            {

                throw;
            }

        }
        /// <summary>
        /// insert textsegment to databases
        /// </summary>
        public Boolean BatchInsert(List<TextRead> segments, int fileId, int projectId, int fileType, int typeText)
        {
            bool isSaved = true;
            try
            {
                using (var dbContextTransaction = this.Database.BeginTransaction())
                {
                    try
                    {
                        if (fileType == (int)FileTypes.EXCEL)
                        {
                            foreach (var item in segments)
                            {
                                var newId = Guid.NewGuid().ToString();
                                const string qry = "INSERT INTO [dbo].[TextSegment] ([Id], [FileId], [ProjectId], [Type], [TextSegment1], [TextSegment2],[InsertTime],[Row],[Col],[SheetName],[IsSheetName],[SheetIndex]) VALUES (@Id, @FileId, @ProjectId, @Type, @TextSegment1, @TextSegment2,@InsertTime,@Row,@Col,@SheetName,@IsSheetName,@SheetIndex)";
                                this.Database.ExecuteSqlCommand(qry,
                                                                new SqlParameter("@Id", newId),
                                                                new SqlParameter("@FileId", fileId),
                                                                new SqlParameter("@ProjectId", projectId),
                                                                new SqlParameter("@Type", typeText),
                                                                new SqlParameter("@TextSegment1", item.Value),
                                                                new SqlParameter("@TextSegment2", string.Empty),
                                                                new SqlParameter("@InsertTime", DateTime.Now),
                                                                new SqlParameter("@Row", item.Row),
                                                                new SqlParameter("@Col", item.Col),
                                                                new SqlParameter("@SheetName", item.SheetName),
                                                                new SqlParameter("@IsSheetName", item.IsSheetName),
                                                                new SqlParameter("@SheetIndex", item.SheetIndex));
                                Thread.Sleep(1);
                            }
                            this.SaveChanges();
                            dbContextTransaction.Commit();
                        }
                        else
                        {
                            foreach (var item in segments)
                            {
                                var newId = Guid.NewGuid().ToString();
                                const string qry = "INSERT INTO [dbo].[TextSegment] ([Id], [FileId], [ProjectId], [Type], [TextSegment1], [TextSegment2],[InsertTime],[ParagraphsOrShapeIndex]) VALUES (@Id, @FileId, @ProjectId, @Type, @TextSegment1, @TextSegment2,@InsertTime,@ParagraphsOrShapeIndex)";
                                this.Database.ExecuteSqlCommand(qry,
                                                                new SqlParameter("@Id", newId),
                                                                new SqlParameter("@FileId", fileId),
                                                                new SqlParameter("@ProjectId", projectId),
                                                                new SqlParameter("@Type", typeText),
                                                                new SqlParameter("@TextSegment1", item.Value),
                                                                new SqlParameter("@TextSegment2", string.Empty),
                                                                new SqlParameter("@InsertTime", DateTime.Now),
                                                                new SqlParameter("@ParagraphsOrShapeIndex", item.ParagraphsOrShapeIndex));
                                Thread.Sleep(1);
                            }
                            this.SaveChanges();
                            dbContextTransaction.Commit();
                        }
                    }
                    catch (Exception ex)
                    {
                        isSaved = false;
                        dbContextTransaction.Rollback();
                        throw;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return isSaved;
        }

        public void UpdateStatusFileTranslate(int projectId, int fileId, bool status)
        {
            try
            {
                this.Database.ExecuteSqlCommand("Proc_UpdateStatusFileTranslate @projectID,@fileID,@status",
                                                                                new SqlParameter("@projectID", projectId),
                                                                                new SqlParameter("@fileID", fileId),
                                                                                new SqlParameter("@status", status));
            }
            catch (Exception)
            {

                throw;
            }
        }
        /// <summary>
        /// get permission user in a project
        /// </summary>
        public bool GetUserPermission(int userId, int projectId)
        {
            try
            {
                return ProjectMembers.Any(a => a.UserID == userId && a.ProjectID == projectId);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
