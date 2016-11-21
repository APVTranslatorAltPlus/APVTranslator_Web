using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APVTranslators_Entity.Entity
{
    public class TranslateMessage
    {
        public int UserId { get; set; }

        public string UserName { get; set; }

        public Guid Id { get; set; }

        public string TextSegment1 { get; set; }

        public string TextSegment2 { get; set; }

        public string Field { get; set; }

        public string Color { get; set; }

        public String Clients { get; set; }

        public DateTime SendTime { get; set; }
    }
}
