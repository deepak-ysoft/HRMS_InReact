using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using CandidateDetails_API.Models;
using DocumentFormat.OpenXml.Spreadsheet;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using static iText.IO.Image.Jpeg2000ImageData;
using static PdfSharp.Capabilities.Features;

namespace CandidateDetails_API.ServiceContent
{
    public class EmployeeServiceContent : IEmployee
    {
        private readonly IWebHostEnvironment _env;
        private readonly ApplicationDbContext _context; // Create an instance of the database context

        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly int _currentUserId; // Current user ID
        public EmployeeServiceContent(ApplicationDbContext context, IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _env = env;
            _httpContextAccessor = httpContextAccessor;

            var user = _httpContextAccessor.HttpContext?.User;
            _currentUserId = Convert.ToInt32(user?.FindFirst("empId")?.Value);

        }

        public async Task<dynamic> GetEmployees(int page, int pageSize, string SearchValue) // Get all employees
        {
            var query = _context.Employees
            .Where(x => x.IsDeleted == false)
            .AsQueryable();

            if (!string.IsNullOrEmpty(SearchValue))
            {
                string searchTerm = SearchValue.ToLower();

                query = query.Where(c =>
                    c.empName.ToLower().Contains(searchTerm) ||
                    c.empEmail.ToLower().Contains(searchTerm) ||
                    c.empNumber.ToLower().Contains(searchTerm) ||
                    c.empExperience.ToLower().Contains(searchTerm));
            }

            var totalCount = query.Count();

            var list = await query
                .Select(x => new EmployeeResponseVM
                {
                    empId = x.empId,
                    empName = x.empName,
                    empEmail = x.empEmail,
                    empNumber = x.empNumber,
                    empDateOfBirth = x.empDateOfBirth,
                    empGender = x.empGender.ToString(),
                    empJobTitle = x.empJobTitle,
                    empExperience = x.empExperience,
                    empDateofJoining = x.empDateofJoining,
                    empAddress = x.empAddress,
                    ImagePath = x.ImagePath,
                    Role = x.Role.ToString(),
                    isActive = x.isActive
                })
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new
            {
                TotalCount = totalCount,
                List = list
            };
        }
        public async Task<List<Employee>> GetRequestedEmployees() // Get all employees
        {
            var list = await _context.Employees.Where(x => x.IsDeleted == false && x.isActive == false).ToListAsync(); // Get all employees from the database
            return list;
        }


        public async Task<Employee> GetUserByEmailAsync(string email) // Get user by email
        {
            var user = await _context.Employees.FirstOrDefaultAsync(x => x.empEmail == email && !x.IsDeleted); // Find the user by email
            return user;
        }
        public async Task<Employee> GetUserByResetTokenAsync(string token)
        {
            // Fetch the user based on the reset token and check if the token is still valid
            return await _context.Employees.FirstOrDefaultAsync(u => u.ResetToken == token && u.ResetTokenExpiration > DateTime.Now);
        }

        public async Task UpdateUserAsync(Employee user)
        {
            _context.Employees.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<ApiResponse<Employee>> AddEmployee(Employee employee) // Add an employee
        {
            string fileName = employee.Photo?.FileName != null ? UploadUserPhoto(employee.Photo, "images/employee") : "Default.jpg";
            var hasher = new PasswordHasher<Employee>();
            employee.ImagePath = fileName;
            if (employee.Role == UserRoles.Admin)
                employee.isActive = true;
            else
                employee.isActive = false;

            employee.empPassword = hasher.HashPassword(employee, employee.empPassword);
            employee.CreatedBy = _currentUserId;
            employee.UpdatedBy = _currentUserId;

            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();

            string des = $"{employee.empName} birthday";
            var calendar = new Calendar
            {
                Title = CalendarTitle.Birthday,
                Description = des,
                Start = employee.empDateOfBirth,
                End = employee.empDateOfBirth,
                CreatedBy = _currentUserId, // Set the current user ID as the creator
                UpdatedBy = _currentUserId, // Set the current user ID as the updater
            };
            await _context.calendar.AddAsync(calendar);
            await _context.SaveChangesAsync();

            var empBirthday = new EmployeeBirthday
            {
                calId = calendar.CalId,
                empId = employee.empId,
            };
            await _context.employeeBirthdays.AddAsync(empBirthday);
            int res = await _context.SaveChangesAsync();

            if (res > 0)
                return new ApiResponse<Employee>
                {
                    IsSuccess = true,
                    Message = "Employee Added Successfully.",
                    Data = employee
                };
            return new ApiResponse<Employee>
            {
                IsSuccess = false,
                Message = "Addition failed.",
                Data = employee
            };
        }

        public async Task<ApiResponse<Employee>> UpdateEmployee(EmployeeEditRequestVM employee) // Update an employee
        {
            var emailExists = await _context.Employees.AnyAsync(u => u.empEmail.ToLower() == employee.empEmail.ToLower() && u.empId != employee.empId); // To check duplicate emails.
            if (emailExists)
                return new ApiResponse<Employee> { IsSuccess = false, Message = "Duplicate Email", Data = null };

            var previousEmp = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(x => x.empId == employee.empId);
            if (previousEmp == null)
                return new ApiResponse<Employee>
                {
                    IsSuccess = false,
                    Message = "Employee not found",
                    Data = previousEmp
                };

            string fileName = employee.Photo?.FileName != null
                ? UploadUserPhoto(employee.Photo, "images/employee")
                : previousEmp.ImagePath;

            if (employee.Photo?.FileName != null)
                await DeleteUserImageAsync(previousEmp, "images/employee");

            previousEmp.empName = employee.empName;
            previousEmp.empGender = employee.empGender;
            previousEmp.empNumber = employee.empNumber;
            previousEmp.empAddress = employee.empAddress;
            previousEmp.empDateOfBirth = employee.empDateOfBirth;
            previousEmp.Role = employee.Role;
            previousEmp.empDateofJoining = employee.empDateofJoining;
            previousEmp.empJobTitle = employee.empJobTitle;
            previousEmp.empExperience = employee.empExperience;

            previousEmp.ImagePath = fileName;
            previousEmp.isActive = true;
            previousEmp.UpdatedBy = _currentUserId;
            previousEmp.UpdatedAt = DateTime.Now;

            _context.Employees.Update(previousEmp);
            await _context.SaveChangesAsync();
            var empBirth = await _context.employeeBirthdays.FirstOrDefaultAsync(x => x.empId == employee.empId);
            if (empBirth != null)
            {
                var cal = await _context.calendar.FirstOrDefaultAsync(x => x.CalId == empBirth.calId);
                if (cal != null)
                {
                    cal.Start = employee.empDateOfBirth;
                    cal.End = employee.empDateOfBirth;
                    cal.UpdatedBy = _currentUserId;
                    cal.UpdatedAt = DateTime.Now; // Update the UpdatedAt field
                    _context.calendar.Update(cal);
                    return new ApiResponse<Employee>
                    {
                        IsSuccess = true,
                        Message = "Employee Updated Succassfully.",
                        Data = previousEmp
                    };
                }
                else
                {
                    string des = $"{employee.empName} birthday";
                    var calendar = new Calendar
                    {
                        Title = CalendarTitle.Birthday,
                        Description = des,
                        Start = employee.empDateOfBirth,
                        End = employee.empDateOfBirth,
                        CreatedBy = _currentUserId, // Set the current user ID as the creator
                        UpdatedBy = _currentUserId, // Set the current user ID as the updater
                    };
                    await _context.calendar.AddAsync(calendar);

                    if (await _context.SaveChangesAsync() > 0)
                    {
                        var empBirthday = new EmployeeBirthday
                        {
                            calId = calendar.CalId,
                            empId = employee.empId,
                        };
                        await _context.employeeBirthdays.AddAsync(empBirthday);
                        int res = await _context.SaveChangesAsync();
                        if (res > 0)
                            return new ApiResponse<Employee>
                            {
                                IsSuccess = true,
                                Message = "Employee Updated Succassfully.",
                                Data = previousEmp
                            };
                    }
                }
            }
            return new ApiResponse<Employee>
            {
                IsSuccess = false,
                Message = "Updation failed.",
                Data = previousEmp
            };
        }

        //uploads/images/employee
        // To upload user image when user select image
        private string UploadUserPhoto(IFormFile photo, string path)
        {
            if (photo == null || photo.Length == 0)
            { return null; }
            string shortGuid = Guid.NewGuid().ToString().Substring(0, 8);
            string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            string originalName = Path.GetFileNameWithoutExtension(photo.FileName);

            // Shorten the original name if it’s longer than 10 characters
            string shortenedName = originalName.Length > 10 ? originalName.Substring(0, 10) : originalName;

            string folder = Path.Combine(_env.ContentRootPath, "uploads/", path);
            string fileName = $"{shortGuid}_{timestamp}_{shortenedName}{Path.GetExtension(photo.FileName)}";
            string filePath = Path.Combine(folder, fileName);
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                photo.CopyTo(fileStream);
            }
            return Path.Combine("uploads/", path, fileName);
        }
        public async Task DeleteUserImageAsync(Employee emp, string path) // Marked as async
        {
            var defaultPath = "Default.jpg";
            string fileName = Path.GetFileName(emp.ImagePath);
            var filePath = Path.Combine(_env.ContentRootPath + "\\uploads\\", path, fileName ?? string.Empty); // Combine paths

            // Check if the employee exists and the file path is not the default image
            if (emp != null && fileName != defaultPath && File.Exists(filePath))
            {
                File.Delete(filePath); // Delete the file
                await _context.SaveChangesAsync(); // Use async version of SaveChanges
            }
        }

        public async Task<Employee> GetEmployeeById(int id) // Get an employee by ID
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(x => x.empId == id && !x.IsDeleted); // Find the employee by ID
            return employee; // Return the employee
        }


        public async Task<ApiResponse<string>> DeleteEmployee(int id) // Delete an employee
        {
            var employee = await _context.Employees.FindAsync(id); // Find the employee by ID
            
            if (employee == null)
                new ApiResponse<string>
                {
                    IsSuccess = false,
                    Message = "Employee not Found."
                };
            var existingEntity = _context.ChangeTracker.Entries<Candidate>().FirstOrDefault(e => e.Entity.id == employee.empId); // Get existing employee

            if (existingEntity != null)     // If existing employee is not null
            {
                _context.Entry(existingEntity.Entity).State = EntityState.Detached; // Detach the existing employee
            }
            employee.IsDeleted = true;
            employee.isActive = false;
            _context.Employees.Update(employee); // Remove the employee
            int result = await _context.SaveChangesAsync();
            if (result > 0)
                return new ApiResponse<string>
                {
                    IsSuccess = true,
                    Message = "Employee Deleted Successfully."
                };
            return new ApiResponse<string>
            {
                IsSuccess = false,
                Message = "Employee Deletion faled."
            };
        }

        public async Task<dynamic> GetEmployeeAssets(int empId, int page) // Get all assets of an employee
        {
            var data = await _context.EmployeeAssets.Where(x => x.EmpId == empId && !x.IsDeleted).ToListAsync(); // Get all assets of an employee
            var totalCount = data.Count();
            const int pageSize = 10;
            var pagedAssets = data
                 .Skip((page - 1) * pageSize)
                 .Take(pageSize)
                 .ToList();

            return new { pagedAssets, totalCount };
        }

        public async Task<bool> AddUpdateEmployeeAssets(EmployeeAssetsResponseVM employeeAsset)
        {
            var img = "";
            if (employeeAsset.Image != null)
                img = UploadUserPhoto(employeeAsset.Image, "images/Assets");
            if (employeeAsset.AssetId == 0)
            {
                var assets = new EmployeeAsset()
                {
                    AssetName = employeeAsset.AssetName,
                    Description = employeeAsset.Description,
                    ImagePath = img,
                    EmpId = employeeAsset.EmpId,
                    CreatedBy = _currentUserId,
                    UpdatedBy = _currentUserId,
                };
                _context.EmployeeAssets.Add(assets);
                return await _context.SaveChangesAsync() > 0;
            }
            else
            {
                var assets = await _context.EmployeeAssets.FindAsync(employeeAsset.AssetId);
                assets.AssetName = employeeAsset.AssetName;
                assets.Description = employeeAsset.Description;
                assets.UpdatedBy = _currentUserId;
                assets.UpdatedAt = DateTime.Now; // Update the UpdatedAt field
                if (img != "")
                    assets.ImagePath = img;
                assets.ImagePath = assets.ImagePath;

                _context.EmployeeAssets.Update(assets);
                return await _context.SaveChangesAsync() > 0;
            }
        }

        public async Task<bool> DeleteEmployeeAssets(int assetId)
        {
            var employeeAsset = await _context.EmployeeAssets.FirstOrDefaultAsync(x => x.AssetId == assetId);
            if (employeeAsset != null)
            {
                employeeAsset.IsDeleted = true; // Mark the asset as deleted
                _context.EmployeeAssets.Update(employeeAsset);
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
        }
    }
}
