USE [master]
GO
/****** Object:  Database [APVTranslator]    Script Date: 11/7/2016 9:22:44 AM ******/
CREATE DATABASE [APVTranslator]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'APVTranslator', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.APV203\MSSQL\DATA\APVTranslator.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'APVTranslator_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.APV203\MSSQL\DATA\APVTranslator_log.ldf' , SIZE = 139264KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [APVTranslator] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [APVTranslator].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [APVTranslator] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [APVTranslator] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [APVTranslator] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [APVTranslator] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [APVTranslator] SET ARITHABORT OFF 
GO
ALTER DATABASE [APVTranslator] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [APVTranslator] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [APVTranslator] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [APVTranslator] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [APVTranslator] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [APVTranslator] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [APVTranslator] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [APVTranslator] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [APVTranslator] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [APVTranslator] SET  ENABLE_BROKER 
GO
ALTER DATABASE [APVTranslator] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [APVTranslator] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [APVTranslator] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [APVTranslator] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [APVTranslator] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [APVTranslator] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [APVTranslator] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [APVTranslator] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [APVTranslator] SET  MULTI_USER 
GO
ALTER DATABASE [APVTranslator] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [APVTranslator] SET DB_CHAINING OFF 
GO
ALTER DATABASE [APVTranslator] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [APVTranslator] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [APVTranslator] SET DELAYED_DURABILITY = DISABLED 
GO
USE [APVTranslator]
GO
/****** Object:  User [apv]    Script Date: 11/7/2016 9:22:45 AM ******/
CREATE USER [apv] WITHOUT LOGIN WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  FullTextCatalog [FTI_TextSegment]    Script Date: 11/7/2016 9:22:45 AM ******/
CREATE FULLTEXT CATALOG [FTI_TextSegment]WITH ACCENT_SENSITIVITY = OFF

GO
/****** Object:  Table [dbo].[__MigrationHistory]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[__MigrationHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ContextKey] [nvarchar](300) NOT NULL,
	[Model] [varbinary](max) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK_dbo.__MigrationHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC,
	[ContextKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[AspNetRoles]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserClaims]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserLogins]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserLogins](
	[LoginProvider] [nvarchar](128) NOT NULL,
	[ProviderKey] [nvarchar](128) NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserRoles]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserRoles](
	[UserId] [int] NOT NULL,
	[RoleId] [int] NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUsers]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUsers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEndDateUtc] [datetime] NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
	[UserName] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Dictionary]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Dictionary](
	[DictionaryId] [int] IDENTITY(1,1) NOT NULL,
	[ProjectID] [int] NOT NULL,
	[DictionaryName] [nvarchar](255) NULL,
 CONSTRAINT [PK_Dictionary] PRIMARY KEY CLUSTERED 
(
	[DictionaryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ProjectFiles]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProjectFiles](
	[ProjectID] [int] NOT NULL,
	[FileID] [bigint] IDENTITY(1,1) NOT NULL,
	[FileName] [nvarchar](255) NULL,
	[FilePath] [nvarchar](255) NOT NULL,
	[FileType] [smallint] NOT NULL,
	[LastUpdate] [datetime] NULL,
	[IsLoadText] [bit] NULL,
 CONSTRAINT [PK_ProjectFile] PRIMARY KEY CLUSTERED 
(
	[ProjectID] ASC,
	[FileID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ProjectMembers]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProjectMembers](
	[ProjectID] [int] NOT NULL,
	[UserID] [int] NOT NULL,
	[ProjectRole] [smallint] NOT NULL,
 CONSTRAINT [PK_ProjectMembers] PRIMARY KEY CLUSTERED 
(
	[ProjectID] ASC,
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Projects]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Projects](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](500) NOT NULL,
	[UseCompanyDB] [tinyint] NULL,
	[Path] [nvarchar](250) NULL,
	[ProjectTypeID] [int] NOT NULL,
	[Status] [bit] NULL,
	[Progress] [int] NULL,
	[CreateBy] [nchar](50) NULL,
	[CreateAt] [datetime] NULL,
	[DeadLine] [datetime] NULL,
	[TranslateLanguageID] [int] NULL,
	[Descriptions] [nvarchar](max) NULL,
 CONSTRAINT [PK_Projects] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ReferenceDB]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ReferenceDB](
	[ID] [int] NOT NULL,
	[ProjectReferID] [int] NOT NULL,
 CONSTRAINT [PK_ReferenceDB] PRIMARY KEY CLUSTERED 
(
	[ID] ASC,
	[ProjectReferID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[TextSegment]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TextSegment](
	[Id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_TextSegment_Id]  DEFAULT (newid()),
	[FileId] [bigint] NOT NULL,
	[ProjectId] [int] NOT NULL,
	[Type] [int] NULL CONSTRAINT [DF_TextSegment_Type]  DEFAULT ((0)),
	[TextSegment1] [nvarchar](max) NOT NULL,
	[TextSegment2] [nvarchar](max) NULL,
	[InsertTime] [datetime] NULL,
	[Dictionary] [nvarchar](255) NULL,
	[Row] [int] NULL,
	[Col] [int] NULL,
	[SheetName] [nvarchar](250) NULL,
	[IsSheetName] [bit] NULL,
	[SheetIndex] [int] NULL,
 CONSTRAINT [PK_TextSegment] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[TranslatorLanguage]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[TranslatorLanguage](
	[TranslatorLanguageID] [int] NOT NULL,
	[LanguageDescription] [varchar](255) NULL,
	[LanguagePair] [nvarchar](10) NULL,
 CONSTRAINT [PK__Translat__3BF55E48D362FB30] PRIMARY KEY CLUSTERED 
(
	[TranslatorLanguageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Users]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](50) NULL,
	[Email] [varchar](50) NOT NULL,
	[Password] [varchar](50) NOT NULL,
	[Role] [int] NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_User_Email] UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [RoleNameIndex]    Script Date: 11/7/2016 9:22:45 AM ******/
CREATE UNIQUE NONCLUSTERED INDEX [RoleNameIndex] ON [dbo].[AspNetRoles]
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserId]    Script Date: 11/7/2016 9:22:45 AM ******/
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserClaims]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserId]    Script Date: 11/7/2016 9:22:45 AM ******/
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserLogins]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_RoleId]    Script Date: 11/7/2016 9:22:45 AM ******/
CREATE NONCLUSTERED INDEX [IX_RoleId] ON [dbo].[AspNetUserRoles]
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserId]    Script Date: 11/7/2016 9:22:45 AM ******/
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserRoles]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UserNameIndex]    Script Date: 11/7/2016 9:22:45 AM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UserNameIndex] ON [dbo].[AspNetUsers]
(
	[UserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AspNetUserClaims]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserClaims] CHECK CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserLogins]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserLogins] CHECK CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[ProjectMembers]  WITH CHECK ADD  CONSTRAINT [FK_ProjectMembers_Projects] FOREIGN KEY([ProjectID])
REFERENCES [dbo].[Projects] ([Id])
GO
ALTER TABLE [dbo].[ProjectMembers] CHECK CONSTRAINT [FK_ProjectMembers_Projects]
GO
ALTER TABLE [dbo].[ProjectMembers]  WITH CHECK ADD  CONSTRAINT [FK_ProjectMembers_Users] FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[ProjectMembers] CHECK CONSTRAINT [FK_ProjectMembers_Users]
GO
ALTER TABLE [dbo].[Projects]  WITH CHECK ADD  CONSTRAINT [FK__Projects__Transl__6477ECF3] FOREIGN KEY([TranslateLanguageID])
REFERENCES [dbo].[TranslatorLanguage] ([TranslatorLanguageID])
GO
ALTER TABLE [dbo].[Projects] CHECK CONSTRAINT [FK__Projects__Transl__6477ECF3]
GO
/****** Object:  StoredProcedure [dbo].[Proc_AddDictionary]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		BDBACH
-- Create date: 20/09/2016
-- Description:	insert dictionary name
-- =============================================
CREATE PROCEDURE [dbo].[Proc_AddDictionary]
	@projectID AS INT,
	@dictionary AS NVARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;
	IF NOT EXISTS (SELECT 1 FROM [dbo].[Dictionary] WHERE [ProjectId] = @projectID AND DictionaryName=@dictionary)
		BEGIN
			INSERT INTO [dbo].[Dictionary]
			   ([ProjectID]
			   ,[DictionaryName])
			VALUES
			   (@projectID
			   ,@dictionary)
		END	
END


GO
/****** Object:  StoredProcedure [dbo].[Proc_AddMemberToProject]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		BACHBD
-- Create date: 4/8/2016
-- Description:	Add member vào project vừa tạo
-- =============================================
CREATE PROCEDURE [dbo].[Proc_AddMemberToProject]
	@projectID AS INT,
	@memberID AS INT,
	@roleInProject AS INT
AS
BEGIN
	SET NOCOUNT ON;
	INSERT INTO [dbo].[ProjectMembers]
           ([ProjectID]
           ,[UserID]
           ,[ProjectRole])
     VALUES
           (@projectID
           ,@memberID
           ,@roleInProject)
END






GO
/****** Object:  StoredProcedure [dbo].[Proc_AddTextSegmentDictionary]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		BDBACH	
-- Create date: 20/09/2016
-- Description:	insert textsegment in dictionary
-- =============================================
CREATE PROCEDURE [dbo].[Proc_AddTextSegmentDictionary] 
	@projectID AS INT,
	@dictionary AS NVARCHAR(255),
	@textSegment1 AS NVARCHAR(MAX),
	@textSegment2 AS NVARCHAR(MAX),
	@insertTime AS DATETIME
AS
BEGIN
	SET NOCOUNT ON;
 IF EXISTS (SELECT 1 FROM [dbo].[TextSegment] WHERE [ProjectId] = @projectID AND Dictionary=@dictionary AND TextSegment1=@textSegment1)
	BEGIN
	  UPDATE [dbo].[TextSegment]
		   SET [TextSegment2] = @textSegment2
		 WHERE [ProjectId] = @projectID AND Dictionary=@dictionary AND TextSegment1=@textSegment1
	END
ELSE
	BEGIN
	  INSERT INTO [dbo].[TextSegment]
			   ([Id]
			   ,[FileId]
			   ,[ProjectId]
			   ,[Type]
			   ,[TextSegment1]
			   ,[TextSegment2]
			   ,[InsertTime]
			   ,[Dictionary])
		 VALUES
			   (NEWID()
			   ,-1
			   ,@projectID
			   ,0
			   ,@textSegment1
			   ,@textSegment2
			   ,@insertTime
			   ,@dictionary)
	END
END


GO
/****** Object:  StoredProcedure [dbo].[Proc_CheckExistsProjectName]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		BACHBD
-- Create date: 5/8/2016
-- Description:	check xem tên project đã tồn tại chưa 
-- =============================================
CREATE PROCEDURE [dbo].[Proc_CheckExistsProjectName]
	@projectName AS NVARCHAR(500)
AS
BEGIN
	SET NOCOUNT ON;
	SELECT COUNT(*) FROM Projects WHERE Title= @projectName
END






GO
/****** Object:  StoredProcedure [dbo].[Proc_CreateNewProject]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		BACHBD
-- Create date: 3/8/2016
-- Description:	tạo mới một project một project
-- =============================================
CREATE PROCEDURE [dbo].[Proc_CreateNewProject]
	(@Title AS NVARCHAR(500)
    ,@UseCompanyDB AS TINYINT
    ,@Path AS NVARCHAR(250)
    ,@ProjectTypeID AS INT
    ,@Status AS BIT
    ,@CreateBy AS NVARCHAR(50)
    ,@CreateAt AS DATETIME
    ,@DeadLine AS DATETIME
    ,@TranslateLanguageID AS INT
    ,@Descriptions AS NVARCHAR(MAX))
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT OFF;
INSERT INTO [dbo].[Projects]
           ([Title]
           ,[UseCompanyDB]
           ,[Path]
           ,[ProjectTypeID]
           ,[Status]
           ,[CreateBy]
           ,[CreateAt]
           ,[DeadLine]
           ,[TranslateLanguageID]
           ,[Descriptions])
     VALUES
           (@Title
           ,@UseCompanyDB
           ,N''+@Path+''
           ,@ProjectTypeID
           ,@Status
           ,@CreateBy
           ,@CreateAt
           ,@DeadLine
           ,@TranslateLanguageID
           ,@Descriptions)
		   SELECT SCOPE_IDENTITY();---lấy ID trở lại
END






GO
/****** Object:  StoredProcedure [dbo].[Proc_DeleteDictionary]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		BDBACH	
-- Create date: 26/09/2016
-- Description:	Delete dictionary
-- =============================================
CREATE PROCEDURE [dbo].[Proc_DeleteDictionary]
    @projectID AS INT,
	@dictionaryID AS INT,
	@dictionaryName AS NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DELETE FROM [dbo].[Dictionary]
      WHERE DictionaryId=@dictionaryID AND DictionaryName=@dictionaryName

	DELETE FROM [dbo].[TextSegment] 
	  WHERE FileId=-1 AND Dictionary= @dictionaryName AND ProjectId = @projectID
END


GO
/****** Object:  StoredProcedure [dbo].[Proc_DeleteFileProject]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		BACHBD
-- Create date: 16/09/2016
-- Description:	Delete File in project
-- =============================================
CREATE PROCEDURE [dbo].[Proc_DeleteFileProject]
	@projectID AS INT,
	@fileID AS INT
AS
BEGIN
	SET NOCOUNT OFF;
	DELETE FROM [dbo].[ProjectFiles]
      WHERE ProjectID=@projectID AND FileID=@fileID
	DELETE FROM [dbo].[TextSegment]
      WHERE ProjectID=@projectID AND FileID=@fileID
END


GO
/****** Object:  StoredProcedure [dbo].[Proc_GetListMember]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		BACHBD
-- Create date: 3/8/2016	
-- Description:	Lấy danh sách member trong database vào combobox form tạo project mới
-- =============================================
CREATE PROCEDURE [dbo].[Proc_GetListMember]
	@UserID AS INT,
	@TextSearch AS Nvarchar(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SELECT * FROM Users WHERE FullName LIKE N'%'+@TextSearch+'%' OR Email LIKE N'%'+@TextSearch+'%'
END






GO
/****** Object:  StoredProcedure [dbo].[Proc_GetListProject]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Proc_GetListProject]
	@userID AS int
AS
BEGIN
	SET NOCOUNT ON;
	IF 1 = (SELECT TOP 1 Role From Users WHERE Id=@userID)   
		SELECT PJ.Id,PJ.Title,PJ.UseCompanyDB,PJ.Path,PJ.ProjectTypeID,PJ.Status,PJ.CreateBy,PJ.CreateAt,PJ.DeadLine,PJ.TranslateLanguageID,PJ.Descriptions,TL.LanguageDescription,
		CAST((CAST((SELECT COUNT(Id) AS NumberTextSegment2 FROM TextSegment AS TTS2 WHERE TTS2.TextSegment2 IS NOT NULL AND TTS2.FileId!=-1 AND TTS2.TextSegment2 <> '' AND PJ.Id = TTS2.ProjectId) AS DECIMAL(6,1))/
		 CASE 
			WHEN (SELECT COUNT(Id) AS NumberTextSegment1 FROM TextSegment AS TTS WHERE TTS.TextSegment1 IS NOT NULL AND TTS.FileId!=-1 AND TTS.TextSegment1 <> '' AND PJ.Id = TTS.ProjectId)=0
				THEN 1
				ELSE (SELECT COUNT(Id) AS NumberTextSegment1 FROM TextSegment AS TTS WHERE TTS.TextSegment1 IS NOT NULL AND TTS.FileId!=-1 AND TTS.TextSegment1 <> '' AND PJ.Id = TTS.ProjectId)
			END ) AS DECIMAL(6,2)) AS Progress
		FROM Projects AS PJ
		INNER JOIN TranslatorLanguage AS TL ON PJ.TranslateLanguageID = TL.TranslatorLanguageID	
		ORDER BY CreateAt DESC	  
	ELSE    
		SELECT PJ.Id,PJ.Title,PJ.UseCompanyDB,PJ.Path,PJ.ProjectTypeID,PJ.Status,PJ.CreateBy,PJ.CreateAt,PJ.DeadLine,PJ.TranslateLanguageID,PJ.Descriptions,TL.LanguageDescription,
		CAST((CAST((SELECT COUNT(Id) AS NumberTextSegment2 FROM TextSegment AS TTS2 WHERE TTS2.TextSegment2 IS NOT NULL AND TTS2.FileId!=-1 AND TTS2.TextSegment2 <> '' AND PJ.Id = TTS2.ProjectId) AS DECIMAL(6,1))/
		 CASE 
			WHEN (SELECT COUNT(Id) AS NumberTextSegment1 FROM TextSegment AS TTS WHERE TTS.TextSegment1 IS NOT NULL AND TTS.FileId!=-1 AND TTS.TextSegment1 <> '' AND PJ.Id = TTS.ProjectId)=0
				THEN 1
				ELSE (SELECT COUNT(Id) AS NumberTextSegment1 FROM TextSegment AS TTS WHERE TTS.TextSegment1 IS NOT NULL AND TTS.FileId!=-1 AND TTS.TextSegment1 <> '' AND PJ.Id = TTS.ProjectId)
			END ) AS DECIMAL(6,2)) AS Progress,
		TL.LanguageDescription,U.* FROM Projects AS PJ 
		INNER JOIN ProjectMembers AS PM ON PJ.Id=PM.ProjectID 
		INNER JOIN TranslatorLanguage AS TL ON PJ.TranslateLanguageID = TL.TranslatorLanguageID
		INNER JOIN Users AS U ON PM.UserID=U.Id
		WHERE U.Id=@userID
		ORDER BY CreateAt DESC
END





GO
/****** Object:  StoredProcedure [dbo].[Proc_GetListProjectFile]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		BACHBD	
-- Create date: 9/8/2016
-- Description:	Get List File of project
-- =============================================
CREATE PROCEDURE [dbo].[Proc_GetListProjectFile]
	@projectID AS INT
AS
BEGIN

	SET NOCOUNT ON;
	SELECT PL.*,P.Title FROM ProjectFiles AS PL
	INNER JOIN Projects AS P ON PL.ProjectID=P.Id
	WHERE ProjectID = @projectID 	
	ORDER BY FileID DESC
END






GO
/****** Object:  StoredProcedure [dbo].[Proc_GetListTranslateLanguage]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		BACHBD
-- Create date: 2/8/2016
-- Description:	Lấy danh sách ngôn ngữ dịch
-- =============================================
CREATE PROCEDURE [dbo].[Proc_GetListTranslateLanguage]
	@textSearch AS NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SELECT * FROM TranslatorLanguage WHERE LanguageDescription LIKE N'%'+@textSearch+'%'
END






GO
/****** Object:  StoredProcedure [dbo].[Proc_GetTextSearch]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		BDBACH
-- Create date: 21/09/2016
-- Description:	Get text search
-- =============================================
CREATE PROCEDURE [dbo].[Proc_GetTextSearch]
	@sTextSearch AS NVARCHAR(4000)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @TextSegment1 AS NVARCHAR(4000)
	DECLARE @TextSegment1_Match AS NVARCHAR(4000)
	SET @TextSegment1_Match=@sTextSearch
	SET @TextSegment1=REPLACE(@sTextSearch, '"', '""')
	SET @TextSegment1 = '"' + @TextSegment1 + '"'
						--select FileId,ProjectId,Type,TextSegment1,TextSegment2,InsertTime,Dictionary,(CAST(RANK as DECIMAL)) as MatchPoint into #Table_Contains
      --                              from TextSegment 
      --                              INNER JOIN CONTAINSTABLE(TextSegment, TextSegment1,@TextSegment1) 
      --                              as KEY_TBL on dbo.TextSegment.Id = KEY_TBL.[KEY]
      --                              where TextSegment2 != ''

                                    select FileId,ProjectId,Type,TextSegment1,TextSegment2,InsertTime,Dictionary,(CAST(RANK as DECIMAL)) as MatchPoint into #Table_FreeText 
                                    from TextSegment
                                    INNER JOIN FREETEXTTABLE(TextSegment, TextSegment1,@TextSegment1)
                                    as KEY_TBL on dbo.TextSegment.Id = KEY_TBL.[KEY]
                                    where TextSegment2 != ''

                                    --select FileId,ProjectId,Type,TextSegment1,TextSegment2,InsertTime,Dictionary,1000 as MatchPoint into #Table_Match
                                    --from TextSegment
                                    --where TextSegment1 = @TextSegment1_Match and TextSegment2 != ''

                                    select* into #Table_Union from ( 
                                    --select * ,2 as filter 
                                    --from #Table_Contains 
                                    --union 
                                    select *,3 as filter 
                                    from #Table_FreeText 
                                    --union 
                                    --select *,1 as filter 
                                    --from #Table_Match 
                                    )  as #Table_Union 

                                    select P.Title,FileId,ProjectId,Type,TextSegment1,TextSegment2,InsertTime,Dictionary,MatchPoint,filter from(
                                    select * , ROW_NUMBER() OVER(PARTITION BY TextSegment1 ORDER BY filter) as RowNumber
                                    from #Table_Union) as TableLast
									INNER JOIN Projects AS P ON P.Id=TableLast.ProjectId
                                    where MatchPoint>50 AND TextSegment1 != ''
                                    ORDER BY Dictionary DESC,filter, MatchPoint DESC 

									--DROP TABLE #Table_Contains
									DROP TABLE #Table_FreeText
									--DROP TABLE #Table_Match
									DROP TABLE #Table_Union
END


GO
/****** Object:  StoredProcedure [dbo].[Proc_SaveDictionaryTextSegment]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		BACHBD	
-- Create date: 28/09/2016
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Proc_SaveDictionaryTextSegment]
	@id AS UNIQUEIDENTIFIER,
	@textSegment1 AS NVARCHAR(MAX),
	@textSegment2 AS NVARCHAR(MAX),
	@fileId AS INT,
	@projectID AS INT,
	@dictionary AS NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	IF (SELECT COUNT(Id) From TextSegment WHERE Id=@id) = 1
		BEGIN
			UPDATE [dbo].[TextSegment]
				   SET [TextSegment1] = @textSegment1
					  ,[TextSegment2] = @textSegment2
				 WHERE Id=@id
		END
	ELSE
		BEGIN	
			INSERT INTO [dbo].[TextSegment]
					   ([Id]
					   ,[FileId]
					   ,[ProjectId]
					   ,[Type]
					   ,[TextSegment1]
					   ,[TextSegment2]
					   ,[InsertTime]
					   ,[Dictionary]
					   ,[Row]
					   ,[Col]
					   ,[SheetName]
					   ,[IsSheetName]
					   ,[SheetIndex])
				 VALUES
					   (@id
					   ,@fileId
					   ,@projectID
					   ,0
					   ,@textSegment1
					   ,@textSegment2
					   ,GETDATE()
					   ,@dictionary
					   ,NULL
					   ,NULL
					   ,NULL
					   ,'False'
					   ,NULL)
					END
END


GO
/****** Object:  StoredProcedure [dbo].[Proc_UpdateStatusFileTranslate]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		BACHBD
-- Create date: 11/8/2016
-- Description:	set file đã được load vào database chưa
-- =============================================
CREATE PROCEDURE [dbo].[Proc_UpdateStatusFileTranslate]
	@projectID AS INT,
	@fileID AS INT,
	@status AS BIT,
	@lastWriteTime AS DATETIME
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	UPDATE [dbo].[ProjectFiles]
	SET IsLoadText = @status,
		LastUpdate=@lastWriteTime
 WHERE FileID=@fileID
END






GO
/****** Object:  StoredProcedure [dbo].[Translate]    Script Date: 11/7/2016 9:22:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Batch submitted through debugger: SQLQuery11.sql|7|0|C:\Users\Bui Dinh BACH\AppData\Local\Temp\~vs787C.sql
CREATE PROCEDURE  [dbo].[Translate] (@FileId int,@ProjectId int)
AS 
BEGIN
DECLARE @Id uniqueidentifier
DECLARE @Type int
DECLARE @TextSegment1 NVARCHAR(4000)
DECLARE @TextSegment2 NVARCHAR(4000)
DECLARE @InsertTime DateTime
DECLARE @TextSegment1_Match NVARCHAR(4000)
DECLARE @Suggestion NVARCHAR(4000)
DECLARE @MatchPoint int
Create table #TableResult	
(
	Id uniqueidentifier,
	FileId int,
	ProjectId int,
	Type int,
	TextSegment1 nvarchar(max),
	TextSegment2 nvarchar(max),
	InsertTime Datetime,
	Suggestion nvarchar(max),
	MatchPoint int
)
DECLARE cs_TextSegment CURSOR FOR (
									SELECT TextSegment1,TextSegment2,Id,Type,InsertTime
									FROM TextSegment
									WHERE ProjectId = @ProjectId and FileId = @FileId
									)
	OPEN cs_TextSegment 
	FETCH NEXT FROM cs_TextSegment INTO @TextSegment1,
										@TextSegment2,
										@Id,
										@Type,
										@InsertTime
	WHILE @@FETCH_STATUS = 0 
	BEGIN
		
		set @TextSegment1_Match = @TextSegment1
		set @TextSegment1=REPLACE(@TextSegment1, '"', '""')
		set @TextSegment1 = '"' + @TextSegment1 + '"'
		select TextSegment1,TextSegment2,(CAST(RANK as DECIMAL)) as MatchPoint into #Table_Contains
		from TextSegment
		INNER JOIN CONTAINSTABLE(TextSegment,TextSegment1,@TextSegment1)
		as KEY_TBL on dbo.TextSegment.Id = KEY_TBL.[KEY] 
		where TextSegment2 != ''

		select TextSegment1,TextSegment2,(CAST(RANK as DECIMAL)) as MatchPoint into #Table_FreeText
		from TextSegment
		INNER JOIN FREETEXTTABLE(TextSegment,TextSegment1,@TextSegment1)
		as KEY_TBL on dbo.TextSegment.Id = KEY_TBL.[KEY] 
		where TextSegment2 != '' and  cast(cast(LEN(@TextSegment1_Match)  as decimal) /cast(LEN(TextSegment1) as decimal) as decimal) between 0.5 and 2
		order by rank desc

		select TextSegment1,TextSegment2,1000 as MatchPoint into #Table_Match
		from TextSegment
		where TextSegment1 = @TextSegment1_Match and TextSegment2 != ''

		select * into #Table_Union from (
		select * ,2 as filter 
		from #Table_Contains	
		union 
		select *,3 as filter 
		from #Table_FreeText
		union 
		select *,1 as filter
		from #Table_Match
		)  as #Table_Union

		select top 1 * into #Table_Suggestion from(
		select * ,ROW_NUMBER() OVER(PARTITION BY TextSegment1 ORDER BY filter) as RowNumber
		from #Table_Union) as TableLast
		where RowNumber = 1
		ORDER BY filter ,MatchPoint DESC
		set @MatchPoint = (select top 1 MatchPoint from #Table_Suggestion)
		set @Suggestion = (select top 1 TextSegment2 from #Table_Suggestion)
		if @Suggestion is null 
			set @Suggestion = ''
		if @MatchPoint is null 
			set @MatchPoint = 0

		insert into #TableResult values (@Id,@FileId,@ProjectId,@Type,@TextSegment1_Match,@TextSegment2,@InsertTime,@Suggestion,@MatchPoint)
		drop table #Table_Contains
		drop table #Table_FreeText
		drop table #Table_Match
		drop table #Table_Union
		drop table #Table_Suggestion
		FETCH NEXT FROM cs_TextSegment INTO @TextSegment1,
											@TextSegment2,
											@Id,
											@Type,
											@InsertTime
	END
	CLOSE cs_TextSegment;  
	DEALLOCATE cs_TextSegment;
	select * from #TableResult ORDER BY InsertTime ASC
END

GO
USE [master]
GO
ALTER DATABASE [APVTranslator] SET  READ_WRITE 
GO
