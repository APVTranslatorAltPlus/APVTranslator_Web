using APVTranslator_Common;
using APVTranslator_Common.Helpers;
using APVTranslator_Entity.Models;
using APVTranslator_Model.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace APVTranslator_Web.Handler.Class
{
    public class ExportFile
    {
        private int _projectId;
        private int _fileId;

        public string fileName;
        public string filePath;
        public string translatedFile;

        public ExportFile(int projectId, int fileId)
        {
            this._projectId = projectId;
            this._fileId = fileId;
        }

        public Boolean BuildExportFile()
        {
            try
            {
                TranslateModel translateModel = new TranslateModel();
                Project project = translateModel.GetProject(_projectId);
                ProjectFile file = translateModel.GetFile(_fileId);
                if (project != null && file != null)
                {
                    this.fileName = file.FileName;
                    string rootPath = Utility.GetRootPath();
                    string importPath = rootPath + Contanst.rootProject + "\\" + project.Title + "\\Imports";
                    string exportPath = rootPath + Contanst.rootProject + "\\" + project.Title + "\\Exports";
                    if (Directory.Exists(exportPath))
                    {
                        Directory.CreateDirectory(exportPath);
                    }
                    this.filePath = importPath + "\\" + file.FileName;
                    if (!File.Exists(this.filePath))
                    {
                        throw new Exception("File don't exits!");
                    }
                    exportPath = exportPath + "\\" + file.FileName;
                    var fileExt = Path.GetExtension(file.FileName);
                    if (fileExt == null)
                    {
                        throw new Exception("Extension file error");
                    }
                    this.translatedFile = exportPath.Replace(fileExt, $"_Export{fileExt}");
                    string fileNameExport = Path.GetFileName(translatedFile);
                    try
                    {
                        File.Copy(filePath, translatedFile, true);
                    }
                    catch (Exception)
                    {
                        Random r = new Random();
                        translatedFile = filePath.Replace(fileExt, $"_r" + r.Next(100, 999) + "_vn" + fileExt);
                        fileNameExport = Path.GetFileName(translatedFile);
                        File.Copy(filePath, translatedFile, true);
                    }
                    switch (fileExt)
                    {
                        case ".xls":
                        case ".xlsx":
                            using (var excel = new ExcelHelper(translatedFile, false))
                            {
                                try
                                {
                                    List<TextSegment> lstTextSegment = translateModel.GetTextSegment(this._projectId, this._fileId);
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
                                        //try
                                        //{
                                        //    loading.UpdateProcessStatus(i * 100 / count);
                                        //}
                                        //catch (Exception)
                                        //{
                                        //    continue;
                                        //}
                                        //finally
                                        //{
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
                                List<TextSegment> lstTextSegment = translateModel.GetTextSegment(this._projectId, this._fileId);
                                lstTextSegment = lstTextSegment.OrderByDescending(x => x.TextSegment1.Length).ToList();
                                int count = lstTextSegment.Count == 0 ? 1 : lstTextSegment.Count;
                                foreach (TextSegment itTextSegment in lstTextSegment)
                                {
                                    //try
                                    //{
                                    //    loading.UpdateProcessStatus(i * 100 / count);
                                    //}
                                    //catch (Exception)
                                    //{
                                    //    continue;
                                    //}
                                    //finally
                                    //{
                                    if (!string.IsNullOrEmpty(itTextSegment.TextSegment2))
                                    {
                                        if ((TextSegmentType)itTextSegment.Type == TextSegmentType.TEXT)
                                        {
                                            word.ReplaceText(itTextSegment.TextSegment1, itTextSegment.TextSegment2); // Replace all text segment in words
                                        }
                                        else
                                        {
                                            word.ReplaceObject(itTextSegment.TextSegment1, itTextSegment.TextSegment2);
                                        }
                                    }
                                    //}
                                }
                                word.Save();
                            }
                            break;
                        case ".ppt":
                        case ".pptx":
                            using (var powerpoint = new PowerPointHelper(translatedFile))
                            {
                                List<TextSegment> lstTextSegment = translateModel.GetTextSegment(this._projectId, this._fileId);
                                lstTextSegment = lstTextSegment.OrderByDescending(x => x.TextSegment1.Length).ToList();
                                int count = lstTextSegment.Count == 0 ? 1 : lstTextSegment.Count;
                                foreach (TextSegment itTextSegment in lstTextSegment)
                                {
                                    //try
                                    //{
                                    //    loading.UpdateProcessStatus(i * 100 / count);
                                    //}
                                    //catch (Exception)
                                    //{
                                    //    continue;
                                    //}
                                    //finally
                                    //{
                                    if (!string.IsNullOrEmpty(itTextSegment.TextSegment2))
                                    {
                                        powerpoint.ReplaceObject(itTextSegment.TextSegment1, itTextSegment.TextSegment2);
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
                    return true;
                }
                else
                {
                    return false;
                }

            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}