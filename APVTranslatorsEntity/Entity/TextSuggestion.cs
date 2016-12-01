using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APVTranslators_Entity.Entity
{
    public class TextSuggestion
    {
        public string TextSegment1 { get; set; }

        public string TextSegment2 { get; set; }

        public Decimal MatchPoint { get; set; }

        public String Dictionary { get; set; }
    }
}
