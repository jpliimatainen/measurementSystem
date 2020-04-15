using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MeasurementApi.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Person",
                columns: table => new
                {
                    PersonId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Pin = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Address = table.Column<string>(nullable: true),
                    Phone = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Person", x => x.PersonId);
                });

            migrationBuilder.CreateTable(
                name: "Measurement",
                columns: table => new
                {
                    MeasurementId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UnitName = table.Column<string>(nullable: false),
                    Value = table.Column<double>(nullable: false),
                    Time = table.Column<DateTime>(nullable: false),
                    PersonId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Measurement", x => x.MeasurementId);
                    table.ForeignKey(
                        name: "FK_Measurement_Person_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Person",
                        principalColumn: "PersonId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Measurement_PersonId",
                table: "Measurement",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Person_Pin",
                table: "Person",
                column: "Pin",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Measurement");

            migrationBuilder.DropTable(
                name: "Person");
        }
    }
}
