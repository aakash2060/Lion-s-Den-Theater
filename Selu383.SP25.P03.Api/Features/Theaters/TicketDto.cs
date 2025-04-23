namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class TicketDto
    {
        public int Id { get; set; }
        public int ShowtimeId { get; set; }
        public int UserId { get; set; }
        public DateTime PurchaseDate { get; set; }
        public string SeatNumber { get; set; }
        public decimal Price { get; set; }
        public bool IsCheckedIn { get; set; }
        public string TicketType { get; set; }
        public string ConfirmationNumber { get; set; }
        public string MovieTitle { get; set; }
        public string TheaterName { get; set; }
        public int HallNumber { get; set; }
        public DateTime ShowtimeStart { get; set; }
    }

    public class TicketDetailDto : TicketDto
    {
        public string MoviePoster { get; set; }
        public DateTime ShowtimeEnd { get; set; }
        public bool Is3D { get; set; }
        public string SpecialEvent { get; set; }
    }

    public class PurchaseTicketDto
    {
        public int ShowtimeId { get; set; }
        public string SeatNumber { get; set; }
        public string TicketType { get; set; } = "Adult";
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
}
