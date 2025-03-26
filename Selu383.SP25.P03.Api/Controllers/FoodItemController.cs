using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Users;
using System.Reflection.Metadata.Ecma335;


namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodItemController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;

        public FoodItemController(DataContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FoodItem>>> GetFoodItems()
        {
            var menus = await _context.FoodItems.ToListAsync();
            return Ok(menus);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FoodItem>> GetFoodItemById(int id)
        {
            return await _context.FoodItems.FirstOrDefaultAsync(i => i.Id == id) is { } menu ? Ok(menu) : NotFound();
        }

        [HttpPost]
        public async Task<ActionResult<FoodItem>> CreateFoodItem([FromBody] FoodItem item)
        {
            if (item == null || string.IsNullOrWhiteSpace(item.Name))
            {
                return BadRequest(new { message = "Menu name is required" });
            }

            var existingItem = await _context.FoodItems.AnyAsync(i => i.Name == item.Name);
            if (existingItem)
            {
                return Conflict(new { message = "A item with this name already exists" });
            }

            _context.FoodItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFoodItemById), new { id = item.Id }, item);
        }

        // PUT api/<FoodItemController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<FoodItem>> UpdateFoodItem(int id, [FromBody] FoodItem item)
        {
            if (item == null || string.IsNullOrWhiteSpace(item.Name))
            {
                return BadRequest(new { message = "Menu name is required" });
            }

            var existingItem = await _context.FoodItems.FirstOrDefaultAsync(i => i.Id == id);
            if (existingItem == null) { return NotFound(new { message = "Food item not found" }); }

            existingItem.Name = item.Name;
            existingItem.Description = item.Description;
            existingItem.Price = item.Price;
            existingItem.StockQuantity = item.StockQuantity;
            existingItem.ImgUrl = item.ImgUrl;

            _context.FoodItems.Update(existingItem);
            await _context.SaveChangesAsync();

            return Ok(existingItem);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFoodItem(int id)
        {
            var item = await _context.FoodItems.FindAsync(id);
            if (item == null) { return NotFound(new { message = "Item not found" }); }

            _context.FoodItems.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
