namespace APVTranslator_Web.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class TranslatorModel : DbContext
    {
        public TranslatorModel()
            : base("name=TranslatorModel")
        {
        }

        public virtual DbSet<Dictionary> Dictionaries { get; set; }
        public virtual DbSet<ProjectFile> ProjectFiles { get; set; }
        public virtual DbSet<ProjectMember> ProjectMembers { get; set; }
        public virtual DbSet<Project> Projects { get; set; }
        public virtual DbSet<ReferenceDB> ReferenceDBs { get; set; }
        public virtual DbSet<TextSegment> TextSegments { get; set; }
        public virtual DbSet<TranslatorLanguage> TranslatorLanguages { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Project>()              
                .Property(e => e.CreateBy)
                .IsFixedLength();

            modelBuilder.Entity<TranslatorLanguage>()
                .Property(e => e.LanguageDescription)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .Property(e => e.Email)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .Property(e => e.Password)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .HasMany(e => e.ProjectMembers)
                .WithRequired(e => e.User)
                .WillCascadeOnDelete(false);
        }
    }
}
