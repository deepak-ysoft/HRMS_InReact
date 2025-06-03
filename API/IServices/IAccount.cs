using CandidateDetails_API.Model;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;

namespace CandidateDetails_API.IServices
{
    public interface IAccount
    {
        public Task<ApiResponse<Employee>> Login(Login model);
        public Task<ApiResponse<string>> ChangePasswordAsync(ChangePassword changePasswordVM); // Change password   
    }
}
