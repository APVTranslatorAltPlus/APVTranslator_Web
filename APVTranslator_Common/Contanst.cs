using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APVTranslator_Common
{
    public static class Contanst
    {
        public static string[] fileType = new string[] { ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx" };
        public static string sRegexLink = "^http(s)?://([\\w-]+.)+[\\w-]+(/[\\w- ./?%&#=])?$";
    }
}
