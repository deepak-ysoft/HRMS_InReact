﻿using System.ComponentModel.DataAnnotations;

namespace CandidateDetails_API.Model
{
    public class EmployeeLeave
    {
        [Key]
        public int leaveId { get; set; }
        [Required]
        public string LeaveFor { get; set; }
        public string? LeaveType { get; set; }
        [Required]
        public DateTime startDate { get; set; }
        [Required]
        public DateTime endDate { get; set; }
        public int empId { get; set; }
        public bool isDelete { get; set; }
        public bool? isApprove { get; set; }
    }
}
