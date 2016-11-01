namespace APVTranslator_Entity.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Dictionary")]
    public partial class Dictionary
    {
        public int DictionaryId { get; set; }

        public int ProjectID { get; set; }

        [StringLength(255)]
        public string DictionaryName { get; set; }
    }
}
