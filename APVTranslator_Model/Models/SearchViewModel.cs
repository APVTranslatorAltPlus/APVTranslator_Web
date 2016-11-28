using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APVTranslator_Model.Models
{
    public class SearchViewModel
    {
        public Int64 FileId { get; set; }
        public int ProjectId { get; set; }
        public int Type { get; set; }
        public string TextSegment1 { get; set; }
        public string TextSegment2 { get; set; }
        public string Dictionary { get; set; }
        public string Title { get; set; }
    }
}
