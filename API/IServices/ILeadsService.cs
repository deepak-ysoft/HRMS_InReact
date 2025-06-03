using CandidateDetails_API.Model;
using HRMS.ViewModel.Response;

namespace CandidateDetails_API.IServices
{
    public interface ILeadsService
    {
        public Task<dynamic> GetAllLeads(int page, int pageSize, string SearchValue); // GetAllLeads method to get all leads
        public Task<ApiResponse<string>> AddLeads(Stream fileStream); // AddLeadss method to add leads from excel file
        public Task<ApiResponse<Leads>> AddEditLeads(Leads lead); // AddEditLeads method to add or edit lead
        public Task<ApiResponse<string>> deleteLeads(int id); // deleteCanndidate method to delete lead
    }
}
