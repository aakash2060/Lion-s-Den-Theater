namespace EmailService
{
    public class Message
    {
        public string[] To { get; }
        public string Subject { get; }
        public string Content { get; }

        public Message(string[] to, string subject, string content)
        {
            To = to ?? throw new ArgumentNullException(nameof(to));
            Subject = subject ?? throw new ArgumentNullException(nameof(subject));
            Content = content ?? throw new ArgumentNullException(nameof(content));
        }
    }
}
