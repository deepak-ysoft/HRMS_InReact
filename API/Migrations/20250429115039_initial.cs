using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HRMS.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "calendar",
                columns: table => new
                {
                    CalId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Subject = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_calendar", x => x.CalId);
                });

            migrationBuilder.CreateTable(
                name: "candidateDetails",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    contact_No = table.Column<string>(type: "nvarchar(14)", maxLength: 14, nullable: false),
                    linkedin_Profile = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    email_ID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    roles = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    experience = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    skills = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ctc = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    etc = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    notice_Period = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    current_Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    prefer_Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    reason_For_Job_Change = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    schedule_Interview = table.Column<DateTime>(type: "datetime2", nullable: true),
                    schedule_Interview_status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    comments = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    cvPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_candidateDetails", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeAssets",
                columns: table => new
                {
                    AssetId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssetName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmpId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeAssets", x => x.AssetId);
                });

            migrationBuilder.CreateTable(
                name: "employeeBirthdays",
                columns: table => new
                {
                    ebId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    calId = table.Column<int>(type: "int", nullable: true),
                    empId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employeeBirthdays", x => x.ebId);
                });

            migrationBuilder.CreateTable(
                name: "employeeLeaveVM",
                columns: table => new
                {
                    leaveVmId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    calId = table.Column<int>(type: "int", nullable: true),
                    leaveId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employeeLeaveVM", x => x.leaveVmId);
                });

            migrationBuilder.CreateTable(
                name: "employeesleave",
                columns: table => new
                {
                    leaveId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LeaveFor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LeaveType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    startDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    endDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    empId = table.Column<int>(type: "int", nullable: false),
                    isDelete = table.Column<bool>(type: "bit", nullable: false),
                    isApprove = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employeesleave", x => x.leaveId);
                });

            migrationBuilder.CreateTable(
                name: "leads",
                columns: table => new
                {
                    LeadsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DateTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LinkedInProfile = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Post = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Number = table.Column<string>(type: "nvarchar(14)", maxLength: 14, nullable: false),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_leads", x => x.LeadsId);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    URId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    URole = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => x.URId);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    empId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    empName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    empEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    empPassword = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    empNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    empDateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    empGender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    empJobTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    empExperience = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    empDateofJoining = table.Column<DateTime>(type: "datetime2", nullable: false),
                    empAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImagePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ResetToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResetTokenExpiration = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.empId);
                    table.ForeignKey(
                        name: "FK_Employees_UserRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "UserRoles",
                        principalColumn: "URId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employees_RoleId",
                table: "Employees",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "calendar");

            migrationBuilder.DropTable(
                name: "candidateDetails");

            migrationBuilder.DropTable(
                name: "EmployeeAssets");

            migrationBuilder.DropTable(
                name: "employeeBirthdays");

            migrationBuilder.DropTable(
                name: "employeeLeaveVM");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "employeesleave");

            migrationBuilder.DropTable(
                name: "leads");

            migrationBuilder.DropTable(
                name: "UserRoles");
        }
    }
}
