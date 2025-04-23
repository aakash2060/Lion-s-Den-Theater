using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Cart;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;
using Microsoft.AspNetCore.Identity;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;

        public CartController(DataContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/cart/{userId}
        [HttpGet("{userId}")]
        public async Task<ActionResult<CartDto>> GetCart(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Showtime)
                    .ThenInclude(s => s.Movie)
                .Include(c => c.Items)
                    .ThenInclude(i => i.Showtime)
                    .ThenInclude(s => s.Hall)
                    .ThenInclude(h => h.Theater)
                .Include(c => c.FoodItems)
                    .ThenInclude(f => f.FoodItem)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                // Create a new cart if one doesn't exist
                cart = new Cart { UserId = userId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            var cartDto = new CartDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                Items = cart.Items.Select(i => new CartItemDto
                {
                    Id = i.Id,
                    ShowtimeId = i.ShowtimeId,
                    ShowtimeDetails = new ShowtimeDetailDto
                    {
                        MovieTitle = i.Showtime.Movie.Title,
                        MoviePoster = i.Showtime.Movie.PosterUrl,
                        StartTime = i.Showtime.StartTime,
                        Is3D = i.Showtime.Is3D,
                        TheaterName = i.Showtime.Hall.Theater.Name,
                        HallNumber = i.Showtime.Hall.HallNumber
                    },
                    Quantity = i.Quantity,
                    TotalPrice = i.TotalPrice,
                    SelectedSeats = i.SelectedSeats, // Use the SelectedSeats array directly
                }).ToList(),
                FoodItems = cart.FoodItems.Select(f => new FoodCartItemDto
                {
                    Id = f.Id,
                    FoodItemId = f.FoodItemId,
                    FoodName = f.FoodItem.Name,
                    FoodDescription = f.FoodItem.Description,
                    FoodImageUrl = f.FoodItem.ImgUrl,
                    Quantity = f.Quantity,
                    UnitPrice = f.FoodItem.Price,
                    TotalPrice = f.TotalPrice
                }).ToList()
            };

            return Ok(cartDto);
        }

        // POST: api/cart/{userId}/add
        [HttpPost("{userId}/add")]
        public async Task<ActionResult<CartDto>> AddToCart(int userId, AddCartItemDto addCartItemDto)
        {
            var cart = await GetOrCreateCart(userId);
            var showtime = await _context.Set<Showtime>()
                .FirstOrDefaultAsync(s => s.Id == addCartItemDto.ShowtimeId);

            if (showtime == null)
            {
                return NotFound(new { message = "Showtime not found" });
            }

            // Check if the item already exists in the cart
            var existingItem = cart.Items.FirstOrDefault(i => i.ShowtimeId == addCartItemDto.ShowtimeId);

            // Get the ticket price from the TicketPrice property
            decimal ticketPrice = showtime.TicketPrice;

            if (existingItem != null)
            {
                // Update existing item quantity
                existingItem.Quantity += addCartItemDto.Quantity;
                existingItem.TotalPrice = ticketPrice * existingItem.Quantity;
            }
            else
            {
                // Add new item
                var cartItem = new CartItem
                {
                    ShowtimeId = addCartItemDto.ShowtimeId,
                    Quantity = addCartItemDto.Quantity,
                    TotalPrice = ticketPrice * addCartItemDto.Quantity,
                    SelectedSeats = string.Join(",", addCartItemDto.SelectedSeats),
                    HallNumber = addCartItemDto.HallNumber
                };

                cart.Items.Add(cartItem);
            }

            await _context.SaveChangesAsync();

            return await GetCart(userId);
        }

        // POST: api/cart/{userId}/addFood
        [HttpPost("{userId}/addFood")]
        public async Task<ActionResult<CartDto>> AddFoodToCart(int userId, AddFoodCartItemDto addFoodCartItemDto)
        {
            var cart = await GetOrCreateCart(userId);
            var foodItem = await _context.FoodItems.FindAsync(addFoodCartItemDto.FoodItemId);

            if (foodItem == null)
            {
                return NotFound(new { message = "Food item not found" });
            }

            // Check if the food item already exists in the cart
            var existingItem = cart.FoodItems.FirstOrDefault(i => i.FoodItemId == addFoodCartItemDto.FoodItemId);

            if (existingItem != null)
            {
                // Update existing item quantity
                existingItem.Quantity += addFoodCartItemDto.Quantity;
                existingItem.TotalPrice = foodItem.Price * existingItem.Quantity;
            }
            else
            {
                // Add new food item
                var foodCartItem = new FoodCartItem
                {
                    CartId = cart.Id,
                    FoodItemId = addFoodCartItemDto.FoodItemId,
                    Quantity = addFoodCartItemDto.Quantity,
                    TotalPrice = foodItem.Price * addFoodCartItemDto.Quantity,
                    FoodItem = foodItem
                };

                cart.FoodItems.Add(foodCartItem);
            }

            await _context.SaveChangesAsync();

            return await GetCart(userId);
        }

        // DELETE: api/cart/{userId}/remove/{cartItemId}
        [HttpDelete("{userId}/remove/{cartItemId}")]
        public async Task<ActionResult<CartDto>> RemoveFromCart(int userId, int cartItemId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound(new { message = "Cart not found" });
            }

            var cartItem = cart.Items.FirstOrDefault(i => i.Id == cartItemId);
            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found" });
            }

            cart.Items.Remove(cartItem);
            await _context.SaveChangesAsync();

            return await GetCart(userId);
        }

        // DELETE: api/cart/{userId}/removeFood/{foodCartItemId}
        [HttpDelete("{userId}/removeFood/{foodCartItemId}")]
        public async Task<ActionResult<CartDto>> RemoveFoodFromCart(int userId, int foodCartItemId)
        {
            var cart = await _context.Carts
                .Include(c => c.FoodItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound(new { message = "Cart not found" });
            }

            var foodCartItem = cart.FoodItems.FirstOrDefault(i => i.Id == foodCartItemId);
            if (foodCartItem == null)
            {
                return NotFound(new { message = "Food cart item not found" });
            }

            cart.FoodItems.Remove(foodCartItem);
            await _context.SaveChangesAsync();

            return await GetCart(userId);
        }

        // PUT: api/cart/{userId}/update/{cartItemId}
        [HttpPut("{userId}/update/{cartItemId}")]
        public async Task<ActionResult<CartDto>> UpdateCartItemQuantity(int userId, int cartItemId, [FromBody] UpdateCartItemDto updateCartItemDto)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Showtime)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound(new { message = "Cart not found" });
            }

            var cartItem = cart.Items.FirstOrDefault(i => i.Id == cartItemId);
            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found" });
            }

            // Update quantity and recalculate price
            cartItem.Quantity = updateCartItemDto.Quantity;

            // Use TicketPrice instead of Price
            cartItem.TotalPrice = cartItem.Showtime.TicketPrice * cartItem.Quantity;

            await _context.SaveChangesAsync();

            return await GetCart(userId);
        }

        // DELETE: api/cart/{userId}/clear
        [HttpDelete("{userId}/clear")]
        public async Task<ActionResult> ClearCart(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .Include(c => c.FoodItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound(new { message = "Cart not found" });
            }

            cart.Items.Clear();
            cart.FoodItems.Clear();
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<Cart> GetOrCreateCart(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .Include(c => c.FoodItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            return cart;
        }

        private string FormatShowtimeDetails(Showtime showtime)
        {
            if (showtime == null) return "Unknown Showtime";

            var movie = _context.Set<Movie>().FirstOrDefault(m => m.Id == showtime.MovieId);
            var hall = _context.Set<Hall>().FirstOrDefault(h => h.Id == showtime.HallId);
            var theater = hall != null ? _context.Set<Theater>().FirstOrDefault(t => t.Id == hall.TheaterId) : null;

            string movieTitle = movie?.Title ?? "Unknown Movie";
            string theaterName = theater?.Name ?? "Unknown Theater";
            string hallNumber = hall?.HallNumber.ToString() ?? "Unknown Hall";
            string format = showtime.Is3D ? "3D" : "2D";
            string date = showtime.StartTime.ToShortDateString();
            string time = showtime.StartTime.ToShortTimeString();

            return $"{movieTitle} at {theaterName} (Hall {hallNumber}) - {date} {time} ({format})";
        }
    }
}