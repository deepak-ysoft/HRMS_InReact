using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using HRMS.ViewModel.Response;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CandidateDetails_API.ServiceContent
{
    public class AuthServiceContent : IAuthService
    {
        private readonly string _jwtKey;
        private readonly string _jwtIssuer;

        public AuthServiceContent(IConfiguration configuration)
        {
            _jwtKey = configuration["JwtSettings:SecretKey"];
            _jwtIssuer = configuration["JwtSettings:Issuer"];
        }

        // Generate Jwt Token by emp id
        public async Task<string> GenerateJwtToken(EmployeeDetailsResponseVM emp, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtKey);
            var claims = new[]
                {
                    new Claim("empId", emp.empId.ToString()),
                    new Claim("empName", emp.empName),
                    new Claim(ClaimTypes.Email, emp.empEmail),
                    new Claim(ClaimTypes.Role, emp.Role.ToString())
                };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddHours(10),
                Issuer = _jwtIssuer,
                Audience = _jwtIssuer,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
