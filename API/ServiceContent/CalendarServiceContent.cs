﻿using Azure.Core;
using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using CandidateDetails_API.Models;
using DocumentFormat.OpenXml.Spreadsheet;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace CandidateDetails_API.ServiceContent
{
    public class CalendarServiceContent : ICalendarService // Calendar service content
    {
        private readonly ApplicationDbContext _context; // Database context
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly int _currentUserId; // Current user ID
        public CalendarServiceContent(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context; // Initialize the database context
            _httpContextAccessor = httpContextAccessor;

            var user = _httpContextAccessor.HttpContext?.User;
            _currentUserId = Convert.ToInt32(user?.FindFirst("empId")?.Value);
        }

        // Get calendar by calendar id
        public async Task<dynamic> getCalendarByIdAsync(int id) // Get calendar by id
        {
            var leave = await _context.employeeLeaveVM.FirstOrDefaultAsync(x => x.calId == id);
            var birth = await _context.employeeBirthdays.FirstOrDefaultAsync(x => x.calId == id);
            bool isUsed = leave != null || birth != null;

            var calendar = await _context.calendar.FirstOrDefaultAsync(x => x.CalId == id);
            if (calendar == null)
            {
                return new
                {
                    IsSuccess = false,
                    Message = "Calendar not found."
                }; // Handle the case when the calendar doesn't exist
            }

            return new
            {
                IsSuccess = true,
                Message = "Calendar retrieved successfully.",
                Data = calendar,
                isUsed = isUsed
            };
        }

        // Delete calendar
        public async Task<bool> DeleteCalendarByIdAsync(int id) // Delete calendar by id
        {
            var calendar = await _context.calendar.FirstOrDefaultAsync(x => x.CalId == id); // Get calendar
            if (calendar != null)
            {
                calendar.IsDeleted = true; // Mark calendar as deleted
                _context.calendar.Update(calendar); // delete calendar
                int n = await _context.SaveChangesAsync();
                return n > 0;
            }
            return false;
        }

        public async Task<ApiResponse<List<CalendarResponseVM>>> GetCalendarEventsAsync()
        {
            // Retrieve the calendar from the database
            var calendar = await _context.calendar.Where(x => !x.IsDeleted).Select(a => new CalendarResponseVM
            {
                CalId = a.CalId.ToString(), // Map CalId to id for FullCalendar compatibility
                title = a.Title.ToString(),       // Map Subject to title
                description = a.Description, // Map Description
                start = a.Start.ToString("o"), // Use ISO8601 format for FullCalendar
                end = a.End.ToString("o")     // Handle nullable EndDate
            }).ToListAsync();

            // Return the calendar as JSON
            return new ApiResponse<List<CalendarResponseVM>>
            {
                IsSuccess = true,
                Message = "Calendar retrieved successfully.",
                Data = calendar
            };
        }

        public async Task<ApiResponse<dynamic>> GetEventListAsync()
        {
            // Retrieve the calendar from the database
            var data = await _context.calendar.Select(x => new
            {
                x.CalId,
                Title = x.Title.ToString(), // Convert enum to string
                x.Description,
                x.Start,
                x.End,
                // Include other properties if needed
            }).ToListAsync();


            var birthday = data.Where(x => x.Title == "Birthday").OrderByDescending(x => x.Start).ToList();
            var holiday = data.Where(x => x.Title == "Holiday").OrderByDescending(x => x.Start).ToList();
            var events = data.Where(x => x.Title == "Event").OrderByDescending(x => x.Start).ToList();
            var meeting = data.Where(x => x.Title == "Meeting").OrderByDescending(x => x.Start).ToList();
            var leave = data.Where(x => x.Title == "Leave").OrderByDescending(x => x.Start).ToList();

            // Return the calendar as JSON
            return new ApiResponse<dynamic>
            {
                IsSuccess = true,
                Message = "Calendar retrieved successfully.",
                Data = new
                {
                    Birthday= birthday,
                    Holiday = holiday,
                    Events = events,
                    Meeting = meeting,
                    Leave = leave
                }
            };
        }

        public async Task<ApiResponse<string>> AddEventAsync(CalendarRequestVM model)
        {
            var calendar = new Calendar
            {
                Title = model.Title,
                Description = model.Description,
                Start = model.Start,
                End = model.End,
                CreatedBy = _currentUserId, // Set the current user ID as the creator
                UpdatedBy = _currentUserId, // Set the current user ID as the updater


            };
            await _context.calendar.AddAsync(calendar); // Use AddAsync for asynchronous operation

            int n = await _context.SaveChangesAsync(); // Use SaveChangesAsync for asynchronous operation
            if (n > 0)
            {
                return new ApiResponse<string>
                {
                    IsSuccess = true,
                    Message = "Calendar saved successfully."
                };
            }

            return new ApiResponse<string>
            {
                IsSuccess = false,
                Message = "Failed to save Calendar."
            };
        }

        public async Task<ApiResponse<string>> UpdateEventAsync(CalendarRequestVM request)
        {
            var calendar = await _context.calendar.FirstOrDefaultAsync(a => a.CalId == request.CalId);
            if (calendar != null)
            {
                var birthVM = await _context.employeeBirthdays.FirstOrDefaultAsync(x => x.calId == calendar.CalId);
                var leaveVM = await _context.employeeLeaveVM.FirstOrDefaultAsync(x => x.calId == calendar.CalId);

                if (birthVM != null || leaveVM != null)
                {
                    return new ApiResponse<string>
                    {
                        IsSuccess = false,
                        Message = "You can't edit this event."
                    };
                }
                calendar.Title = request.Title;
                calendar.Description = request.Description;
                calendar.Start = request.Start;
                calendar.End = request.End;
                calendar.UpdatedBy = _currentUserId;
                calendar.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();
                return new ApiResponse<string>
                {
                    IsSuccess = true,
                    Message = "Calendar updated successfully."
                }; // Return a success response
            }
            return new ApiResponse<string>
            {
                IsSuccess = false,
                Message = "Event not found."
            }; // Return a not found response if the calendar doesn't exist
        }
    }
}
