using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using ClosedXML.Excel;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace CandidateDetails_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,HR")]
    public class CandidateController : ControllerBase
    {
        private readonly ICandidateService _service;
        private readonly ApplicationDbContext _context;
        public CandidateController(ICandidateService service, ApplicationDbContext context)
        {
            _service = service;
            _context = context;
        }

        /// <summary>
        /// To Add candidate in database from excel file  
        /// </summary>
        /// <param name="file">excel file object</param>
        /// <returns>Boolean </returns>
        [HttpPost("AddCandidatesFromExcel")]
        public async Task<IActionResult> AddCandidatesFromExcel([FromForm] AddDataFromExcelRequestVM model)
        {
            try
            {
                if (model.file == null)
                    return BadRequest(new ApiResponse<string> { IsSuccess = false, Message = "File not found" });

                // read a file which will be upload from a form.
                var stream = model.file.OpenReadStream();
                var response = await _service.AddCandidates(stream);// Call the service method to add candidates
                return Ok(response);
            }
            catch (Exception)
            {
                throw;
            }
        }
        /// <summary>
        /// Get the  week data
        /// </summary>
        /// <returns> week data and data count</returns>
        [HttpGet("getWeekAndTodayData")]
        public async Task<IActionResult> getWeekAndTodayData()
        {
            try
            {
                // Get the week data and today data from the database
                var response = await _service.getWeekAndTodayDataAsync(); // Call the stored procedure to get week and today data
                return Ok(new
                {
                    IsSuccess = response.IsSuccess,
                    Message = response.Message,
                    weekData = response.weekData,
                    response.todayData
                }); // Return the data
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Get all candidates from database
        /// </summary>
        /// <returns>List of candidates and count of candidates</returns>
        [HttpGet("GetCandidates")]
        public async Task<IActionResult> GetCandidates(int page = 1, int pageSize = 10, string SearchValue = "")
        {
            try
            {
                var response = await _service.GetCandidatesAsync(page, pageSize, SearchValue); // Call the service method to get candidates
                return Ok(response);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Add or Edit candidate details
        /// </summary>
        /// <param name="candidate">Candidate model object</param>
        /// <returns>boolean</returns>
        [HttpPost("AddEditCandidate")]
        public async Task<IActionResult> AddEditCandidate([FromForm] Candidate candidate)
        {
            try
            {   // Validate the model
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (candidate.cv != null)
                    candidate.cvPath = await _service.UploadCandidateCVAsync(candidate); // Call the service method to upload CV

                // Save candidate details
                var res = await _service.AddEditCandidate(candidate);
                return Ok(res);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Soft delete the candidate
        /// </summary>
        /// <param name="id">Candidate id</param>
        /// <returns>boolean</returns>
        [HttpDelete("DeleteCandidate/{id}")]
        public async Task<IActionResult> DeleteCandidate(int id)
        {
            try
            {
                var res = await _service.deleteCanndidate(id); // Call the service method to delete the candidate
                return Ok(res); // Return the result
            }
            catch (Exception)
            {
                throw;
            }
        }

        ///// <summary>
        ///// To Download the CV of candidate
        ///// </summary>
        ///// <param name="candidateId">Candidate id</param>
        ///// <returns>CV of candidate</returns>
        //[HttpGet("DownloadCV/{candidateId}")]
        //public async Task<IActionResult> DownloadCV(int candidateId)
        //{
        //    // Get the candidate details
        //    var candidate = await _context.candidateDetails.FirstOrDefaultAsync(x => x.id == candidateId);
        //    if (candidate == null || string.IsNullOrEmpty(candidate.cvPath))
        //        return NotFound(new ApiResponse<string> { IsSuccess = false, Message = "Candidate or CV not found." });

        //    string getFileName = Path.GetFileName(candidate.cvPath); // Extract the file name
        //    string getEx = Path.GetExtension(getFileName); // Extract the file extension
        //    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "CandidateCV", getFileName); // Combine the file path

        //    // Check if the file exists
        //    if (!System.IO.File.Exists(filePath))
        //        return NotFound(new ApiResponse<string> { IsSuccess = true, Message = "File not found." });

        //    // Read the file bytes
        //    var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);

        //    // Determine MIME type based on file extension
        //    string mimeType = getEx.ToLower() switch
        //    {
        //        ".pdf" => "application/pdf",
        //        ".doc" => "application/msword",
        //        ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        //        ".jpg" or ".jpeg" => "image/jpeg",
        //        ".png" => "image/png",
        //        ".gif" => "image/gif",
        //        ".txt" => "text/plain",
        //        _ => "application/octet-stream" // Default fallback for unknown file types
        //    };

        //    // Generate a user-friendly file name
        //    var fileName = $"{candidate.name}_CV{getEx}";

        //    // Return the file with appropriate MIME type and file name
        //    return Ok(new
        //    {
        //        IsSuccess = true,
        //        Message = "Candidate CV Downloaded.",
        //        Data = File(fileBytes, mimeType, fileName)
        //    });

        //}


        ///// <summary>
        ///// Get the candidate details by id
        ///// </summary>
        ///// <param name="id">Candidate Id</param>
        ///// <returns>Candidate Data</returns>
        //[HttpGet("GetCandidate/{id}")]
        //public async Task<IActionResult> GetCandidate(int id)
        //{
        //    try
        //    {
        //        var candidate = await _context.candidateDetails.FirstOrDefaultAsync(x => x.id == id); // Get the candidate details
        //        if (candidate == null)
        //            return NotFound(new ApiResponse<string>
        //            {
        //                IsSuccess = true,
        //                Message = "Candidate not found."
        //            });
        //        //var role = await
        //        return Ok(new ApiResponse<Candidate>
        //        {
        //            IsSuccess = true,
        //            Message = "Data Retrieved.",
        //            Data = candidate
        //        }); // Return the candidate details
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}

        [HttpGet("DownloadExcel")]
        public async Task<IActionResult> DownloadExcel()
        {
            try
            {
                var response = await _service.DownloadExcelAsync(); // Call the service method to download candidates data in excel format
                return Ok(response);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

