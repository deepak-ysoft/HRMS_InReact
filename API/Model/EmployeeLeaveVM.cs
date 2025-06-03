using System.ComponentModel.DataAnnotations;

namespace HRMS.Model
{
    public class EmployeeLeaveVM
    {
        [Key]
        public int leaveVmId { get; set; }
        public int? calId { get; set; }
        public int leaveId { get; set; }
    }
}
