using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace CandidateDetails_API.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,HR")]
    [ApiController]
    public class LeadsController : ControllerBase
    {
        private readonly ILeadsService _service;
        private readonly ApplicationDbContext _context; // Database context
        public LeadsController(ILeadsService service, ApplicationDbContext context)
        {
            _service = service;
            _context = context;
        }


        [HttpGet("GetLeads")]
        public async Task<IActionResult> GetCandidates(int page = 1, int pageSize = 10, string SearchValue = "")
        {
            try
            {
                var response = await _service.GetAllLeads(page, pageSize, SearchValue); // Call the service method to get leads
                return Ok(response);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost("AddLeadsFromExcel")]
        public async Task<IActionResult> AddLeadsFromExcel(AddDataFromExcelRequestVM model)
        {
            try
            {
                if (model.file == null)
                    return BadRequest("File not found");

                using var stream = model.file.OpenReadStream();
                var result = await _service.AddLeads(stream);

                return Ok(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost("AddEditLeads")]
        public async Task<IActionResult> AddEditLeads([FromForm] Leads leads)
        {
            try
            {   // Validate the model
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Save leads details
                var res = await _service.AddEditLeads(leads);
                return Ok(res);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpDelete("DeleteLeads/{id}")]
        public async Task<IActionResult> DeleteLead(int id)
        {
            try
            {
                var res = await _service.deleteLeads(id); // Call the service method to delete the lead
                return Ok(res); // Return the result
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
