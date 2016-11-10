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

        //public string LanguageDescription { get; set; }

        public string Descriptions { get; set; }

        public Project()
        {

        }

        public Project(string Title,byte? UseCompanyDB,string Path,int ProjectTypeID, bool?Status, decimal?Progress, string CreateBy,DateTime? CreateAt,DateTime? DeadLine,int? TranslateLanguageID, string Descriptions)
        {
            this.Title = Title;
            this.UseCompanyDB = UseCompanyDB.HasValue ? UseCompanyDB : 0;
            this.Path = Path;
            this.ProjectTypeID = ProjectTypeID;
            this.Status = Status.HasValue ? Status : false;
            this.Progress = Progress.HasValue ? Progress : null;
            this.CreateBy = CreateBy;
            this.CreateAt = CreateAt.HasValue ? CreateAt : null;
            this.DeadLine = DeadLine.HasValue ? DeadLine : null;
            this.TranslateLanguageID = TranslateLanguageID.HasValue ? TranslateLanguageID : 1;
            this.Descriptions = Descriptions;
        }
    }


}
