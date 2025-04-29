﻿using CandidateDetails_API.IServices;
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
        public async Task<string> GenerateJwtToken(string empId, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, empId),
            new Claim(ClaimTypes.Role, role) // Add role claim
        }),
                Expires = DateTime.UtcNow.AddHours(10),
                Issuer = _jwtIssuer,
                Audience = _jwtIssuer,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
