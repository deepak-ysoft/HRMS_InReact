﻿namespace CandidateDetails_API.IServices
{
    public interface IEmailService
    {
        public Task<bool> SendEmailAsync(string toEmail, string subject, string body); // Send email
    }
}
