using APVTranslator_Common;
using APVTranslator_Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Excel = Microsoft.Office.Interop.Excel;

namespace APVTranslator_Common.Helpers
{
    public class ExcelHelper : IDisposable
    {
        // Internal members
        private Excel.Application _application;
        private Excel.Workbook _workbook;
        private Excel.Workbooks _workbooks;
        private Excel.Sheets _sheets;
        private Boolean _ReadOnly;
        public static string FilePath { get; set; }

        public ExcelHelper()
        {
            try
            {
                OpenWorkbook();
            }
            catch (Exception ex)
            {
                this.Dispose();
                throw ex;
            }

        }

        public ExcelHelper(string path, Boolean readOnLy = true)
        {
            try
            {
                FilePath = path;
                this._ReadOnly = readOnLy;
                OpenWorkbook();
            }
            catch (Exception ex)
            {
                this.Dispose();
                throw ex;
            }
        }

        private void OpenWorkbook()
        {
            _application = new Excel.Application()
            {
                DisplayAlerts = false
            };
            _workbooks = _application.Workbooks;
            _workbook = _workbooks.Open(FilePath,
            Type.Missing, this._ReadOnly, Type.Missing, Type.Missing,
            Type.Missing, Type.Missing, Type.Missing, Type.Missing,
            Type.Missing, Type.Missing, Type.Missing, Type.Missing,
            Type.Missing, Type.Missing); ;//_workbooks.Open(FilePath);

            _application.Application.Interactive = true;
            _application.Application.UserControl = true;
            _application.Visible = false;
        }

        public void ReplaceText(string what, string replacement, int row, int col, string sheetName, bool isSheetName, int sheetIndex)
        {
            try
            {
                _application.EnableEvents = false;
                _application.ScreenUpdating = false;
                _application.Calculation = Excel.XlCalculation.xlCalculationManual;
                foreach (Excel.Worksheet worksheet in _workbook.Worksheets)
                {
                    int sIndex = worksheet.Index;
                    if (sIndex == sheetIndex)
                    {
                        if (isSheetName && !String.IsNullOrEmpty(replacement) && !Regex.IsMatch(replacement, "[\\[\\]*?]"))
                        {
                            if (replacement.Length > 31)
                            {
                                replacement = replacement.Substring(0, 31);
                            }
                            worksheet.Name = replacement;
                        }
                        else
                        {
                            Excel.Range xlRange = worksheet.UsedRange;
                            if (row > 0 && col > 0 && !string.IsNullOrEmpty(replacement))
                            {
                                string formulaCell = ((object[,])xlRange.Formula)[row, col].ToString();
                                try
                                {
                                    formulaCell = formulaCell.Replace(what, replacement);
                                    ((Excel.Range)xlRange.Cells[row, col]).Formula = formulaCell;
                                }
                                catch (Exception ex)
                                {
                                    ((Excel.Range)xlRange.Cells[row, col]).Formula = " " + formulaCell;
                                    //trường hợp formula sửa thành hàm lỗi cho thêm dấu cách trước đầu
                                    continue;
                                }

                            }
                        }
                    }
                    Marshal.ReleaseComObject(worksheet);
                }
                _application.EnableEvents = true;
                _application.ScreenUpdating = true;
                _application.Calculation = Excel.XlCalculation.xlCalculationAutomatic;
                _application.CalculateFull();
            }
            catch (Exception ex)
            {
                this.Dispose();
                throw ex;
            }
        }

        public void ReplaceObject(string what, string replacement)
        {
            try
            {
                //_application.EnableEvents = false;
                //_application.ScreenUpdating = false;
                //_application.Calculation = Excel.XlCalculation.xlCalculationManual;
                foreach (Excel.Worksheet worksheet in _workbook.Worksheets)
                {
                    foreach (Excel.Shape shp in worksheet.Shapes)
                    {
                        String text;
                        try
                        {
                            text = shp.TextFrame.Characters(Type.Missing, Type.Missing).Text.Trim();
                        }
                        catch (Exception ex)
                        {
                            continue;
                            //throw;
                        }
                        if (text.Trim().Length <= 0) continue;
                        if (text.Contains(what))
                        {
                            String textReplace = text.Replace(what, replacement);
                            shp.TextFrame.Characters(Type.Missing, Type.Missing).Text = textReplace;
                        }
                    }

                    Marshal.ReleaseComObject(worksheet);
                }
                //_application.EnableEvents = true;
                //_application.ScreenUpdating = true;
                //_application.Calculation = Excel.XlCalculation.xlCalculationAutomatic;
                //_application.CalculateFull();
            }
            catch (Exception ex)
            {
                this.Dispose();
                throw ex;
            }
        }

        public IEnumerable<string> GetSheetsName()
        {
            _sheets = _workbook.Worksheets;
            var excelSheets = new string[_sheets.Count];
            var i = 0;
            foreach (Excel.Worksheet wSheet in _sheets)
            {
                excelSheets[i] = wSheet.Name;
                i++;
            }

            return excelSheets;
        }

        public List<TextRead> GetTextObject()
        {
            try
            {
                _sheets = _workbook.Worksheets;
                //var lst = new List<string>();
                List<TextRead> lstTextExcel = new List<TextRead>();
                foreach (Excel.Worksheet worksheet in _sheets)
                {
                    Double checkNumber;
                    DateTime dt = new DateTime();
                    int i = 0;
                    try
                    {
                        foreach (Excel.Shape shp in worksheet.Shapes)
                        {
                            try
                            {
                                var text = shp.TextFrame.Characters(Type.Missing, Type.Missing).Text;
                                if (string.IsNullOrEmpty(text.Trim())) continue;
                                if (DateTime.TryParse(text.ToString(), out dt)) continue;
                                var stringSeparators = new char[] { '。', '.', '\n', '\r', '\a', '\u0001' };
                                //var segment = text.Split(stringSeparators, StringSplitOptions.None);
                                //segment = segment.Where(x => x.Trim().Length > 0).ToArray();
                                bool isURL = Regex.IsMatch(text.Trim(), Contanst.sRegexLink);
                                string[] segment;
                                //List<String> lstResult = new List<string>();
                                if (isURL)
                                {
                                    if (!String.IsNullOrEmpty(text.Trim()))
                                    {
                                        //lstResult.Add(text.Trim());
                                        lstTextExcel.Add(new TextRead() { Row = -1, Col = -1, Value = text.Trim(), SheetName = worksheet.Name });
                                    }
                                }
                                else
                                {
                                    segment = text.Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                                    segment = segment.Where(x => x.Length > 0 && !Double.TryParse(x, out checkNumber)).ToArray();
                                    int k = 0;
                                    foreach (var itsegment in segment)
                                    {
                                        if (!String.IsNullOrEmpty(itsegment.Trim()))
                                        {
                                            //lstResult.Add(segment[k].Trim());
                                            lstTextExcel.Add(new TextRead() { Row = -1, Col = -1, Value = segment[k].Trim(), SheetName = worksheet.Name });
                                        }
                                        k++;
                                    }
                                }
                                i++;
                                //lst.AddRange(lstResult);
                            }
                            catch (Exception ex)
                            {
                                // ignore shape don't contain text
                                continue;
                            }

                        }
                    }
                    catch (Exception ex)
                    {
                        continue;
                    }
                }
                return lstTextExcel;
            }
            catch (Exception ex)
            {
                this.Dispose();
                throw ex;
            }
        }

        public void Save()
        {
            _workbook.Save();
        }

        public List<TextRead> GetTextSegment()
        {
            try
            {
                var fileExt = Path.GetExtension(FilePath);
                Double checkNumber;
                if (fileExt == null ||
                    (string.Compare(fileExt, ".xls", StringComparison.Ordinal) != 0 &&
                     string.Compare(fileExt, ".xlsx", StringComparison.Ordinal) != 0)) return null;
                //var myDataSet = ReadExcel(fileExt);
                _sheets = _workbook.Worksheets;
                List<TextRead> lstTextExcel = new List<TextRead>();
                foreach (Excel.Worksheet worksheet in _sheets)
                {
                    int sheetIndex = worksheet.Index;
                    lstTextExcel.Add(new TextRead() { Row = -1, Col = -1, Value = worksheet.Name, SheetName = worksheet.Name, SheetIndex = sheetIndex, IsSheetName = true });
                    Excel.Range xlRange = worksheet.UsedRange;
                    int rowCount = xlRange.Rows.Count;
                    int colCount = xlRange.Columns.Count;
                    var data = xlRange.Formula;
                    if (data.GetType().Name == "Object[,]")
                    {
                        for (int i = 1; i <= rowCount; i++)
                        {
                            for (int j = 1; j <= colCount; j++)
                            {
                                try
                                {
                                    Double.TryParse(data[i, j], out checkNumber);
                                }
                                catch (Exception ex)
                                {
                                    throw;
                                }
                                if (!String.IsNullOrEmpty(data[i, j]) && !Double.TryParse(data[i, j], out checkNumber))
                                {
                                    string textValue = data[i, j];
                                    var stringSeparators = new char[] { '。', '.', '\n', '\r' };// '\a', '\u0001'
                                                                                               //var segment = cellText.Split(stringSeparators, StringSplitOptions.None);
                                    bool isURL = Uri.IsWellFormedUriString(textValue.Trim(), UriKind.RelativeOrAbsolute);//Regex.IsMatch(textValue.Trim(), Constant.sRegexLink);
                                    string[] segment;
                                    List<String> lstResult = new List<string>();
                                    if (isURL)
                                    {
                                        if (!String.IsNullOrEmpty(textValue.Trim()))
                                        {
                                            lstResult.Add(textValue.Trim());
                                        }
                                    }
                                    else
                                    {
                                        segment = textValue.Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                                        List<String> lstSegment = new List<string>();
                                        foreach (var item in segment)
                                        {
                                            string sValue = item.Trim();
                                            if (!String.IsNullOrEmpty(sValue.Trim()))
                                            {
                                                lstSegment.Add(sValue);
                                            }
                                        }
                                        lstResult = lstSegment.Where(x => x.Length > 0 && !Double.TryParse(x, out checkNumber)).ToList();
                                    }
                                    foreach (var item in lstResult)
                                    {
                                        if (!lstTextExcel.Any(a => a.Value == item && a.Row == i && a.Col == j && a.SheetName == worksheet.Name && a.SheetIndex == sheetIndex))
                                        {
                                            lstTextExcel.Add(new TextRead() { Row = i, Col = j, Value = item, SheetName = worksheet.Name, SheetIndex = sheetIndex, IsSheetName = false });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return lstTextExcel;
            }
            catch (Exception ex)
            {
                this.Dispose();
                throw ex;
            }
        }

        public IEnumerable<string> GetDictionary()
        {
            try
            {
                List<String> listDictionary = new List<String>();
                var fileExt = Path.GetExtension(FilePath);

                if (fileExt == null ||
                    (string.Compare(fileExt, ".xls", StringComparison.Ordinal) != 0 &&
                     string.Compare(fileExt, ".xlsx", StringComparison.Ordinal) != 0)) return null;
                var conn = @"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + FilePath + ";Extended Properties='Excel 12.0;HDR=YES;IMEX=1';";//for above excel 2007

                if (string.Compare(fileExt, ".xls", StringComparison.Ordinal) == 0) //compare the extension of the file
                    conn = @"provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + FilePath + ";Extended Properties='Excel 8.0;HRD=YES;IMEX=1';";//for below excel 2007

                var dtexcel = new DataSet();

                using (OleDbConnection con = new OleDbConnection(conn))
                {
                    var sheetNames = GetSheetsName();
                    if (sheetNames.Count() > 0)
                    {
                        OleDbDataAdapter oleAdpt = new OleDbDataAdapter("select * from [" + sheetNames.First() + "$]", con); //here we read data from sheet1
                                                                                                                             //fill excel data into dataTable
                        oleAdpt.Fill(dtexcel, sheetNames.First());
                        foreach (DataRow row in dtexcel.Tables[0].Rows)
                        {
                            if (row.ItemArray.Count() >= 2)
                            {
                                listDictionary.Add(row.ItemArray[0].ToString());
                                listDictionary.Add(row.ItemArray[1].ToString());
                            }
                        }
                    }
                }
                return listDictionary;
            }
            catch (Exception ex)
            {
                this.Dispose();
                throw ex;
            }
        }

        public DataSet ReadExcel(string fileExt)
        {
            var conn = @"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + FilePath + ";Extended Properties='Excel 12.0;HDR=No;IMEX=1';";//for above excel 2007

            if (string.Compare(fileExt, ".xls", StringComparison.Ordinal) == 0) //compare the extension of the file
                conn = @"provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + FilePath + ";Extended Properties='Excel 8.0;HRD=No;IMEX=1';";//for below excel 2007

            var dtexcel = new DataSet();

            using (var con = new OleDbConnection(conn))
            {
                try
                {
                    var sheetNames = GetSheetsName();
                    foreach (var name in sheetNames)
                    {
                        OleDbDataAdapter oleAdpt = new OleDbDataAdapter("select * from [" + name + "$]", con); //here we read data from sheet1
                        try
                        {
                            //fill excel data into dataTable
                            oleAdpt.Fill(dtexcel, name);
                        }
                        catch (Exception ex)
                        {
                            if (ex.Message == "System resource exceeded.")
                            {
                                continue;
                            }
                            else
                            {
                                throw ex;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    this.Dispose();
                    throw ex;
                }
            }
            return dtexcel;
        }

        public void Dispose()
        {

            GC.Collect();
            GC.WaitForPendingFinalizers();
            if (_workbook != null)
            {
                _workbook.Close(Type.Missing, Type.Missing, Type.Missing);
                Marshal.ReleaseComObject(_workbook);
            }

            if (_workbooks != null)
            {
                Marshal.ReleaseComObject(_workbooks);
            }

            if (_sheets != null)
            {
                Marshal.ReleaseComObject(_sheets);
            }

            if (_application != null)
            {
                Marshal.ReleaseComObject(_application);
            }

            if (_application != null)
            {
                _application.Quit();
                Marshal.FinalReleaseComObject(_application);
            }
        }
    }
}
