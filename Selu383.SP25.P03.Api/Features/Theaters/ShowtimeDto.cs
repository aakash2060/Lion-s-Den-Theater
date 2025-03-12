namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class ShowtimeDto
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public string MovieTitle { get; set; }
        public int HallId { get; set; }
        public int HallNumber { get; set; }
        public int TheaterId { get; set; }
        public string TheaterName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal TicketPrice { get; set; }
        public bool Is3D { get; set; }
        public string SpecialEvent { get; set; }
        public int AvailableSeats { get; set; }
    }

    public class ShowtimeDetailDto : ShowtimeDto
    {
        public string MoviePoster { get; set; }
        public int MovieDuration { get; set; }
        public int TotalSeats { get; set; }
        public bool IsSoldOut { get; set; }
    }

    public class CreateShowtimeDto
    {
        public int MovieId { get; set; }
        public int HallId { get; set; }
        public DateTime StartTime { get; set; }
        public decimal TicketPrice { get; set; }
        public bool Is3D { get; set; }
        public string SpecialEvent { get; set; }
    }

    public class UpdateShowtimeDto
    {
        public DateTime StartTime { get; set; }
        public decimal TicketPrice { get; set; }
        public bool Is3D { get; set; }
        public string SpecialEvent { get; set; }
    }
}