using CandidateDetails_API.Model;
using HRMS.ViewModel.Response;

namespace CandidateDetails_API.IServices
{
    public interface IAccount
    {
        public Task<ApiResponse<string>> Login(Login model);
        public Task<ApiResponse<string>> ChangePasswordAsync(ChangePassword changePasswordVM); // Change password   
    }
}
