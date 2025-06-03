using CandidateDetails_API.Model;

namespace CandidateDetails_API.IServices
{
    public interface IAuthService
    {
       public Task<string> GenerateJwtToken(Employee emp, string role);
    }
}
