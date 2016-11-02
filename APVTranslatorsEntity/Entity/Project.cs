namespace APVTranslator_Entity.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class Project
    {
        public int Id { get; set; }

        [Required]
        [StringLength(500)]
        public string Title { get; set; }

        public byte? UseCompanyDB { get; set; }

        [StringLength(250)]
        public string Path { get; set; }

        public int ProjectTypeID { get; set; }

        public bool? Status { get; set; }

        public decimal? Progress { get; set; }

        [StringLength(50)]
        public string CreateBy { get; set; }

        public DateTime? CreateAt { get; set; }

        public DateTime? DeadLine { get; set; }

        public int? TranslateLanguageID { get; set; }

        public string LanguageDescription { get; set; }

        public string Descriptions { get; set; }
    }
}
