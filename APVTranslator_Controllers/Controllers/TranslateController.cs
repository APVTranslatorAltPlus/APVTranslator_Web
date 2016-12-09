using APVTranslator_Common;
using APVTranslator_Common.Helpers;
using APVTranslator_Entity;
using APVTranslator_Entity.Models;
using APVTranslator_Model.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace APVTranslator_Controllers.Controllers
{
    public class TranslateController : Controller
    {
        //public ActionResult Index()
        //{
        //    return View();
        //}

        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                ViewBag.ProjectId = Request.QueryString["projectId"];
                ViewBag.FileId = Request.QueryString["fileId"];
                ViewBag.UserId = SessionUser.GetUserId();
                TranslateModel translateModel = new TranslateModel();
                if (ViewBag.ProjectId != null)
                {
                    TranslatorLanguage oTranslatorLanguage = translateModel.GetTranslateLanguage(Convert.ToInt32(ViewBag.ProjectId));
                    if (oTranslatorLanguage != null)
                    {
                        ViewBag.LanguagePair = oTranslatorLanguage.LanguagePair;
                    }
                }
                return View();
            }
            else
            {
                return View("Error");
            }
        }
        [HttpPost]
        public ActionResult GetTextSegment(int projectId, int fileId)
        {
            JsonResult jsonResult = new JsonResult();
            SegmentsResult sResult = new SegmentsResult();
            if (User.Identity.IsAuthenticated && GetUserPermission(SessionUser.GetUserId(), projectId))
            {
                Thread thrGetText = new Thread(new ThreadStart(() =>
                {
                    try
                    {
                        TranslateModel translateModel = new TranslateModel();
                        Project project = translateModel.GetProject(projectId);
                        ProjectFile file = translateModel.GetFile(projectId, fileId);
                        if (project != null && file != null)
                        {
                            sResult.FileName = file.FileName;
                            sResult.ProjectName = project.Title;
                            string importFile = Utility.GetRootPath() + Contanst.rootProject + "\\" + project.Title + "\\Imports\\" + file.FileName;
                            var extFile = Path.GetExtension(importFile);
                            switch (extFile)
                            {
                                case ".xls":
                                case ".xlsx":
                                    sResult.FileType = (int)FileTypes.EXCEL;
                                    if (System.IO.File.Exists(importFile) && file.IsLoadText == true)
                                    {
                                        List<TextSegment> lstPureTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                        List<TextSegment> lstTextSegment = new List<TextSegment>();
                                        foreach (var textSegment in lstPureTextSegment)
                                        {
                                            int iRow = textSegment.Row != null ? Convert.ToInt32(textSegment.Row) : -1;
                                            int iCol = textSegment.Col != null ? Convert.ToInt32(textSegment.Col) : -1;
                                            if (!(lstTextSegment.Any(a => a.TextSegment1 == textSegment.TextSegment1) && iRow != -1 && iCol != -1))                      //&& iRow != -1 && iCol != -1
                                            {
                                                lstTextSegment.Add(textSegment);
                                            }
                                        }

                                        sResult.ControllerResult.Value = lstTextSegment;
                                    }
                                    else if (System.IO.File.Exists(importFile) && file.IsLoadText == false)
                                    {
                                        List<TextRead> segments = new List<TextRead>();
                                        List<TextRead> objects = new List<TextRead>();
                                        using (var excel = new ExcelHelper(importFile, true))
                                        {
                                            segments = excel.GetTextSegment();
                                            objects = excel.GetTextObject();
                                        }
                                        List<TextSegment> lstTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                        List<TextRead> lstTextSegments = new List<TextRead>();
                                        List<TextRead> lstTextObjects = new List<TextRead>();
                                        foreach (var item in segments)
                                        {
                                            if (!lstTextSegment.Any(a => a.Row == item.Row && a.Col == item.Col && a.SheetName == item.SheetName && a.TextSegment1 == item.Value))
                                            {
                                                lstTextSegments.Add(item);
                                            }
                                        }
                                        foreach (var item in objects)
                                        {
                                            if (!lstTextSegment.Any(a => a.Row == item.Row && a.Col == item.Col && a.SheetName == item.SheetName && a.TextSegment1 == item.Value))
                                            {
                                                lstTextObjects.Add(item);
                                            }
                                        }
                                        var insertedTxt = translateModel.BatchInsert(lstTextSegments, fileId, projectId, (int)FileTypes.EXCEL, (int)TextSegmentType.TEXT);
                                        var insertedObj = translateModel.BatchInsert(lstTextObjects, fileId, projectId, (int)FileTypes.EXCEL, (int)TextSegmentType.OBJECT);
                                        translateModel.UpdateStatusFileTranslate(projectId, fileId, true);

                                        List<TextSegment> lstPureTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                        List<TextSegment> lstSegments = new List<TextSegment>();
                                        foreach (var textSegment in lstPureTextSegment)
                                        {
                                            int iRow = textSegment.Row != null ? Convert.ToInt32(textSegment.Row) : -1;
                                            int iCol = textSegment.Col != null ? Convert.ToInt32(textSegment.Col) : -1;
                                            if (!(lstSegments.Any(a => a.TextSegment1 == textSegment.TextSegment1) && iRow != -1 && iCol != -1))                     //&& iRow != -1 && iCol != -1
                                            {
                                                lstSegments.Add(textSegment);
                                            }
                                        }
                                        sResult.ControllerResult.Value = lstSegments;
                                    }
                                    else
                                    {
                                        sResult.ControllerResult.IsSuccess = false;
                                        sResult.ControllerResult.Message = "Physical file don't exist in server!";
                                    }
                                    break;
                                case ".doc":
                                case ".docx":
                                    sResult.FileType = (int)FileTypes.WORD;
                                    if (System.IO.File.Exists(importFile) && file.IsLoadText == true)
                                    {
                                        List<TextSegment> lstTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                        sResult.ControllerResult.Value = lstTextSegment;
                                    }
                                    else if (System.IO.File.Exists(importFile) && file.IsLoadText == false)
                                    {
                                        List<TextRead> segments = new List<TextRead>();
                                        List<TextRead> objects = new List<TextRead>();
                                        using (var word = new WordHelper(importFile, true))
                                        {
                                            segments = word.GetTextSegmentInWord();
                                            objects = word.GetTextObjectInWord();
                                        }
                                        List<TextSegment> lstTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                        List<TextRead> lstTextSegments = new List<TextRead>();
                                        List<TextRead> lstTextObjects = new List<TextRead>();
                                        foreach (var item in segments)
                                        {
                                            if (!lstTextSegment.Any(a => a.TextSegment1 == item.Value && a.ParagraphsOrShapeIndex == item.ParagraphsOrShapeIndex))
                                            {
                                                lstTextSegments.Add(item);
                                            }
                                        }
                                        foreach (var item in objects)
                                        {
                                            if (!lstTextSegment.Any(a => a.TextSegment1 == item.Value && a.ParagraphsOrShapeIndex == item.ParagraphsOrShapeIndex))
                                            {
                                                lstTextObjects.Add(item);
                                            }
                                        }
                                        var insertedTxt = translateModel.BatchInsert(lstTextSegments, fileId, projectId, (int)FileTypes.WORD, (int)TextSegmentType.TEXT);
                                        var insertedObj = translateModel.BatchInsert(lstTextObjects, fileId, projectId, (int)FileTypes.WORD, (int)TextSegmentType.OBJECT);

                                        translateModel.UpdateStatusFileTranslate(projectId, fileId, true);
                                        List<TextSegment> lstPureTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                        List<TextSegment> lstSegments = new List<TextSegment>();
                                        foreach (var textSegment in lstPureTextSegment)
                                        {
                                            if (!(lstSegments.Any(a => a.TextSegment1 == textSegment.TextSegment1)))
                                            {
                                                lstSegments.Add(textSegment);
                                            }
                                        }
                                        sResult.ControllerResult.Value = lstSegments;
                                    }
                                    else
                                    {
                                        sResult.ControllerResult.IsSuccess = false;
                                        sResult.ControllerResult.Message = "Physical file don't exist in server!";
                                    }
                                    break;
                                case ".ppt":
                                case ".pptx":
                                    sResult.FileType = (int)FileTypes.POWERPOINT;
                                    if (System.IO.File.Exists(importFile) && file.IsLoadText == true)
                                    {
                                        List<TextSegment> lstTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                        sResult.ControllerResult.Value = lstTextSegment;
                                    }
                                    else if (System.IO.File.Exists(importFile) && file.IsLoadText == false)
                                    {
                                        List<TextRead> textSegments = new List<TextRead>();
                                        using (var powerpoint = new PowerPointHelper(importFile))
                                        {
                                            textSegments = powerpoint.GetTexts();
                                        }
                                        List<TextSegment> lstTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                        List<TextRead> lstTextSegments = new List<TextRead>();
                                        foreach (var item in textSegments)
                                        {
                                            if (!lstTextSegment.Any(a => a.TextSegment1 == item.Value && a.ParagraphsOrShapeIndex == item.ParagraphsOrShapeIndex))
                                            {
                                                lstTextSegments.Add(item);
                                            }
                                        }
                                        var insertedTxt = translateModel.BatchInsert(lstTextSegments, fileId, projectId, (int)FileTypes.WORD, (int)TextSegmentType.OBJECT);

                                        translateModel.UpdateStatusFileTranslate(projectId, fileId, true);
                                        List<TextSegment> lstPureTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                        List<TextSegment> lstSegments = new List<TextSegment>();
                                        foreach (var textSegment in lstPureTextSegment)
                                        {
                                            if (!(lstSegments.Any(a => a.TextSegment1 == textSegment.TextSegment1)))
                                            {
                                                lstSegments.Add(textSegment);
                                            }
                                        }
                                        sResult.ControllerResult.Value = lstSegments;
                                    }
                                    else
                                    {
                                        sResult.ControllerResult.IsSuccess = false;
                                        sResult.ControllerResult.Message = "Physical file don't exist in server!";
                                    }
                                    break;
                                case ".pdf":
                                    //not yet complete
                                    break;
                                default:
                                    break;
                            }
                        }
                        else
                        {
                            sResult.ControllerResult.IsSuccess = false;
                            sResult.ControllerResult.Message = "Project or file don't exist!";
                        }

                    }
                    catch (Exception ex)
                    {
                        sResult.ControllerResult.IsSuccess = false;
                        if (ex.Message == "Exception from HRESULT: 0x800AC472")
                        {
                            sResult.ControllerResult.Message = "Office driver is busying can't call to Interop service or office on server don't actived!";
                        }
                        else
                        {
                            sResult.ControllerResult.Message = ex.Message;
                        }

                    }
                    jsonResult = Json(sResult, JsonRequestBehavior.AllowGet);
                    jsonResult.MaxJsonLength = Int32.MaxValue;
                }));
                thrGetText.Start();
                thrGetText.Join();
            }
            else
            {
                sResult.ControllerResult.IsSuccess = false;
                sResult.ControllerResult.Message = "User don't has permissions!";
            }
            return jsonResult;
        }
        [HttpPost]
        public ActionResult BuildExportFile(int projectId, int fileId)
        {
            ControllerResult cResult = new ControllerResult();
            JsonResult jsonResult = new JsonResult();
            if (User.Identity.IsAuthenticated && GetUserPermission(SessionUser.GetUserId(), projectId))
            {
                Thread thrGetText = new Thread(new ThreadStart(() =>
                {
                    #region "build file export"
                    try
                    {
                        TranslateModel translateModel = new TranslateModel();
                        Project project = translateModel.GetProject(projectId);
                        ProjectFile file = translateModel.GetFile(projectId, fileId);
                        if (project != null && file != null)
                        {
                            string rootPath = Utility.GetRootPath();
                            string importPath = rootPath + Contanst.rootProject + "\\" + project.Title + "\\Imports";
                            string exportPath = rootPath + Contanst.rootProject + "\\" + project.Title + "\\Exports";
                            if (Directory.Exists(exportPath))
                            {
                                Directory.CreateDirectory(exportPath);
                            }
                            string filePath = importPath + "\\" + file.FileName;
                            if (!System.IO.File.Exists(filePath))
                            {
                                throw new Exception("File don't exits!");
                            }
                            exportPath = exportPath + "\\" + file.FileName;
                            var fileExt = Path.GetExtension(file.FileName);
                            if (fileExt == null)
                            {
                                throw new Exception("Extension file error");
                            }
                            string translatedFile = exportPath.Replace(fileExt, $"_Export{fileExt}");
                            string fileNameExport = Path.GetFileName(translatedFile);
                            try
                            {
                                int i = 1;
                                while (System.IO.File.Exists(translatedFile))
                                {
                                    translatedFile = exportPath.Replace(fileExt, $"(" + i + ")_Export" + fileExt);
                                    i++;
                                }
                                System.IO.File.Copy(filePath, translatedFile, true);
                            }
                            catch (Exception)
                            {
                                Random r = new Random();
                                translatedFile = filePath.Replace(fileExt, $"_r" + r.Next(100, 999) + "_vn" + fileExt);
                                fileNameExport = Path.GetFileName(translatedFile);
                                System.IO.File.Copy(filePath, translatedFile, true);
                            }
                            switch (fileExt)
                            {
                                case ".xls":
                                case ".xlsx":
                                    using (var excel = new ExcelHelper(translatedFile, false))
                                    {
                                        try
                                        {
                                            List<TextSegment> lstTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                            List<TextSegment> lstTextSegmentNoExists = new List<TextSegment>();
                                            foreach (var item in lstTextSegment)
                                            {
                                                var textSegment = lstTextSegment.Where(a => !String.IsNullOrEmpty(a.TextSegment2) && a.TextSegment1 == item.TextSegment1 && String.IsNullOrEmpty(item.TextSegment2)).FirstOrDefault();
                                                if (textSegment != null)
                                                {
                                                    lstTextSegmentNoExists.Add(new TextSegment() { TextSegment1 = item.TextSegment1, TextSegment2 = textSegment.TextSegment2, Type = item.Type, Row = item.Row, Col = item.Col, SheetName = item.SheetName, IsSheetName = item.IsSheetName, SheetIndex = item.SheetIndex });
                                                }
                                                else
                                                {
                                                    lstTextSegmentNoExists.Add(new TextSegment() { TextSegment1 = item.TextSegment1, TextSegment2 = item.TextSegment2, Type = item.Type, Row = item.Row, Col = item.Col, SheetName = item.SheetName, IsSheetName = item.IsSheetName, SheetIndex = item.SheetIndex });
                                                }
                                            }
                                            lstTextSegmentNoExists = lstTextSegmentNoExists.OrderByDescending(x => x.TextSegment1.Length).ToList();
                                            int count = lstTextSegmentNoExists.Count == 0 ? 1 : lstTextSegmentNoExists.Count;
                                            foreach (TextSegment itTextSegment in lstTextSegmentNoExists)
                                            {
                                                if (!string.IsNullOrEmpty(itTextSegment.TextSegment2))
                                                {
                                                    if ((TextSegmentType)itTextSegment.Type == TextSegmentType.TEXT)
                                                    {
                                                        excel.ReplaceText(itTextSegment.TextSegment1, itTextSegment.TextSegment2, Convert.ToInt32(itTextSegment.Row), Convert.ToInt32(itTextSegment.Col), itTextSegment.SheetName, Convert.ToBoolean(itTextSegment.IsSheetName), Convert.ToInt32(itTextSegment.SheetIndex)); // Replace all text segment in words
                                                    }
                                                    else
                                                    {
                                                        excel.ReplaceObject(itTextSegment.TextSegment1, itTextSegment.TextSegment2);
                                                    }
                                                }
                                            }
                                            excel.Save();
                                        }
                                        catch (Exception ex)
                                        {
                                            throw ex;
                                        }
                                    }
                                    break;
                                case ".doc":
                                case ".docx":
                                    using (var word = new WordHelper(translatedFile))
                                    {
                                        List<TextSegment> lstTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                        List<TextSegment> lstTextSegmentNoExists = new List<TextSegment>();
                                        foreach (var item in lstTextSegment)
                                        {
                                            var textSegment = lstTextSegment.Where(a => !String.IsNullOrEmpty(a.TextSegment2) && a.TextSegment1 == item.TextSegment1 && String.IsNullOrEmpty(item.TextSegment2)).FirstOrDefault();
                                            if (textSegment != null)
                                            {
                                                lstTextSegmentNoExists.Add(new TextSegment() { TextSegment1 = item.TextSegment1, TextSegment2 = textSegment.TextSegment2, Type = item.Type, Row = item.Row, Col = item.Col, SheetName = item.SheetName, IsSheetName = item.IsSheetName, SheetIndex = item.SheetIndex, ParagraphsOrShapeIndex = item.ParagraphsOrShapeIndex });
                                            }
                                            else
                                            {
                                                lstTextSegmentNoExists.Add(new TextSegment() { TextSegment1 = item.TextSegment1, TextSegment2 = item.TextSegment2, Type = item.Type, Row = item.Row, Col = item.Col, SheetName = item.SheetName, IsSheetName = item.IsSheetName, SheetIndex = item.SheetIndex, ParagraphsOrShapeIndex = item.ParagraphsOrShapeIndex });
                                            }
                                        }
                                        lstTextSegmentNoExists = lstTextSegmentNoExists.OrderByDescending(x => x.TextSegment1.Length).ToList();
                                        int count = lstTextSegmentNoExists.Count == 0 ? 1 : lstTextSegmentNoExists.Count;
                                        foreach (TextSegment itTextSegment in lstTextSegmentNoExists)
                                        {
                                            if (!string.IsNullOrEmpty(itTextSegment.TextSegment2))
                                            {
                                                if ((TextSegmentType)itTextSegment.Type == TextSegmentType.TEXT)
                                                {
                                                    word.ReplaceText(itTextSegment.TextSegment1, itTextSegment.TextSegment2, itTextSegment.ParagraphsOrShapeIndex); // Replace all text segment in words
                                                }
                                                else
                                                {
                                                    word.ReplaceObject(itTextSegment.TextSegment1, itTextSegment.TextSegment2, itTextSegment.ParagraphsOrShapeIndex);
                                                }
                                            }
                                        }
                                        word.Save();
                                    }
                                    break;
                                case ".ppt":
                                case ".pptx":
                                    using (var powerpoint = new PowerPointHelper(translatedFile, false))
                                    {
                                        List<TextSegment> lstTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                        lstTextSegment = lstTextSegment.OrderByDescending(x => x.TextSegment1.Length).ToList();
                                        int count = lstTextSegment.Count == 0 ? 1 : lstTextSegment.Count;
                                        foreach (TextSegment itTextSegment in lstTextSegment)
                                        {
                                            if (!string.IsNullOrEmpty(itTextSegment.TextSegment2))
                                            {
                                                powerpoint.ReplaceObject(itTextSegment.TextSegment1, itTextSegment.TextSegment2, itTextSegment.ParagraphsOrShapeIndex);
                                            }
                                        }
                                        powerpoint.Save();
                                    }
                                    break;
                                case ".pdf":

                                    break;
                                default:
                                    break;
                            }
                            cResult.IsSuccess = true;
                            cResult.Value = Path.GetFileName(translatedFile);
                        }
                        else
                        {
                            cResult.IsSuccess = false;
                            cResult.Message = "Project or file had deleted or don't exits!";
                        }
                    }
                    catch (Exception ex)
                    {
                        cResult.IsSuccess = false;
                        cResult.Message = "Build export file error!";
                    }
                    #endregion
                }));
                thrGetText.Start();
                thrGetText.Join();
            }
            else
            {
                cResult.IsSuccess = false;
                cResult.Message = "User don't has permissions!";
            }
            return Json(cResult);
        }

        private bool GetUserPermission(int userId, int projectId)
        {
            try
            {
                TranslateModel translateModel = new TranslateModel();
                ApplicationDbContext appDb = new ApplicationDbContext();
                List<Role> lstUserRoles = appDb.GetUserRoleId(SessionUser.GetUserId());
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
    }
}
