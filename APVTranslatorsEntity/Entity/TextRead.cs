using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APVTranslator_Entity
{
    public class TextRead
    {
        public int Row { get; set; } = -1;
        public int Col { get; set; } = -1;
        public String Value { get; set; }
        public String SheetName { get; set; }
        public Boolean IsSheetName { get; set; }
        public int SheetIndex { get; set; }
    }
}
