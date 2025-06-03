using System.ComponentModel.DataAnnotations;

namespace HRMS.ViewModel.Response
{
    public class CalendarResponseVM
    {
        public string? CalId { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string start { get; set; }
        public string end { get; set; }
    }
}
