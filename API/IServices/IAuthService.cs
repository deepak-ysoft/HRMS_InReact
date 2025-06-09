using CandidateDetails_API.Model;
using HRMS.ViewModel.Response;

namespace CandidateDetails_API.IServices
{
    public interface IAuthService
    {
       public Task<string> GenerateJwtToken(EmployeeResponseVM emp, string role);
    }
}
