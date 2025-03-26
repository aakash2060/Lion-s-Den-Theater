using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace EmailService
{
    public class EmailSender : IEmailSender
    {
        private readonly EmailConfiguration _emailSettings;

        public EmailSender(IOptions<EmailConfiguration> emailSettings)
        {
            _emailSettings = emailSettings.Value ?? throw new ArgumentNullException(nameof(emailSettings));
        }

        public async Task SendEmailAsync(Message message)
        {
            using var client = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.Port)
            {
                Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password),
                EnableSsl = _emailSettings.UseSSL
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
                Subject = message.Subject,
                Body = message.Content,
                IsBodyHtml = true
            };

            foreach (var recipient in message.To)
            {
                mailMessage.To.Add(recipient);
            }

            try
            {
                await client.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Error sending email.", ex);
            }
        }
    }
}
