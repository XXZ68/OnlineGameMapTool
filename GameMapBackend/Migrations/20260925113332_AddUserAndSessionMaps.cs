using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameMapBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserAndSessionMaps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "GameSessionId",
                table: "MapTokens",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "UserEntityId",
                table: "GameSessions",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SessionMaps",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    GameSessionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    OriginalMapId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    GridJson = table.Column<string>(type: "TEXT", nullable: false),
                    TokensJson = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionMaps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SessionMaps_GameSessions_GameSessionId",
                        column: x => x.GameSessionId,
                        principalTable: "GameSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Username = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameSessions_UserEntityId",
                table: "GameSessions",
                column: "UserEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionMaps_GameSessionId",
                table: "SessionMaps",
                column: "GameSessionId");

            migrationBuilder.AddForeignKey(
                name: "FK_GameSessions_Users_UserEntityId",
                table: "GameSessions",
                column: "UserEntityId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameSessions_Users_UserEntityId",
                table: "GameSessions");

            migrationBuilder.DropTable(
                name: "SessionMaps");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropIndex(
                name: "IX_GameSessions_UserEntityId",
                table: "GameSessions");

            migrationBuilder.DropColumn(
                name: "GameSessionId",
                table: "MapTokens");

            migrationBuilder.DropColumn(
                name: "UserEntityId",
                table: "GameSessions");
        }
    }
}
