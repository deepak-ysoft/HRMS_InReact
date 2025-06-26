using HRMS.IServices;
using HRMS.ViewModel.Request;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpPost("mark-in")]
        public async Task<IActionResult> MarkIn([FromForm] MarkAttendanceRequestVM markAttendanceDto)
        {
            var result = await _attendanceService.MarkIn(markAttendanceDto);
            return Ok(result);
        }

        [HttpPost("mark-out")]
        public async Task<IActionResult> MarkOut([FromForm] MarkAttendanceRequestVM markAttendanceDto)
        {
            var result = await _attendanceService.MarkOut(markAttendanceDto);
            return Ok(result);
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistory(int page = 1, int pageSize = 10, string SearchValue = "")
        {
            var data = await _attendanceService.GetAttendanceHistory(page, pageSize, SearchValue);
            return Ok(data);
        }
    }
}
