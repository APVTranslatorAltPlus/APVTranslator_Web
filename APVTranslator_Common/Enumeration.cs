using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APVTranslator_Common
{
    public enum FileTypes
    {
        EXCEL = 1,
        WORD,
        POWERPOINT,
        PDF
    }

    public enum UserRoles
    {
        Admin = 1,
        Other = 2
    }

    public enum TextSegmentType
    {
        TEXT = 0,
        OBJECT = 1
    }

    public enum RoleInProject
    {
        ComterMember = 0,
        ComterLeader = 1,
    };
}
