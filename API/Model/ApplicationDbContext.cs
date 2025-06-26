using CandidateDetails_API.Models;
using HRMS.Model;
using Microsoft.EntityFrameworkCore;

namespace CandidateDetails_API.Model
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<Candidate> candidateDetails { get; set; }
        public DbSet<Leads> leads { get; set; }
        public DbSet<Calendar> calendar { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeeBirthday> employeeBirthdays { get; set; }
        public DbSet<EmployeeLeave> employeesleave { get; set; }
        public DbSet<EmployeeLeaveVM> employeeLeaveVM { get; set; }
        public DbSet<EmployeeAsset> EmployeeAssets { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<EmployeeDocument> EmployeeDocuments { get; set; }
        public DbSet<Payroll> Payrolls { get; set; }
        public DbSet<PerformanceReview> PerformanceReviews { get; set; }
    }
}
