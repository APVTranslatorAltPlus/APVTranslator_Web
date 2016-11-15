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
            SegmentsResult sResult = new SegmentsResult();
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    TranslateModel translateModel = new TranslateModel();
                    Project project = translateModel.GetProject(projectId);
                    ProjectFile file = translateModel.GetFile(fileId);
                    if (project != null && file != null)
                    {
                        string importFile = Utility.GetRootPath() + Contanst.rootProject + "\\" + project.Title + "\\Imports\\" + file.FileName;
                        var extFile = Path.GetExtension(importFile);
                        switch (extFile)
                        {
                            case ".xls":
                            case ".xlsx":
                                sResult.FileType = (int)FileTypes.EXCEL;
                                if (file.IsLoadText == true)
                                {
                                    List<TextSegment> lstTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                    sResult.ControllerResult.Value = lstTextSegment;
                                }
                                else if (System.IO.File.Exists(importFile))
                                {
                                    using (var excel = new ExcelHelper(importFile, true))
                                    {
                                        List<TextSegment> lstTextSegment = translateModel.GetTextSegment(fileId, projectId);
                                        var segments = excel.GetTextSegment();
                                        var objects = excel.GetTextObject();
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
                                    }
                                    translateModel.UpdateStatusFileTranslate(projectId, fileId, true);
                                    List<TextSegment> lstSegments = translateModel.GetTextSegment(projectId, fileId);
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
                                if (file.IsLoadText == true)
                                {
                                    List<TextSegment> lstTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                    sResult.ControllerResult.Value = lstTextSegment;
                                }
                                else if (System.IO.File.Exists(importFile))
                                {
                                    using (var word = new WordHelper(importFile, true))
                                    {
                                        List<TextSegment> lstTextSegment = translateModel.GetTextSegment(fileId, projectId); ;
                                        var segments = word.GetTextSegmentInWord();
                                        var objects = word.GetTextObjectInWord();
                                        List<TextRead> lstTextSegments = new List<TextRead>();
                                        List<TextRead> lstTextObjects = new List<TextRead>();
                                        foreach (var item in segments)
                                        {
                                            if (!lstTextSegment.Any(a => a.TextSegment1 == item.Value))
                                            {
                                                lstTextSegments.Add(item);
                                            }
                                        }
                                        foreach (var item in objects)
                                        {
                                            if (!lstTextSegment.Any(a => a.TextSegment1 == item.Value))
                                            {
                                                lstTextObjects.Add(item);
                                            }
                                        }
                                        var insertedTxt = translateModel.BatchInsert(lstTextSegments, fileId, projectId, (int)FileTypes.WORD, (int)TextSegmentType.TEXT);
                                        var insertedObj = translateModel.BatchInsert(lstTextObjects, fileId, projectId, (int)FileTypes.WORD, (int)TextSegmentType.OBJECT);

                                    }
                                    translateModel.UpdateStatusFileTranslate(projectId, fileId, true);
                                    List<TextSegment> lstSegments = translateModel.GetTextSegment(projectId, fileId);
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
                                if (file.IsLoadText == true)
                                {
                                    List<TextSegment> lstTextSegment = translateModel.GetTextSegment(projectId, fileId);
                                    sResult.ControllerResult.Value = lstTextSegment;
                                }
                                else if (System.IO.File.Exists(importFile))
                                {
                                    using (var powerpoint = new PowerPointHelper(importFile))
                                    {
                                        List<TextSegment> lstTextSegment = translateModel.GetTextSegment(fileId, projectId); ;
                                        var textSegments = powerpoint.GetTexts();
                                        List<TextRead> lstTextSegments = new List<TextRead>();
                                        foreach (var item in textSegments)
                                        {
                                            if (!lstTextSegment.Any(a => a.TextSegment1 == item.Value))
                                            {
                                                lstTextSegments.Add(item);
                                            }
                                        }
                                        var insertedTxt = translateModel.BatchInsert(lstTextSegments, fileId, projectId, (int)FileTypes.WORD, (int)TextSegmentType.OBJECT);
                                    }
                                    translateModel.UpdateStatusFileTranslate(projectId, fileId, true);
                                    List<TextSegment> lstSegments = translateModel.GetTextSegment(projectId, fileId);
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
                else
                {
                    sResult.ControllerResult.IsSuccess = false;
                    sResult.ControllerResult.Message = "User don't has permissions!";
                }
            }
            catch (Exception ex)
            {
                sResult.ControllerResult.IsSuccess = false;
                sResult.ControllerResult.Message = ex.Message;
            }
            return Json(sResult);
        }
    }
}
