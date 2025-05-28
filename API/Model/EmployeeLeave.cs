﻿using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace CandidateDetails_API.Model
{
    public class EmployeeLeave
    {
        [Key]
        public int leaveId { get; set; }
        [Required]
        public string LeaveFor { get; set; }
        public LeaveType LeaveType { get; set; }
        [Required]
        public DateTime startDate { get; set; }
        [Required]
        public DateTime endDate { get; set; }
        public int empId { get; set; }
        public bool isDelete { get; set; }
        public ApproveStatus? isApprove { get; set; } = ApproveStatus.Panding;
    }
    public enum LeaveType
    {
        [Display(Name = "Full Day")]
        FullDay,

        [Display(Name = "Morning Half Day")]
        MorningHalfDay,

        [Display(Name = "Evening Half Day")]
        EveningHalfDay
    }

    public enum ApproveStatus
    {
        Panding,
        Approved,
        Rejected
    }
}
