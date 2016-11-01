namespace APVTranslator_Entity.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("TranslatorLanguage")]
    public partial class TranslatorLanguage
    {
        //[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        //public TranslatorLanguage()
        //{
        //    Projects = new HashSet<Project>();
        //}

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int TranslatorLanguageID { get; set; }

        [StringLength(255)]
        public string LanguageDescription { get; set; }

        [StringLength(10)]
        public string LanguagePair { get; set; }

        //[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        //public virtual ICollection<Project> Projects { get; set; }
    }
}
