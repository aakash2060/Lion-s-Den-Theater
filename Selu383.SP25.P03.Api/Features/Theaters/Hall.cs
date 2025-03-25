namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class Hall
    {
        public int Id { get; set; }
        public int HallNumber { get; set; }
        public int TheaterId { get; set; }
        public int Capacity { get; set; }
        public string ScreenType { get; set; } // imax, 3s, or standard
        public Theater Theater { get; set; }
        public ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
    }
}
