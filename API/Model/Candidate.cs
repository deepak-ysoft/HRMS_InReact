﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CandidateDetails_API.Model
{
    public class Candidate
    {
        [Key]
        public int id { get; set; }
        [Required]
        public DateTime date { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        [MinLength(10)]
        [MaxLength(14)]
        [RegularExpression(@"^\+?[0-9 ]{10,14}$",
        ErrorMessage = "Only numbers, '+' sign, and one space are allowed.")]
        public string contact_No { get; set; }
        public string? linkedin_Profile { get; set; }
        [Required]
        [RegularExpression("^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\\.[a-zA-Z]{2,}$", ErrorMessage = "Please enter a valid email address.")] // Email validation
        public string email_ID { get; set; }
        [Required]
        public string roles { get; set; }
        [Required]
        public string experience { get; set; }
        [Required]
        public string skills { get; set; }
        [Required]
        public decimal ctc { get; set; }
        [Required]
        public decimal etc { get; set; }
        [Required]
        public string notice_Period { get; set; }
        [Required]
        public string current_Location { get; set; }
        [Required]
        public string prefer_Location { get; set; }
        [Required]
        public string reason_For_Job_Change { get; set; }
        public DateTime? schedule_Interview { get; set; }
        public string ?schedule_Interview_status { get; set; }
        [Required]
        public string comments { get; set; }
        [NotMapped]
        public IFormFile? cv { get; set; }
        public string? cvPath { get; set; }
        public bool? isDelete { get; set; }
    }
}