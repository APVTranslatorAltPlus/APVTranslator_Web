namespace APVTranslator_Web.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Dictionary")]
    public partial class Dictionary
    {
        public int DictionaryId { get; set; }

        public int ProjectID { get; set; }

        [StringLength(255)]
        public string DictionaryName { get; set; }
    }
}
