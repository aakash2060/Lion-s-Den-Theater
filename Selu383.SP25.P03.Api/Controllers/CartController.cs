using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Cart;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly DataContext _context;

        public CartController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("{userId}/add")]
        public async Task<IActionResult> AddToCart(int userId, [FromBody] AddCartItemDto addCartItemDto)
        {
            // Retrieve or create the cart for the user
            var cart = await _context.Carts.Include(c => c.Items).FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                _context.Carts.Add(cart);
            }

            // Validate the showtime
            var showtime = await _context.Showtimes.FindAsync(addCartItemDto.ShowtimeId);
            if (showtime == null)
            {
                return NotFound("Showtime not found.");
            }

            // Add the cart item
            var cartItem = new CartItem
            {
                ShowtimeId = addCartItemDto.ShowtimeId,
                Quantity = addCartItemDto.Quantity,
                TotalPrice = addCartItemDto.Quantity * showtime.TicketPrice,
                Showtime = showtime
            };

            cart.Items.Add(cartItem);
            await _context.SaveChangesAsync();

            return Ok(cart);
        }

        [HttpDelete("{userId}/remove/{cartItemId}")]
        public async Task<IActionResult> RemoveFromCart(int userId, int cartItemId)
        {
            // Retrieve the cart for the user
            var cart = await _context.Carts.Include(c => c.Items).FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null)
            {
                return NotFound("Cart not found.");
            }

            // Find the cart item
            var cartItem = cart.Items.FirstOrDefault(i => i.Id == cartItemId);
            if (cartItem == null)
            {
                return NotFound("Cart item not found.");
            }

            // Remove the cart item
            cart.Items.Remove(cartItem);
            await _context.SaveChangesAsync();

            return Ok(cart);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            // Retrieve the cart for the user
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Showtime)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound("Cart not found.");
            }

            // Map the cart to a DTO
            var cartDto = new CartDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                Items = cart.Items.Select(i => new CartItemDto
                {
                    Id = i.Id,
                    ShowtimeId = i.ShowtimeId,
                    ShowtimeDetails = $"{i.Showtime.Movie.Title} at {i.Showtime.StartTime}",
                    Quantity = i.Quantity,
                    TotalPrice = i.TotalPrice
                }).ToList()
            };

            return Ok(cartDto);
        }
    }
}
