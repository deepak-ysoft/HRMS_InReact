using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using HRMS.ViewModel.Response;
using iText.Layout.Properties;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System.Globalization;

namespace CandidateDetails_API.ServiceContent
{

    public class LeadsServiceContent : ILeadsService
    {
        private readonly ApplicationDbContext _context; // Database context
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly int _currentUserId; // Current user ID
        public LeadsServiceContent(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context; // Initialize the database context
            _httpContextAccessor = httpContextAccessor;

            var user = _httpContextAccessor.HttpContext?.User;
            _currentUserId = Convert.ToInt32(user?.FindFirst("empId")?.Value);
        }

        public async Task<ApiResponse<string>> AddLeads(Stream fileStream)
        {
            var leads = new List<Leads>();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial; // Required for EPPlus

            using (var package = new ExcelPackage(fileStream)) // Open the excel file
            {
                var worksheet = package.Workbook.Worksheets[0]; // First sheet
                int filledRowCount = 0;

                // Count filled rows
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

                // Define acceptable date formats
                string[] dateFormats = { "MM/dd/yyyy", "dd-MM-yyyy", "yyyy-MM-dd", "M/d/yyyy", "d-M-yyyy" };

                // Loop through rows starting from row 2
                for (int row = 2; row <= filledRowCount; row++)
                {
                    var lead = new Leads();

                    // Try parsing date safely
                    string rawDate = worksheet.Cells[row, 1].Text.Trim();
                    if (!DateTime.TryParseExact(rawDate, dateFormats, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDate))
                    {
                        throw new Exception($"Invalid date format in row {row}: '{rawDate}'");
                    }

                    lead.DateTime = parsedDate;
                    lead.LinkedInProfile = worksheet.Cells[row, 3].Text;
                    lead.Post = worksheet.Cells[row, 4].Text;
                    lead.Email = worksheet.Cells[row, 5].Text;
                    lead.Number = worksheet.Cells[row, 6].Text;
                    lead.Remarks = worksheet.Cells[row, 7].Text;
                    lead.CreatedBy = _currentUserId; // Set created by user ID
                    lead.UpdatedBy = _currentUserId; // Set updated by user ID

                    // Clean up number format if needed
                    if (double.TryParse(lead.Number, out double number))
                    {
                        lead.Number = number.ToString("F0", CultureInfo.InvariantCulture);
                    }

                    leads.Add(lead);
                }
            }
            await _context.leads.AddRangeAsync(leads); // Save to DB

            int result = await _context.SaveChangesAsync();
            if (result > 0)
                return new ApiResponse<string>
                {
                    IsSuccess = true,
                    Message = "Data Saved Successfully."
                };

            return new ApiResponse<string>
            {
                IsSuccess = true,
                Message = "Failed To Save Data."
            };
        }


        public async Task<ApiResponse<Leads>> AddEditLeads(Leads lead)
        {
            int res = 0;
            if (lead.LeadsId == 0 || lead.LeadsId == null) // If leads id is 0, then add new leads
            {
                lead.CreatedBy = _currentUserId; // Set created by user ID
                lead.UpdatedBy = _currentUserId;
                await _context.leads.AddAsync(lead); // Add leads to database
                res = await _context.SaveChangesAsync();
            }
            else // If leads id is not 0, then edit existing leads
            {
                var existingEntity = _context.ChangeTracker.Entries<Candidate>().FirstOrDefault(e => e.Entity.id == lead.LeadsId); // Get existing leads

                if (existingEntity != null) // If existing leads is not null
                {
                    _context.Entry(existingEntity.Entity).State = EntityState.Detached; // Detach the existing leads
                }

                lead.UpdatedBy = _currentUserId; // Set updated by user ID
                lead.UpdatedAt = DateTime.Now; // Set updated at field
                _context.Entry(lead).State = EntityState.Modified; // Mark the leads as modified
                res = await _context.SaveChangesAsync();
            }
            if (res > 0)
                return new ApiResponse<Leads>
                {
                    IsSuccess = true,
                    Message = "Data Saved Successfully.",
                    Data = lead
                };

            return new ApiResponse<Leads>
            {
                IsSuccess = true,
                Message = "Failed To Save Data.",
                Data = lead
            };
        }

        public async Task<ApiResponse<string>> deleteLeads(int id)
        {
            var leads = await _context.leads.Where(x => x.LeadsId == id).FirstOrDefaultAsync(); // Get leads by id
            if (leads == null) // If leads is null
            {
                return new ApiResponse<string>
                {
                    IsSuccess = false,
                    Message = "Leads not found."
                };
            }

            leads.IsDeleted = true;

            var existingEntity = _context.ChangeTracker.Entries<Leads>().FirstOrDefault(e => e.Entity.LeadsId == leads.LeadsId); // Get existing leads

            if (existingEntity != null)     // If existing leads is not null
            {
                _context.Entry(existingEntity.Entity).State = EntityState.Detached; // Detach the existing leads
            }
            _context.Entry(leads).State = EntityState.Modified; // Mark the leads as modified
            var result = await _context.SaveChangesAsync();
            if (result > 0)
                return new ApiResponse<string>
                {
                    IsSuccess = true,
                    Message = "Data Deleted Successfully."
                };

            return new ApiResponse<string>
            {
                IsSuccess = true,
                Message = "Failed To Delete Data."
            };
        }

        public async Task<dynamic> GetAllLeads(int page, int pageSize, string SearchValue)
        {
            var query = _context.leads.Where(x => !x.IsDeleted).AsQueryable();

            // Apply search filter if SearchValue is provided
            if (!string.IsNullOrEmpty(SearchValue))
            {
                // Use Contains for case-insensitive search across multiple fields
                query = query.Where(x => x.Post.Contains(SearchValue) ||
                x.Email.Contains(SearchValue) ||
                x.Number.Contains(SearchValue));
            }
            var result = await query.ToListAsync();
            // Get total records count
            int totalRecords = query.Count();

            // Apply pagination
            var leads = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new { IsSuccess = true, Data = leads, totalCount = totalRecords };
        }
    }
}
