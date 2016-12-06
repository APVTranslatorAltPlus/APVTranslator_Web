namespace APVTranslator_Entity.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class ProjectFile
    {
        [Key]
        [Column(Order = 0)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ProjectID { get; set; }

        [Key]
        [Column(Order = 1)]
        public long FileID { get; set; }

        [StringLength(255)]
        public string FileName { get; set; }

        [Required]
        [StringLength(255)]
        public string FilePath { get; set; }

        public short FileType { get; set; }

        public DateTime? LastUpdate { get; set; }

        public bool? IsLoadText { get; set; }

        //public decimal? FileProgress { get; set; }
    }
}
