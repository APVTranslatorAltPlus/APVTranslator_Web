namespace APVTranslator_Model.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Collections.Generic;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Data.SqlClient;
    using APVTranslator_Entity.Models;

    public partial class TranslatorModel : DbContext
    {
        public TranslatorModel()
            : base("name=TranslatorModel")
        {
        }

        public virtual DbSet<C__MigrationHistory> C__MigrationHistory { get; set; }
        public virtual DbSet<AspNetRole> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; }
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
            //modelBuilder.Entity<AspNetRole>()
            //    .HasMany(e => e.AspNetUsers)
            //    .WithMany(e => e.AspNetRoles)
            //    .Map(m => m.ToTable("AspNetUserRoles").MapLeftKey("RoleId").MapRightKey("UserId"));

            //modelBuilder.Entity<AspNetUser>()
            //    .HasMany(e => e.AspNetUserClaims)
            //    .WithRequired(e => e.AspNetUser)
            //    .HasForeignKey(e => e.UserId);

            //modelBuilder.Entity<AspNetUser>()
            //    .HasMany(e => e.AspNetUserLogins)
            //    .WithRequired(e => e.AspNetUser)
            //    .HasForeignKey(e => e.UserId);

            //modelBuilder.Entity<Project>()
            //    .Property(e => e.CreateBy)
            //    .IsFixedLength();

            //modelBuilder.Entity<Project>()
            //    .HasMany(e => e.)
            //    .WithRequired(e => e.Project)
            //    .WillCascadeOnDelete(false);

            //modelBuilder.Entity<TranslatorLanguage>()
            //    .Property(e => e.LanguageDescription)
            //    .IsUnicode(false);

            //modelBuilder.Entity<TranslatorLanguage>()
            //    .HasMany(e => e.Projects)
            //    .WithOptional(e => e.TranslatorLanguage)
            //    .HasForeignKey(e => e.TranslateLanguageID);

            //modelBuilder.Entity<User>()
            //    .Property(e => e.Email)
            //    .IsUnicode(false);

            //modelBuilder.Entity<User>()
            //    .Property(e => e.Password)
            //    .IsUnicode(false);

            //modelBuilder.Entity<User>()
            //    .HasMany(e => e.ProjectMembers)
            //    .WithRequired(e => e.User)
            //    .WillCascadeOnDelete(false);
            base.OnModelCreating(modelBuilder);
        }
        /// <summary>
        /// Get List Project
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public virtual IEnumerable<Project> Proc_GetListProject(Nullable<int> userID)
        {
            var userIDParameter = userID.HasValue ?
                new SqlParameter("@userID", userID) :
                new SqlParameter("@userID", typeof(int));
            IEnumerable<Project> listProjects = this.Database.SqlQuery<Project>("Proc_GetListProject @userID", userIDParameter).ToList();
            return listProjects;
        }
    }
}
