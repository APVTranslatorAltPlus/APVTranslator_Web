using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APVTranslator_Model.Models
{
    public class MemberSettingViewModel
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
        public Int16 ProjectRole { get; set; }
        public int isAMember { get; set; }

        public MemberSettingViewModel()
        {

        }
    }
}
