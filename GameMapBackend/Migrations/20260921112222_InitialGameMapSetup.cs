using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameMapBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialGameMapSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Maps",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    ImageWidth = table.Column<int>(type: "INTEGER", nullable: false),
                    ImageHeight = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Maps", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Characters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    MapId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    TokenImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    IsPlayerCharacter = table.Column<bool>(type: "INTEGER", nullable: false),
                    OwnerPlayerId = table.Column<string>(type: "TEXT", nullable: true),
                    GridX = table.Column<int>(type: "INTEGER", nullable: false),
                    GridY = table.Column<int>(type: "INTEGER", nullable: false),
                    SizeInCells = table.Column<int>(type: "INTEGER", nullable: false),
                    CurrentHp = table.Column<int>(type: "INTEGER", nullable: false),
                    MaxHp = table.Column<int>(type: "INTEGER", nullable: false),
                    ArmorClass = table.Column<int>(type: "INTEGER", nullable: false),
                    SpeedInFeet = table.Column<int>(type: "INTEGER", nullable: false),
                    ClassIndex = table.Column<string>(type: "TEXT", nullable: true),
                    RaceIndex = table.Column<string>(type: "TEXT", nullable: true),
                    MonsterIndex = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Characters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Characters_Maps_MapId",
                        column: x => x.MapId,
                        principalTable: "Maps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GameSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    SessionName = table.Column<string>(type: "TEXT", nullable: false),
                    JoinCode = table.Column<string>(type: "TEXT", nullable: false),
                    DungeonMasterId = table.Column<string>(type: "TEXT", nullable: false),
                    ActiveMapId = table.Column<Guid>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameSessions_Maps_ActiveMapId",
                        column: x => x.ActiveMapId,
                        principalTable: "Maps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Grids",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    MapId = table.Column<Guid>(type: "TEXT", nullable: false),
                    CellSizeInPixels = table.Column<int>(type: "INTEGER", nullable: false),
                    Columns = table.Column<int>(type: "INTEGER", nullable: false),
                    Rows = table.Column<int>(type: "INTEGER", nullable: false),
                    GridColorHex = table.Column<string>(type: "TEXT", nullable: false),
                    Opacity = table.Column<float>(type: "REAL", nullable: false),
                    OffsetX = table.Column<int>(type: "INTEGER", nullable: false),
                    OffsetY = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grids", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Grids_Maps_MapId",
                        column: x => x.MapId,
                        principalTable: "Maps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActiveSpellEffects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    MapId = table.Column<Guid>(type: "TEXT", nullable: false),
                    SpellIndex = table.Column<string>(type: "TEXT", nullable: false),
                    SpellName = table.Column<string>(type: "TEXT", nullable: false),
                    CasterCharacterId = table.Column<Guid>(type: "TEXT", nullable: true),
                    TargetGridX = table.Column<int>(type: "INTEGER", nullable: false),
                    TargetGridY = table.Column<int>(type: "INTEGER", nullable: false),
                    RadiusInCells = table.Column<int>(type: "INTEGER", nullable: false),
                    Shape = table.Column<int>(type: "INTEGER", nullable: false),
                    EffectColorHex = table.Column<string>(type: "TEXT", nullable: false),
                    IsPersistent = table.Column<bool>(type: "INTEGER", nullable: false),
                    RequiresConcentration = table.Column<bool>(type: "INTEGER", nullable: false),
                    DurationInRounds = table.Column<int>(type: "INTEGER", nullable: true),
                    CastAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActiveSpellEffects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActiveSpellEffects_Characters_CasterCharacterId",
                        column: x => x.CasterCharacterId,
                        principalTable: "Characters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ActiveSpellEffects_Maps_MapId",
                        column: x => x.MapId,
                        principalTable: "Maps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SessionParticipants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    GameSessionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PlayerId = table.Column<string>(type: "TEXT", nullable: false),
                    PlayerName = table.Column<string>(type: "TEXT", nullable: false),
                    IsDungeonMaster = table.Column<bool>(type: "INTEGER", nullable: false),
                    AssignedCharacterId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionParticipants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SessionParticipants_Characters_AssignedCharacterId",
                        column: x => x.AssignedCharacterId,
                        principalTable: "Characters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SessionParticipants_GameSessions_GameSessionId",
                        column: x => x.GameSessionId,
                        principalTable: "GameSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActiveSpellEffects_CasterCharacterId",
                table: "ActiveSpellEffects",
                column: "CasterCharacterId");

            migrationBuilder.CreateIndex(
                name: "IX_ActiveSpellEffects_MapId",
                table: "ActiveSpellEffects",
                column: "MapId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_MapId",
                table: "Characters",
                column: "MapId");

            migrationBuilder.CreateIndex(
                name: "IX_GameSessions_ActiveMapId",
                table: "GameSessions",
                column: "ActiveMapId");

            migrationBuilder.CreateIndex(
                name: "IX_Grids_MapId",
                table: "Grids",
                column: "MapId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SessionParticipants_AssignedCharacterId",
                table: "SessionParticipants",
                column: "AssignedCharacterId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionParticipants_GameSessionId",
                table: "SessionParticipants",
                column: "GameSessionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActiveSpellEffects");

            migrationBuilder.DropTable(
                name: "dnd_classes");

            migrationBuilder.DropTable(
                name: "dnd_conditions");

            migrationBuilder.DropTable(
                name: "dnd_monsters");

            migrationBuilder.DropTable(
                name: "dnd_races");

            migrationBuilder.DropTable(
                name: "dnd_spells");

            migrationBuilder.DropTable(
                name: "Grids");

            migrationBuilder.DropTable(
                name: "SessionParticipants");

            migrationBuilder.DropTable(
                name: "Characters");

            migrationBuilder.DropTable(
                name: "GameSessions");

            migrationBuilder.DropTable(
                name: "Maps");
        }
    }
}
