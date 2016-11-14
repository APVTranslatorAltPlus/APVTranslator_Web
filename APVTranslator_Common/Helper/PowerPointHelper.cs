using APVTranslator_Entity;
using Microsoft.Office.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerPoint = Microsoft.Office.Interop.PowerPoint;

namespace APVTranslator_Common.Helpers
{
    public class PowerPointHelper : IDisposable
    {
        #region Properties
        PowerPoint.Application _application;
        PowerPoint.Presentations _presentations;
        PowerPoint.Presentation _presentation;

        public static string FilePath { get; set; }

        #endregion


        public PowerPointHelper()
        {
            OpenPresentation();
        }

        public PowerPointHelper(string path)
        {
            FilePath = path;
            OpenPresentation();
        }

        private void OpenPresentation()
        {
            _application = new PowerPoint.Application();
            _presentations = _application.Presentations;
            _presentation = _presentations.Open(FilePath, MsoTriState.msoFalse, MsoTriState.msoFalse, MsoTriState.msoFalse);

        }

        public List<TextRead> GetTexts()
        {
            //var lstText = new List<string>();
            List<TextRead> lstTextRead = new List<TextRead>();
            try
            {
                Double checkInt;
                for (int i = 0; i < _presentation.Slides.Count; i++)
                {

                    foreach (var item in _presentation.Slides[i + 1].Shapes)
                    {
                        var shape = (PowerPoint.Shape)item;
                        if (shape.HasTextFrame == MsoTriState.msoTrue)
                        {
                            if (shape.TextFrame.HasText == MsoTriState.msoTrue)
                            {
                                var textRange = shape.TextFrame.TextRange;
                                var text = textRange.Text.Trim();
                                if (String.IsNullOrEmpty(text)) continue;
                                var stringSeparators = new char[] { '。', '.', '\n', '\r', '\a', '\u0001', '\v' };
                                var segment = text.Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                                segment = segment.Where(x => x.Length > 0 && !Double.TryParse(x, out checkInt)).ToArray();
                                int k = 0;
                                foreach (var itsegment in segment)
                                {
                                    TextRead oTempTextRead = new TextRead() { Row = -1, Col = -1, Value = itsegment.Trim(), SheetName = String.Empty };
                                    if (!String.IsNullOrEmpty(itsegment.Trim()) && !lstTextRead.Any(a => a.Value == itsegment.Trim()))
                                    {
                                        lstTextRead.Add(oTempTextRead);
                                    }
                                    k++;
                                }
                            }
                        }
                    }
                }
                return lstTextRead;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void ReplaceObject(string what, string replacement)
        {
            try
            {
                int slideCount = _presentation.Slides.Count;
                for (var i = 0; i < slideCount; i++)
                {
                    foreach (var item in _presentation.Slides[i + 1].Shapes)
                    {
                        var shape = (PowerPoint.Shape)item;
                        if (shape.HasTextFrame != MsoTriState.msoTrue) continue;
                        if (shape.TextFrame.HasText != MsoTriState.msoTrue) continue;
                        var textRange = shape.TextFrame.TextRange;
                        var stringSeparators = new char[] { '。', '.', '\n', '\r', '\a', '\u0001', '\v' };
                        var segment = textRange.Text.Trim().Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                        foreach (var sItem in segment)
                        {
                            if (sItem.Trim() == what)
                            {
                                textRange.Text = textRange.Text.Replace(what, replacement);
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void Save()
        {
            _presentation.Save();
        }

        public void Dispose()
        {
            _application.Quit();
        }
    }
}
