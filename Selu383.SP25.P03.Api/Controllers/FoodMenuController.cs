using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Users;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodMenuController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;

        public FoodMenuController(DataContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FoodMenu>>> GetFoodMenus()
        {
            var menus = await _context.FoodMenus
                .Include(m => m.FoodMenuItems)
                .ThenInclude(fm => fm.FoodItem)
                .ToListAsync();

            return Ok(menus);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FoodMenu>> GetFoodMenuById(int id)
        {
            var menu = await _context.FoodMenus
                .Include(m => m.FoodMenuItems)
                .ThenInclude(fm => fm.FoodItem)
                .FirstOrDefaultAsync(m => m.Id == id);

            return menu == null ? NotFound(new { message = "Food menu not found" }) : Ok(menu);
        }

        [HttpPost]
        public async Task<ActionResult<FoodMenu>> CreateFoodMenu([FromBody] FoodMenuDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) || dto.FoodItemIds == null || !dto.FoodItemIds.Any())
            {
                return BadRequest(new { message = "Menu name and at least one food item ID are required." });
            }

            var foodItems = await _context.FoodItems
                .Where(fi => dto.FoodItemIds.Contains(fi.Id))
                .ToListAsync();

            if (foodItems.Count != dto.FoodItemIds.Count)
            {
                return BadRequest(new { message = "One or more provided food item IDs are invalid." });
            }

            var menu = new FoodMenu
            {
                Name = dto.Name,
                FoodMenuItems = foodItems.Select(fi => new FoodMenuItem
                {
                    FoodItemId = fi.Id
                }).ToList()
            };

            _context.FoodMenus.Add(menu);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFoodMenuById), new { id = menu.Id }, menu);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFoodMenu(int id, [FromBody] FoodMenuDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest(new { message = "Menu name and at least one food item ID are required." });
            }

            var menu = await _context.FoodMenus
                .Include(m => m.FoodMenuItems)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (menu == null)
            {
                return NotFound(new { message = "Food menu not found" });
            }

            var foodItems = await _context.FoodItems
                .Where(fi => dto.FoodItemIds.Contains(fi.Id))
                .ToListAsync();

            if (foodItems.Count != dto.FoodItemIds.Count)
            {
                return BadRequest(new { message = "One or more provided food item IDs are invalid." });
            }

            menu.Name = dto.Name;
            menu.FoodMenuItems = foodItems.Select(fi => new FoodMenuItem { FoodItemId = fi.Id }).ToList();

            _context.FoodMenus.Update(menu);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFoodMenu(int id)
        {
            var menu = await _context.FoodMenus.FindAsync(id);
            if (menu == null)
            {
                return NotFound(new { message = "Food menu not found" });
            }

            _context.FoodMenus.Remove(menu);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
