using MimeKit;
using System.Collections.Generic;
using System.Linq;

namespace EmailService
{
    public class Message
    {
        public List<MailboxAddress> To { get; }
        public string Subject { get; }
        public string Content { get; }

        public Message(IEnumerable<string> to, string subject, string content)
        {
            To = to.Select(email => new MailboxAddress(email, email)).ToList();
            Subject = subject;
            Content = content;
        }
    }
}
