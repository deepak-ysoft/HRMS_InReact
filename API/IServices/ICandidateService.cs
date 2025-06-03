using CandidateDetails_API.Model;
using HRMS.ViewModel.Response;
using Microsoft.EntityFrameworkCore;

namespace CandidateDetails_API.IServices
{
    public interface ICandidateService
    {

        public Task<dynamic> getWeekAndTodayDataAsync(); // getWeekAndTodayDataAsync method to get weekly and today's data
        public Task<dynamic> GetCandidatesAsync(int page, int pageSize, string SearchValue); // GetCandidatesAsync method to get candidates data
        public Task<ApiResponse<string>> AddCandidates(Stream fileStream); // AddCandidates method to add candidates from excel file
        public Task<string> UploadCandidateCVAsync(Candidate candidate); // UploadCV method to upload candidate's CV
        public Task<ApiResponse<dynamic>> DownloadExcelAsync(); // DownloadExcel method to download candidates data in excel format
        public Task<ApiResponse<Candidate>> AddEditCandidate(Candidate candidate); // AddEditCandidate method to add or edit candidate
        public Task<ApiResponse<string>> deleteCanndidate(int id); // deleteCanndidate method to delete candidate
    }
}
