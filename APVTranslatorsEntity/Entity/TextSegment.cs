namespace APVTranslator_Entity.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

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

        public string Suggestion { get; set; }

        public string GoogleTranslate { get; set; }

        [StringLength(250)]
        public string SheetName { get; set; }

        public bool? IsSheetName { get; set; }

        public int? SheetIndex { get; set; }
    }
}
