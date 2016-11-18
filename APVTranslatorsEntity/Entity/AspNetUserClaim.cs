namespace APVTranslator_Entity.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class AspNetUserClaim
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        [StringLength(128)]

        public string ClaimType { get; set; }

        public string ClaimValue { get; set; }

        //public virtual AspNetUser AspNetUser { get; set; }
    }
}
