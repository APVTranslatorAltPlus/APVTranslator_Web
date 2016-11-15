using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APVTranslator_Controllers
{
    public class SegmentsResult
    {
        public ControllerResult ControllerResult { get; set; } = new ControllerResult();
        public int FileType { get; set; }
    }
}
