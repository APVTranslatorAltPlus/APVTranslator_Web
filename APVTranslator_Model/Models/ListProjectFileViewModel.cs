using APVTranslator_Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APVTranslator_Model.Models
{
    public class ListProjectFileViewModel
    {
      
        public int ProjectID { get; set; }

        public long FileID { get; set; }
      
        public string FileName { get; set; }
      
        public string FilePath { get; set; }

        public short FileType { get; set; }

        public DateTime? LastUpdate { get; set; }

        public bool? IsLoadText { get; set; }

        public decimal? FileProgress { get; set; }
    }
}
