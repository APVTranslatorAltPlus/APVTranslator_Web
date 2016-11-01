namespace APVTranslator_Web.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("TextSegment")]
    public partial class TextSegment
    {
        public Guid Id { get; set; }

        public long FileId { get; set; }

        public int ProjectId { get; set; }

        public int? Type { get; set; }

        [Required]
        public string TextSegment1 { get; set; }

        public string TextSegment2 { get; set; }

        public DateTime? InsertTime { get; set; }

        [StringLength(255)]
        public string Dictionary { get; set; }

        public int? Row { get; set; }

        public int? Col { get; set; }

        [StringLength(250)]
        public string SheetName { get; set; }

        public bool? IsSheetName { get; set; }

        public int? SheetIndex { get; set; }
    }
}
