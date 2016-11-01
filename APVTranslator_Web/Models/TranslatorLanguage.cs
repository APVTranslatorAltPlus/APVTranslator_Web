namespace APVTranslator_Web.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("TranslatorLanguage")]
    public partial class TranslatorLanguage
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int TranslatorLanguageID { get; set; }

        [StringLength(255)]
        public string LanguageDescription { get; set; }

        [StringLength(10)]
        public string LanguagePair { get; set; }
    }
}
