using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HRMS.Migrations
{
    /// <inheritdoc />
    public partial class addbaseEntityinall : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isDelete",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "isDelete",
                table: "candidateDetails");

            migrationBuilder.RenameColumn(
                name: "isDelete",
                table: "leads",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "isDelete",
                table: "employeesleave",
                newName: "IsDeleted");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "leads",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "leads",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "leads",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "leads",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "employeesleave",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "employeesleave",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "employeesleave",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "employeesleave",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Employees",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Employees",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Employees",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Employees",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "Employees",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EmployeeAssets",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "EmployeeAssets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "EmployeeAssets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "EmployeeAssets",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "EmployeeAssets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "candidateDetails",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "candidateDetails",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "candidateDetails",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "candidateDetails",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "candidateDetails",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "leads");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "leads");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "leads");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "leads");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "employeesleave");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "employeesleave");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "employeesleave");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "employeesleave");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EmployeeAssets");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "EmployeeAssets");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "EmployeeAssets");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "EmployeeAssets");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "EmployeeAssets");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "candidateDetails");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "candidateDetails");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "candidateDetails");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "candidateDetails");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "candidateDetails");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "leads",
                newName: "isDelete");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "employeesleave",
                newName: "isDelete");

            migrationBuilder.AddColumn<bool>(
                name: "isDelete",
                table: "Employees",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isDelete",
                table: "candidateDetails",
                type: "bit",
                nullable: true);
        }
    }
}
