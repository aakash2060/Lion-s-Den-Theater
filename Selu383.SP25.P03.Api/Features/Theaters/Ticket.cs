using System.ComponentModel.DataAnnotations;
using Selu383.SP25.P03.Api.Features.Users;
//using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class Ticket
    {
        public int Id { get; set; }
        public int ShowtimeId { get; set; }
        //public string UserId { get; set; }
        [Required] public DateTime PurchaseDate { get; set; }
        public string SeatNumber { get; set; }
        [Required] public decimal Price { get; set; }
        public bool IsChkeckedIn {  get; set; }
        public string TicketType { get; set; } // adult or child
        public string ConfirmationNumber { get; set; }
        public Showtime Showtime { get; set; }
        public bool IsCheckedIn { get; internal set; }
        public User User { get; set; }
        //public Movie PosterUrl { get; set; }





    }
}
