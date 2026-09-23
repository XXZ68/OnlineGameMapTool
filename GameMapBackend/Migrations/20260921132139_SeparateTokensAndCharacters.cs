using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameMapBackend.Migrations
{
    /// <inheritdoc />
    public partial class SeparateTokensAndCharacters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActiveSpellEffects_Characters_CasterCharacterId",
                table: "ActiveSpellEffects");

            migrationBuilder.DropForeignKey(
                name: "FK_Characters_Maps_MapId",
                table: "Characters");

            migrationBuilder.DropForeignKey(
                name: "FK_GameSessions_Maps_ActiveMapId",
                table: "GameSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_SessionParticipants_Characters_AssignedCharacterId",
                table: "SessionParticipants");

            migrationBuilder.DropIndex(
                name: "IX_SessionParticipants_AssignedCharacterId",
                table: "SessionParticipants");

            migrationBuilder.DropIndex(
                name: "IX_Characters_MapId",
                table: "Characters");

            migrationBuilder.DropIndex(
                name: "IX_ActiveSpellEffects_CasterCharacterId",
                table: "ActiveSpellEffects");

            migrationBuilder.DropColumn(
                name: "GridColorHex",
                table: "Grids");

            migrationBuilder.DropColumn(
                name: "desc",
                table: "dnd_spells");

            migrationBuilder.DropColumn(
                name: "desc",
                table: "dnd_conditions");

            migrationBuilder.DropColumn(
                name: "GridX",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "GridY",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "IsPlayerCharacter",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "MonsterIndex",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "CastAtUtc",
                table: "ActiveSpellEffects");

            migrationBuilder.DropColumn(
                name: "DurationInRounds",
                table: "ActiveSpellEffects");

            migrationBuilder.DropColumn(
                name: "IsPersistent",
                table: "ActiveSpellEffects");

            migrationBuilder.RenameColumn(
                name: "AssignedCharacterId",
                table: "SessionParticipants",
                newName: "SelectedCharacterId");

            migrationBuilder.RenameColumn(
                name: "ImageWidth",
                table: "Maps",
                newName: "WidthInPixels");

            migrationBuilder.RenameColumn(
                name: "ImageHeight",
                table: "Maps",
                newName: "HeightInPixels");

            migrationBuilder.RenameColumn(
                name: "Opacity",
                table: "Grids",
                newName: "LineOpacity");

            migrationBuilder.RenameColumn(
                name: "SizeInCells",
                table: "Characters",
                newName: "Level");

            migrationBuilder.RenameColumn(
                name: "MapId",
                table: "Characters",
                newName: "GameSessionId");

            migrationBuilder.RenameColumn(
                name: "TargetGridY",
                table: "ActiveSpellEffects",
                newName: "OriginGridY");

            migrationBuilder.RenameColumn(
                name: "TargetGridX",
                table: "ActiveSpellEffects",
                newName: "OriginGridX");

            migrationBuilder.RenameColumn(
                name: "EffectColorHex",
                table: "ActiveSpellEffects",
                newName: "CreatedAt");

            migrationBuilder.AddColumn<DateTime>(
                name: "JoinedAt",
                table: "SessionParticipants",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "LineColor",
                table: "Grids",
                type: "TEXT",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<bool>(
                name: "concentration",
                table: "dnd_spells",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<string>(
                name: "TokenImageUrl",
                table: "Characters",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "OwnerPlayerId",
                table: "Characters",
                type: "TEXT",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Characters",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "Shape",
                table: "ActiveSpellEffects",
                type: "TEXT",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<string>(
                name: "ColorHex",
                table: "ActiveSpellEffects",
                type: "TEXT",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "MapTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    MapId = table.Column<Guid>(type: "TEXT", nullable: false),
                    CharacterId = table.Column<Guid>(type: "TEXT", nullable: true),
                    MonsterIndex = table.Column<string>(type: "TEXT", nullable: true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    TokenImageUrl = table.Column<string>(type: "TEXT", nullable: true),
                    GridX = table.Column<int>(type: "INTEGER", nullable: false),
                    GridY = table.Column<int>(type: "INTEGER", nullable: false),
                    SizeInCells = table.Column<int>(type: "INTEGER", nullable: false),
                    CurrentHp = table.Column<int>(type: "INTEGER", nullable: false),
                    MaxHp = table.Column<int>(type: "INTEGER", nullable: false),
                    ArmorClass = table.Column<int>(type: "INTEGER", nullable: false),
                    IsVisibleToPlayers = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsLocked = table.Column<bool>(type: "INTEGER", nullable: false),
                    PlacedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MapTokens_Characters_CharacterId",
                        column: x => x.CharacterId,
                        principalTable: "Characters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MapTokens_Maps_MapId",
                        column: x => x.MapId,
                        principalTable: "Maps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameSessions_JoinCode",
                table: "GameSessions",
                column: "JoinCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MapTokens_CharacterId",
                table: "MapTokens",
                column: "CharacterId");

            migrationBuilder.CreateIndex(
                name: "IX_MapTokens_MapId",
                table: "MapTokens",
                column: "MapId");

            migrationBuilder.AddForeignKey(
                name: "FK_GameSessions_Maps_ActiveMapId",
                table: "GameSessions",
                column: "ActiveMapId",
                principalTable: "Maps",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameSessions_Maps_ActiveMapId",
                table: "GameSessions");

            migrationBuilder.DropTable(
                name: "MapTokens");

            migrationBuilder.DropIndex(
                name: "IX_GameSessions_JoinCode",
                table: "GameSessions");

            migrationBuilder.DropColumn(
                name: "JoinedAt",
                table: "SessionParticipants");

            migrationBuilder.DropColumn(
                name: "LineColor",
                table: "Grids");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "ColorHex",
                table: "ActiveSpellEffects");

            migrationBuilder.RenameColumn(
                name: "SelectedCharacterId",
                table: "SessionParticipants",
                newName: "AssignedCharacterId");

            migrationBuilder.RenameColumn(
                name: "WidthInPixels",
                table: "Maps",
                newName: "ImageWidth");

            migrationBuilder.RenameColumn(
                name: "HeightInPixels",
                table: "Maps",
                newName: "ImageHeight");

            migrationBuilder.RenameColumn(
                name: "LineOpacity",
                table: "Grids",
                newName: "Opacity");

            migrationBuilder.RenameColumn(
                name: "Level",
                table: "Characters",
                newName: "SizeInCells");

            migrationBuilder.RenameColumn(
                name: "GameSessionId",
                table: "Characters",
                newName: "MapId");

            migrationBuilder.RenameColumn(
                name: "OriginGridY",
                table: "ActiveSpellEffects",
                newName: "TargetGridY");

            migrationBuilder.RenameColumn(
                name: "OriginGridX",
                table: "ActiveSpellEffects",
                newName: "TargetGridX");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "ActiveSpellEffects",
                newName: "EffectColorHex");

            migrationBuilder.AddColumn<string>(
                name: "GridColorHex",
                table: "Grids",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<bool>(
                name: "concentration",
                table: "dnd_spells",
                type: "INTEGER",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "desc",
                table: "dnd_spells",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "desc",
                table: "dnd_conditions",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TokenImageUrl",
                table: "Characters",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "OwnerPlayerId",
                table: "Characters",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<int>(
                name: "GridX",
                table: "Characters",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GridY",
                table: "Characters",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsPlayerCharacter",
                table: "Characters",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "MonsterIndex",
                table: "Characters",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Shape",
                table: "ActiveSpellEffects",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<DateTime>(
                name: "CastAtUtc",
                table: "ActiveSpellEffects",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "DurationInRounds",
                table: "ActiveSpellEffects",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsPersistent",
                table: "ActiveSpellEffects",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_SessionParticipants_AssignedCharacterId",
                table: "SessionParticipants",
                column: "AssignedCharacterId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_MapId",
                table: "Characters",
                column: "MapId");

            migrationBuilder.CreateIndex(
                name: "IX_ActiveSpellEffects_CasterCharacterId",
                table: "ActiveSpellEffects",
                column: "CasterCharacterId");

            migrationBuilder.AddForeignKey(
                name: "FK_ActiveSpellEffects_Characters_CasterCharacterId",
                table: "ActiveSpellEffects",
                column: "CasterCharacterId",
                principalTable: "Characters",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_Maps_MapId",
                table: "Characters",
                column: "MapId",
                principalTable: "Maps",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GameSessions_Maps_ActiveMapId",
                table: "GameSessions",
                column: "ActiveMapId",
                principalTable: "Maps",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_SessionParticipants_Characters_AssignedCharacterId",
                table: "SessionParticipants",
                column: "AssignedCharacterId",
                principalTable: "Characters",
                principalColumn: "Id");
        }
    }
}
