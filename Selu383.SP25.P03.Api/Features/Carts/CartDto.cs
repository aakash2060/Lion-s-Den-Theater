using System.ComponentModel.DataAnnotations;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Features.Cart
{

    public class CartDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public List<CartItemDto> Items { get; set; }
        public List<FoodCartItemDto> FoodItems { get; set; } = new();
    }

    public class CartItemDto
    {
        public int Id { get; set; }
        public int ShowtimeId { get; set; }
        public ShowtimeDetailDto ShowtimeDetails { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public string SelectedSeats { get; internal set; }
    }

    public class AddCartItemDto
    {
        public int ShowtimeId { get; set; }
        public int Quantity { get; set; }
        public List<string> SelectedSeats { get; set; }
        public int HallNumber { get; set; }

    }
    public class UpdateCartItemDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }

    public class AddFoodCartItemDto
    {
        public int FoodItemId { get; set; }
        public int Quantity { get; set; }
    }

    public class FoodCartItemDto
    {
        public int Id { get; set; }
        public int FoodItemId { get; set; }
        public string FoodName { get; set; }
        public string FoodDescription { get; set; }
        public string FoodImageUrl { get; set; }
        public int Quantity { get; set; }
        public float UnitPrice { get; set; }
        public float TotalPrice { get; set; }
    }
}

