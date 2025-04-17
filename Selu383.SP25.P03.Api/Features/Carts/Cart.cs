using System.ComponentModel.DataAnnotations;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Features.Cart
{
    public class Cart
    {
        public int Id { get; set; }
        [Required] public int UserId { get; set; }
        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
        public ICollection<FoodCartItem> FoodItems { get; set; } = new List<FoodCartItem>();

    }

    public class CartItem
    {
        public int Id { get; set; }
        [Required] public int ShowtimeId { get; set; }
        [Required] public int Quantity { get; set; }
        [Required] public decimal TotalPrice { get; set; }
        public Showtime Showtime { get; set; }
    }
    public class FoodCartItem
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public Cart Cart { get; set; }
        public int FoodItemId { get; set; }
        public FoodItem FoodItem { get; set; }
        public int Quantity { get; set; }
        public float TotalPrice { get; set; } 
    }
}

