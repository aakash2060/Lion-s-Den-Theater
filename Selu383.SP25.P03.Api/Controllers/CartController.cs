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
            if (addCartItemDto.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0.");
            }

            var cart = await _context.Carts.Include(c => c.Items).FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                _context.Carts.Add(cart);
            }

            var showtime = await _context.Showtimes.Include(s => s.Movie).FirstOrDefaultAsync(s => s.Id == addCartItemDto.ShowtimeId);
            if (showtime == null)
            {
                return NotFound("Showtime not found.");
            }

            var existingCartItem = cart.Items.FirstOrDefault(i => i.ShowtimeId == addCartItemDto.ShowtimeId);
            if (existingCartItem != null)
            {
                existingCartItem.Quantity += addCartItemDto.Quantity;
                existingCartItem.TotalPrice += addCartItemDto.Quantity * showtime.TicketPrice;
            }
            else
            {
                var cartItem = new CartItem
                {
                    ShowtimeId = addCartItemDto.ShowtimeId,
                    Quantity = addCartItemDto.Quantity,
                    TotalPrice = addCartItemDto.Quantity * showtime.TicketPrice,
                    Showtime = showtime
                };
                cart.Items.Add(cartItem);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, "An error occurred while saving changes.");
            }

            return Ok(MapToDto(cart));
        }

        [HttpDelete("{userId}/remove/{cartItemId}")]
        public async Task<IActionResult> RemoveFromCart(int userId, int cartItemId)
        {
            var cart = await _context.Carts
         .Include(c => c.Items)
         .ThenInclude(i => i.Showtime)
         .ThenInclude(s => s.Movie)   
         .FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null)
            {
                return NotFound("Cart not found.");
            }

            var cartItem = cart.Items.FirstOrDefault(i => i.Id == cartItemId);
            if (cartItem == null)
            {
                return NotFound("Cart item not found.");
            }

            cart.Items.Remove(cartItem);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, "An error occurred while saving changes.");
            }

            return Ok(MapToDto(cart));
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Showtime)
                .ThenInclude(s => s.Movie)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound("Cart not found.");
            }

            return Ok(MapToDto(cart));
        }

        private CartDto MapToDto(Cart cart)
        {
            return new CartDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                Items = cart.Items.Select(i => new CartItemDto
                {
                    Id = i.Id,
                    ShowtimeId = i.ShowtimeId,
                    Showtime = i.Showtime,
                    Quantity = i.Quantity,
                    TotalPrice = i.TotalPrice
                }).ToList()
            };
        }
    }
}
