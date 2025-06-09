using CandidateDetails_API.IServices;
using HRMS.ViewModel.Request;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace CandidateDetails_API.ServiceContent
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;
        public EmailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }
        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                using (var smtpClient = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port))
                {
                    smtpClient.Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password);
                    smtpClient.EnableSsl = true; // ✅ Required for Gmail
                    smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                    smtpClient.UseDefaultCredentials = false; // ✅ Avoid using system credentials

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(_smtpSettings.FromEmail, _smtpSettings.Username),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true
                    };

                    mailMessage.To.Add(toEmail);

                    await smtpClient.SendMailAsync(mailMessage);
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SendEmailAsync Error: {ex.Message}");
                return false;
            }
        }
    }
}
