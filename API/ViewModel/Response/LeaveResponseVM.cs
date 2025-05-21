using CandidateDetails_API.Model;
using System.ComponentModel.DataAnnotations;

namespace HRMS.ViewModel.Response
{
    public class LeaveResponseVM
    {
        public int leaveId { get; set; }
        public string LeaveFor { get; set; }
        public string LeaveType { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public bool isApprove { get; set; }
    }
}
