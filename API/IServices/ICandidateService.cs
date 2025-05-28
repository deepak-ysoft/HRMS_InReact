using CandidateDetails_API.Model;
using HRMS.ViewModel.Response;

namespace CandidateDetails_API.IServices
{
    public interface ICandidateService
    {
        public Task<ApiResponse<string>> AddCandidates(Stream fileStream); // AddCandidates method to add candidates from excel file
        public Task<ApiResponse<Candidate>> AddEditCandidate(Candidate candidate); // AddEditCandidate method to add or edit candidate
        public Task<List<Candidate>> GetCandidates(); // GetCandidates method to get all candidates
        public Task<ApiResponse<string>> deleteCanndidate(int id); // deleteCanndidate method to delete candidate

    }
}
