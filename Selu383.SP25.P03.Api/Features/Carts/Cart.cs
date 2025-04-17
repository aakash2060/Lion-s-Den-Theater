using System.ComponentModel.DataAnnotations;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Features.Cart
{
    public class Cart
    {
        public int Id { get; set; }
        [Required] public int UserId { get; set; }
        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }

    public class CartItem
    {
        public int Id { get; set; }
        [Required] public int ShowtimeId { get; set; }
        [Required] public int Quantity { get; set; }
        [Required] public decimal TotalPrice { get; set; }
        public Showtime Showtime { get; set; }
    }
}

