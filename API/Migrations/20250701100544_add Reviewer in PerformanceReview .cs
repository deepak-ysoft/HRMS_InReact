using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HRMS.Migrations
{
    /// <inheritdoc />
    public partial class addReviewerinPerformanceReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_PerformanceReviews_ReviewerId",
                table: "PerformanceReviews",
                column: "ReviewerId");

            migrationBuilder.AddForeignKey(
                name: "FK_PerformanceReviews_Employees_ReviewerId",
                table: "PerformanceReviews",
                column: "ReviewerId",
                principalTable: "Employees",
                principalColumn: "empId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PerformanceReviews_Employees_ReviewerId",
                table: "PerformanceReviews");

            migrationBuilder.DropIndex(
                name: "IX_PerformanceReviews_ReviewerId",
                table: "PerformanceReviews");
        }
    }
}
