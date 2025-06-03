using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using CandidateDetails_API.Models;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace CandidateDetails_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CalendarController : ControllerBase
    {
        private readonly ICalendarService _service;
        private readonly ApplicationDbContext _context;
        public CalendarController(ICalendarService service, ApplicationDbContext context)
        {
            _service = service;
            _context = context;
        }
        /// <summary>
        /// Get Calendar List 
        /// </summary>
        /// <returns>List of appoinments</returns>
        [HttpGet("GetCalendar")]
        public async Task<IActionResult> GetCalendar()
        {
            try
            {
                var calendar = await _service.GetCalendarEventsAsync();
                return Ok(calendar);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Get Calendar List 
        /// </summary>
        /// <returns>List of appoinments</returns>
        [HttpGet("GetEventList")]
        public async Task<IActionResult> GetEventList()
        {
            try
            {
                var response = await _service.GetEventListAsync();
                return Ok(response);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Create edit calendar
        /// </summary>
        /// <param name="model">calendar model</param>
        /// <returns>true or false</returns>
        [Authorize(Roles = "Admin,HR")]
        [HttpPost("CreateCalendar")] // Use the appropriate HTTP method for creating a resource
        public async Task<IActionResult> CreateCalendar([FromForm] CalendarRequestVM model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // Return bad request if model state is invalid

            var response = await _service.AddEventAsync(model);
            return Ok(response);
        }

        /// <summary>
        /// Get calendar details by calendar ID
        /// </summary>
        /// <param name="id">Calendar ID</param>
        /// <returns>Calendar</returns>
        [HttpGet("GetCalendarDetails/{id}")]
        public async Task<IActionResult> GetCalendarDetails(int id)
        {
            var calendar = await _service.getCalendarByIdAsync(id);
            return Ok(calendar);
        }

        /// <summary>
        /// Update a calendar
        /// </summary>
        /// <param name="request">Update Calendar Request model</param>
        /// <returns>true or false</returns>
        [Authorize(Roles = "Admin,HR")]
        [HttpPost("UpdateCalendar")]
        public async Task<IActionResult> UpdateCalendar([FromForm] CalendarRequestVM request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // Return bad request if model state is invalid

            var response = await _service.UpdateEventAsync(request);
            return Ok(response);
        }

        // To delete a Calendar
        [Authorize(Roles = "Admin,HR")]
        [HttpDelete("DeleteCalendar/{id}")]
        public async Task<IActionResult> DeleteCalendar(int id)
        {
            var calendar = await _service.DeleteCalendarByIdAsync(id);
            if (calendar)
            {
                return Ok(new ApiResponse<string>
                {
                    IsSuccess = true,
                    Message = "Calendar deleted successfully."
                });
            }
            return Ok(new ApiResponse<string>
            {
                IsSuccess = false,
                Message = "Calendar not found or could not be deleted."
            });
        }
    }
}
