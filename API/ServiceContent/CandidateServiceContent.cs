using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using ClosedXML.Excel;
using HRMS.ViewModel.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using OfficeOpenXml;
using System.Buffers;
using System.Data;
using System.Globalization;

namespace CandidateDetails_API.ServiceContent
{
    public class CandidateServiceContent : ICandidateService
    {
        private readonly ApplicationDbContext _context; // Database context
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly int _currentUserId; // Current user ID
        public CandidateServiceContent(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context; // Initialize the database context
            _httpContextAccessor = httpContextAccessor;

            var user = _httpContextAccessor.HttpContext?.User;
            _currentUserId = Convert.ToInt32(user?.FindFirst("empId")?.Value);
        }
        public async Task<ApiResponse<Candidate>> AddEditCandidate(Candidate candidate) // AddEditCandidate method to add or edit candidate
        {

            if (candidate.id == 0) // If candidate id is 0, then add new candidate
            {
                candidate.CreatedBy = _currentUserId; // Set the current user ID as the creator
                candidate.UpdatedBy = _currentUserId; // Set the current user ID as the updater
                await _context.candidateDetails.AddAsync(candidate); // Add candidate to database
            }
            else // If candidate id is not 0, then edit existing candidate
            {
                var existingCandidate = await _context.candidateDetails.FirstOrDefaultAsync(x => x.id == candidate.id); // Get existing candidate by id
                if (existingCandidate == null) // If existing candidate is null 
                {
                    return new ApiResponse<Candidate>
                    {
                        IsSuccess = false,
                        Message = "Candidate not found."
                    };
                }
                var existingEntity = _context.ChangeTracker.Entries<Candidate>().FirstOrDefault(e => e.Entity.id == candidate.id); // Get existing candidate

                if (existingEntity != null) // If existing candidate is not null
                    _context.Entry(existingEntity.Entity).State = EntityState.Detached; // Detach the existing candidate

                if (candidate.cv == null) // If candidate cv is not null
                    candidate.cvPath = existingCandidate.cvPath; // Call the service method to upload CV
                candidate.UpdatedBy = _currentUserId; // Set isDelete to false
                candidate.UpdatedAt = DateTime.Now; // Set the updated date and time
                _context.Entry(candidate).State = EntityState.Modified; // Mark the candidate as modified
            }
            await _context.SaveChangesAsync();

            return new ApiResponse<Candidate>
            {
                IsSuccess = true,
                Message = "Candidate data Saved.",
                Data = candidate
            };
        }

        public async Task<ApiResponse<string>> AddCandidates(Stream fileStream)
        {
            var Candidates = new List<Candidate>();
            int n = 0;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var package = new ExcelPackage(fileStream))
            {
                var worksheet = package.Workbook.Worksheets[0];
                int filledRowCount = 0;

                for (int row = worksheet.Dimension.Start.Row; row <= worksheet.Dimension.End.Row; row++)
                {
                    bool isRowFilled = false;
                    for (int col = worksheet.Dimension.Start.Column; col <= worksheet.Dimension.End.Column; col++)
                    {
                        var cellValue = worksheet.Cells[row, col].Value;
                        if (cellValue != null && !string.IsNullOrWhiteSpace(cellValue.ToString()))
                        {
                            isRowFilled = true;
                            break;
                        }
                    }
                    if (isRowFilled)
                    {
                        filledRowCount++;
                    }
                }

                string[] dateFormats = { "MM/dd/yyyy", "dd-MM-yyyy", "yyyy-MM-dd", "M/d/yyyy", "d-M-yyyy" };

                for (int row = 2; row <= filledRowCount; row++)
                {
                    var candidate = new Candidate();

                    // Parse `date` (column 2)
                    string rawDate = worksheet.Cells[row, 2].Text.Trim();
                    if (!DateTime.TryParseExact(rawDate, dateFormats, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDate))
                    {
                        throw new Exception($"Invalid date format in row {row} (column 2): '{rawDate}'");
                    }
                    candidate.date = parsedDate;

                    // Parse `schedule_Interview` (column 16)
                    try
                    {
                        candidate.schedule_Interview = ConvertExcelDate((double)worksheet.Cells[row, 16].Value);
                    }
                    catch
                    {
                        throw new Exception($"Invalid Excel date format in row {row} (column 16): '{worksheet.Cells[row, 16].Text}'");
                    }

                    candidate.name = worksheet.Cells[row, 3].Text;
                    candidate.contact_No = worksheet.Cells[row, 4].Text;
                    candidate.linkedin_Profile = worksheet.Cells[row, 5].Text;
                    candidate.email_ID = worksheet.Cells[row, 6].Text;
                    candidate.roles = worksheet.Cells[row, 7].Text;
                    candidate.experience = worksheet.Cells[row, 8].Text;
                    candidate.skills = worksheet.Cells[row, 9].Text;

                    if (!decimal.TryParse(worksheet.Cells[row, 10].Text, out decimal ctc))
                        throw new Exception($"Invalid decimal format for CTC in row {row}: '{worksheet.Cells[row, 10].Text}'");
                    candidate.ctc = ctc;

                    if (!decimal.TryParse(worksheet.Cells[row, 11].Text, out decimal etc))
                        throw new Exception($"Invalid decimal format for ETC in row {row}: '{worksheet.Cells[row, 11].Text}'");
                    candidate.etc = etc;

                    candidate.notice_Period = worksheet.Cells[row, 12].Text;
                    candidate.current_Location = worksheet.Cells[row, 13].Text;
                    candidate.prefer_Location = worksheet.Cells[row, 14].Text;
                    candidate.reason_For_Job_Change = worksheet.Cells[row, 15].Text;
                    candidate.schedule_Interview_status = worksheet.Cells[row, 17].Text;
                    candidate.comments = worksheet.Cells[row, 18].Text;
                    candidate.cvPath = worksheet.Cells[row, 19].Text;
                    candidate.CreatedBy = _currentUserId;
                    candidate.UpdatedBy = _currentUserId; // Set the current user ID as the updater

                    if (double.TryParse(candidate.contact_No, out double number))
                    {
                        candidate.contact_No = number.ToString("F0", CultureInfo.InvariantCulture);
                    }

                    Candidates.Add(candidate);
                }
            }

            await _context.candidateDetails.AddRangeAsync(Candidates);
            n = await _context.SaveChangesAsync();
            if (n == 0) // If no record is updated
                return new ApiResponse<string>
                {
                    IsSuccess = false,
                    Message = "Candidate data not Saved."

                };

            return new ApiResponse<string>
            {
                IsSuccess = true,
                Message = "Candidate data Saved."
            };
        }

        public static DateTime ConvertExcelDate(double excelDate)
        {
            // Excel uses January 1, 1900, as the base date
            DateTime baseDate = new DateTime(1900, 1, 1);

            // Excel incorrectly considers 1900 as a leap year, so adjust dates >= March 1, 1900
            if (excelDate >= 60)
            {
                excelDate -= 1; // Adjust for the Excel leap year bug
            }

            // Add the number of days (including fractional time) to the base date
            return baseDate.AddDays(excelDate - 1);
        }

        public async Task<ApiResponse<string>> deleteCanndidate(int id)  // deleteCanndidate method to delete candidate
        {
            var candidate = await _context.candidateDetails.Where(x => x.id == id).FirstOrDefaultAsync(); // Get candidate by id
            new ApiResponse<string>
            {
                IsSuccess = false,
                Message = "Candidate not found."
            };

            candidate.IsDeleted = true;
            candidate.UpdatedBy = _currentUserId; // Set the current user ID as the updater
            _context.Entry(candidate).State = EntityState.Modified; // Mark the candidate as modified
            var res = await _context.SaveChangesAsync();

            if (res == 0) // If no record is updated
                return new ApiResponse<string>
                {
                    IsSuccess = false,
                    Message = "Candidate deletion failed."
                };
            return new ApiResponse<string>
            {
                IsSuccess = true,
                Message = "Candidate deleted Successfully."
            };
        }

        public async Task<dynamic> getWeekAndTodayDataAsync()
        {
            var weekData = await _context.candidateDetails.OrderByDescending(x => x.schedule_Interview)
                    .Where(x => x.schedule_Interview <= DateTime.Now.AddDays(+8) && x.schedule_Interview >= DateTime.Now.AddHours(+12) && !x.IsDeleted)
                    .ToListAsync(); // Get the  week data

            var todayData = await _context.candidateDetails.OrderByDescending(x => x.schedule_Interview)
                .Where(x => x.schedule_Interview <= DateTime.Now.AddHours(+12) && x.schedule_Interview >= DateTime.Now && !x.IsDeleted)
                .ToListAsync(); // Get the  week data

            return new
            {
                IsSuccess = true,
                Message = "Week and Today's data retrieved successfully.",
                weekData = weekData,
                todayData = todayData
            };
        }

        public async Task<dynamic> GetCandidatesAsync(int page, int pageSize, string SearchValue)
        {
            // Define the SQL output parameter
            var totalRecordsParam = new SqlParameter("@TotalRecords", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            // Define SQL parameters for the stored procedure
            var parameters = new[]
            {
                    new SqlParameter("@PageNumber", SqlDbType.Int) { Value = page },
                    new SqlParameter("@PageSize", SqlDbType.Int) { Value = pageSize },
                    new SqlParameter("@SearchValue", SqlDbType.NVarChar, 255) { Value = (object)SearchValue ?? DBNull.Value },
                    totalRecordsParam
                };

            // Call the stored procedure using FromSqlRaw
            var candidates = await _context.candidateDetails
                .FromSqlRaw("EXEC usp_GetAllcandidate @PageNumber, @PageSize, @SearchValue,@TotalRecords OUT", parameters)
                .ToListAsync();

            int totalRecords = (int)totalRecordsParam.Value;

            return new
            {
                IsSuccess = true,
                Message = "Data retrieved successfully.",
                Data = candidates,
                totalCount = totalRecords
            };
        }

        public async Task<string> UploadCandidateCVAsync(Candidate candidate)
        {
            // Save the CV file
            var CandidateCV = Path.Combine(Directory.GetCurrentDirectory(), "CandidateCV");
            if (!Directory.Exists(CandidateCV))
            {
                Directory.CreateDirectory(CandidateCV);
            }
            string beforeAt = candidate.email_ID.Split('@')[0]; // Get the email ID before '@'
            string fileName = $"{candidate.name}_Email_{beforeAt}{Path.GetExtension(candidate.cv.FileName)}"; // Generate a unique file name
            var filePath = Path.Combine(CandidateCV, fileName); // Combine the file path

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await candidate.cv.CopyToAsync(stream);
            }
            return fileName; // Return the file name
        }

        public async Task<ApiResponse<dynamic>> DownloadExcelAsync()
        {
            using (var workbook = new XLWorkbook())
            {
                // Add a worksheet
                var worksheet = workbook.Worksheets.Add("Candidate Details");

                // Add headers
                worksheet.Cell(1, 1).Value = "ID";
                worksheet.Cell(1, 2).Value = "Date";
                worksheet.Cell(1, 3).Value = "Name";
                worksheet.Cell(1, 4).Value = "Contact No";
                worksheet.Cell(1, 5).Value = "LinkedIn Profile";
                worksheet.Cell(1, 6).Value = "Email ID";
                worksheet.Cell(1, 7).Value = "Role";
                worksheet.Cell(1, 8).Value = "Experience";
                worksheet.Cell(1, 9).Value = "Skills";
                worksheet.Cell(1, 10).Value = "CTC";
                worksheet.Cell(1, 11).Value = "ETC";
                worksheet.Cell(1, 12).Value = "Notice Period";
                worksheet.Cell(1, 13).Value = "Current Location";
                worksheet.Cell(1, 14).Value = "Preferred Location";
                worksheet.Cell(1, 15).Value = "Reason for Job Change";
                worksheet.Cell(1, 16).Value = "Schedule Interview";
                worksheet.Cell(1, 17).Value = "Interview Status";
                worksheet.Cell(1, 18).Value = "Comments";
                worksheet.Cell(1, 19).Value = "cvPath";

                // Retrieve data from the database
                var candidates = await _context.candidateDetails
                    .
                    Select(x => new
                    {
                        x.id,
                        x.date,
                        x.name,
                        x.contact_No,
                        x.linkedin_Profile,
                        x.email_ID,
                        x.roles,
                        x.experience,
                        x.skills,
                        x.ctc,
                        x.etc,
                        x.notice_Period,
                        x.current_Location,
                        x.prefer_Location,
                        x.reason_For_Job_Change,
                        x.schedule_Interview,
                        x.schedule_Interview_status,
                        x.comments,
                        x.cvPath
                    }).ToListAsync();

                // Add data rows
                int row = 2; // Start from the second row
                foreach (var candidate in candidates)
                {
                    worksheet.Cell(row, 1).Value = candidate?.id;
                    worksheet.Cell(row, 2).Value = candidate?.date.ToString("yyyy-MM-dd");
                    worksheet.Cell(row, 3).Value = candidate?.name;
                    worksheet.Cell(row, 4).Value = candidate?.contact_No;
                    worksheet.Cell(row, 5).Value = candidate?.linkedin_Profile;
                    worksheet.Cell(row, 6).Value = candidate?.email_ID;
                    worksheet.Cell(row, 7).Value = candidate?.roles;
                    worksheet.Cell(row, 8).Value = candidate?.experience;
                    worksheet.Cell(row, 9).Value = candidate?.skills;
                    worksheet.Cell(row, 10).Value = candidate?.ctc;
                    worksheet.Cell(row, 11).Value = candidate?.etc;
                    worksheet.Cell(row, 12).Value = candidate?.notice_Period;
                    worksheet.Cell(row, 13).Value = candidate?.current_Location;
                    worksheet.Cell(row, 14).Value = candidate?.prefer_Location;
                    worksheet.Cell(row, 15).Value = candidate?.reason_For_Job_Change;
                    worksheet.Cell(row, 16).Value = candidate?.schedule_Interview?.ToString("MM/dd/yyyy hh:mm tt");
                    worksheet.Cell(row, 17).Value = candidate?.schedule_Interview_status;
                    worksheet.Cell(row, 18).Value = candidate?.comments;
                    worksheet.Cell(row, 19).Value = candidate?.cvPath;
                    row++;
                }

                // Adjust column widths
                worksheet.Columns().AdjustToContents();

                // Save the workbook to a memory stream
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    stream.Seek(0, SeekOrigin.Begin);
                    if (stream.Length == 0)
                    {
                        return new ApiResponse<dynamic>
                        {
                            IsSuccess = false,
                            Message = "No data found to export."
                        };
                    }
                    // Return the file as a response
                    return new ApiResponse<dynamic>
                    {
                        IsSuccess = true,
                        Message = "Excel file downloaded.",
                        Data = new FileContentResult(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                        {
                            FileDownloadName = "CandidateDetails.xlsx"
                        }
                    };
                }
            }
        }
    }
}
