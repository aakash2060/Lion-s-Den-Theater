using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Features.Cart
{
    public class AddCartItemDto
    {
        public int ShowtimeId { get; set; }
        public int Quantity { get; set; }
    }

    public class CartDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public List<CartItemDto> Items { get; set; }
    }

    public class CartItemDto
    {
        public int Id { get; set; }
        public int ShowtimeId { get; set; }
        public Showtime Showtime { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
    }
}

