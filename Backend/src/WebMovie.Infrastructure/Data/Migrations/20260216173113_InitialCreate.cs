using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebMovie.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    AvatarUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Favorites",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    MovieSlug = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    MovieName = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    MoviePosterUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    MovieThumbUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    MovieYear = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Favorites", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Favorites_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WatchHistory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    MovieSlug = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    MovieName = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    MoviePosterUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    MovieThumbUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    EpisodeSlug = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    EpisodeName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    WatchedSeconds = table.Column<int>(type: "integer", nullable: false),
                    TotalSeconds = table.Column<int>(type: "integer", nullable: false),
                    WatchedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WatchHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WatchHistory_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Favorites_UserId_MovieSlug",
                table: "Favorites",
                columns: new[] { "UserId", "MovieSlug" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WatchHistory_UserId_MovieSlug_EpisodeSlug",
                table: "WatchHistory",
                columns: new[] { "UserId", "MovieSlug", "EpisodeSlug" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WatchHistory_UserId_WatchedAt",
                table: "WatchHistory",
                columns: new[] { "UserId", "WatchedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Favorites");

            migrationBuilder.DropTable(
                name: "WatchHistory");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
