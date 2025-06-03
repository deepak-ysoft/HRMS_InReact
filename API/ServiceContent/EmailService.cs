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
                    smtpClient.EnableSsl = false; // Ensure this is correct based on your SMTP server requirements
                    smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(_smtpSettings.FromEmail),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true
                    };
                    mailMessage.To.Add(toEmail);

                    await smtpClient.SendMailAsync(mailMessage);
                    return true; // Email sent successfully
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

    }
}
