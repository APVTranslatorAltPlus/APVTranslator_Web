using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Office.Interop.Word;
using APVTranslator_Entity;

namespace APVTranslator_Common.Helpers
{
    public class WordHelper : IDisposable
    {
        #region "declare"
        private Application _wordApplication = new Application();
        private object _fileName;
        object miss = System.Reflection.Missing.Value;
        private Document _document;
        object readOnly = false;//case export
        #endregion
        #region "Fun/Sub"
        public WordHelper(string fileName, bool readOnly = false)
        {
            try
            {
                this._fileName = fileName;
                this.readOnly = readOnly;
                this._document = _wordApplication.Documents.Open(ref _fileName, ref miss, ref this.readOnly, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss);
            }
            catch (Exception ex)
            {
                this.Dispose();
                throw new Exception("Can't open file from server please fix error your file and reimport and try again!");
            }
        }
        /// <summary>
        /// BACHBD 8/8/2016
        /// Return text Segment in word file
        /// </summary>
        /// <returns>lstTextSegment</returns>
        public List<TextRead> GetTextSegmentInWord()
        {
            List<TextRead> lstTextRead = new List<TextRead>();
            try
            {
                int j = 0;
                foreach (Paragraph objParagraph in _document.Paragraphs)
                {
                    Console.WriteLine(j++);
                    String txtSegment = objParagraph.Range.Text.ToString();
                    Double checkNumber;
                    if (!String.IsNullOrEmpty(txtSegment.Trim()) && !Double.TryParse(txtSegment.Trim(), out checkNumber))
                    {
                        List<String> lstSplitPassage = new List<String>();
                        lstSplitPassage = SplitPassage(txtSegment);
                        foreach (string text in lstSplitPassage)
                        {
                            TextRead temp = new TextRead() { Row = -1, Col = -1, Value = text, SheetName = String.Empty };
                            if (!lstTextRead.Any(a => a.Value == temp.Value))
                            {
                                lstTextRead.Add(new TextRead() { Row = -1, Col = -1, Value = text, SheetName = String.Empty });
                            }
                        }
                        //lstTextRead.Add(new TextRead() { });
                        //lstTextSegment.AddRange(lstSplitPassage);
                    }
                }
            }
            catch (Exception ex)
            {
                this.Dispose();
                throw ex;
            }
            return lstTextRead;
        }
        /// <summary>
        /// BACHBD 8/8/2016
        /// Return text object in word file
        /// </summary>
        /// <returns>lstTextObject</returns>
        public List<TextRead> GetTextObjectInWord()
        {
            //List<String> lstTextObject = new List<String>();
            List<TextRead> lstTextRead = new List<TextRead>();
            try
            {
                //var s = document.Shapes.Count;
                foreach (Microsoft.Office.Interop.Word.Shape shp in _document.Shapes)
                {
                    if (shp.TextFrame.HasText != 0)
                    {
                        String txtShape = shp.TextFrame.TextRange.Text.ToString(); //TextFrame .Characters(Type.Missing, Type.Missing).Text;
                        List<String> lstSplitPassage = new List<String>();
                        lstSplitPassage = SplitPassage(txtShape);
                        foreach (string text in lstSplitPassage)
                        {
                            TextRead temp = new TextRead() { Row = -1, Col = -1, Value = text, SheetName = String.Empty };
                            if (!lstTextRead.Any(a => a.Value == temp.Value))
                            {
                                lstTextRead.Add(new TextRead() { Row = -1, Col = -1, Value = text, SheetName = String.Empty });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                this.Dispose();
                throw ex;
            }
            return lstTextRead;
        }
        private List<String> SplitPassage(String Passage)
        {
            List<String> lstSplitPassage = new List<string>();
            char[] separatingChars = { '\n', '.', '\r', '\a', '\u0001', '。' };
            String[] sSplitPassage;
            //if (Passage.EndsWith("\r\a"))
            //{
            sSplitPassage = Passage.Split(separatingChars, StringSplitOptions.RemoveEmptyEntries).ToArray();
            //}
            //else
            //{
            //    sSplitPassage = Passage.SplitAndKeep(separatingChars).ToArray();
            //}
            Double checkNumber;
            for (int i = 0; i <= sSplitPassage.Count() - 1; i++)
            {
                if (!String.IsNullOrEmpty(sSplitPassage[i].Trim()) && !Double.TryParse(sSplitPassage[i].Trim(), out checkNumber))
                {
                    var text = sSplitPassage[i].Trim();
                    if (text.StartsWith("/") && text.Length > 0)
                    {
                        text = text.Substring(1, text.Length - 1);
                    }
                    if (!String.IsNullOrEmpty(text.Trim()) && !Double.TryParse(sSplitPassage[i].Trim(), out checkNumber))
                    {
                        lstSplitPassage.Add(text.Trim());
                    }
                }
            }
            return lstSplitPassage;
        }
        /// <summary>
        /// BACHBD 9/8/2016
        /// ReplaceText 
        /// </summary>
        public void ReplaceText(string what, string replacement)
        {
            try
            {
                double checkNumber;
                bool bReplacedText = false;
                foreach (Paragraph objParagraph in _document.Paragraphs)
                {
                    if (bReplacedText)
                    {
                        bReplacedText = false;
                        continue;
                    }
                    String txtSegment = objParagraph.Range.Text.ToString();
                    if (!String.IsNullOrEmpty(txtSegment.Trim()) && !Double.TryParse(txtSegment.Trim(), out checkNumber))
                    {
                        List<String> lstSplitPassage = new List<String>();
                        lstSplitPassage = SplitPassage(txtSegment);
                        if (lstSplitPassage.Contains(what))
                        {
                            txtSegment = txtSegment.Replace(what, replacement);
                            objParagraph.Range.Text = txtSegment;
                            bReplacedText = true;
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

        public void Save()
        {
            _document.Save();
        }

        /// <summary>
        /// BACHBD 9/8/2016
        /// replace text in object
        /// </summary>
        public void ReplaceObject(string what, string replacement)
        {
            try
            {
                foreach (Microsoft.Office.Interop.Word.Shape shp in _document.Shapes)
                {
                    if (shp.TextFrame.HasText != 0)
                    {
                        if (shp.TextFrame.TextRange.Text.ToString().Contains(what))
                        {
                            var initialText = shp.TextFrame.TextRange.Text;
                            var resultText = initialText.Replace(what, replacement);
                            shp.TextFrame.TextRange.Text = resultText;
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
        //Garbage collection for memory.
        public void Dispose()
        {
            GC.Collect(); // force final cleanup!
            GC.WaitForPendingFinalizers();
            if (_document != null)
            {
                _document.Close(null, null, null);
            }
            if (_wordApplication != null)
            {
                _wordApplication.Quit();
                System.Runtime.InteropServices.Marshal.ReleaseComObject(_wordApplication);
            }
        }
        #endregion
    }
}
