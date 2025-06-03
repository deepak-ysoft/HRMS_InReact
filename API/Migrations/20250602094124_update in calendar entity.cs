using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HRMS.Migrations
{
    /// <inheritdoc />
    public partial class updateincalendarentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Subject",
                table: "calendar",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "calendar",
                newName: "Start");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "calendar",
                newName: "End");

            migrationBuilder.AlterColumn<bool>(
                name: "isDelete",
                table: "leads",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "calendar",
                newName: "Subject");

            migrationBuilder.RenameColumn(
                name: "Start",
                table: "calendar",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "End",
                table: "calendar",
                newName: "EndDate");

            migrationBuilder.AlterColumn<bool>(
                name: "isDelete",
                table: "leads",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
