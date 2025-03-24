using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Reviews;
using System.Drawing;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodMenuController : ControllerBase
    {
        private readonly DataContext _context;

        public FoodMenuController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FoodMenu>>> GetFoodMenus()
        {
            return await _context.FoodMenus.Include(m => m.FoodMenuItems)
                .ThenInclude(fm => fm.FoodItem)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FoodMenu>> GetFoodMenuById(int id)
        {
            var menu = await _context.Set<FoodMenu>()
                .Include(x => x.FoodMenuItems)
                .Where(x => x.Id == id)
                .Select(m => new FoodMenu
                {
                    Id = m.Id,
                    Name = m.Name,
                    FoodMenuItems = m.FoodMenuItems
                }).FirstOrDefaultAsync();

            if (menu == null)
            {
                return NotFound();
            }

            return Ok(menu);
        }

        [HttpPost]
        public async Task<ActionResult<FoodMenu>> CreateFoodMenu([FromBody] FoodMenu menu)
        {
            _context.FoodMenus.Add(menu);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetFoodMenus), new {id = menu.Id}, menu);
        }

        // PUT api/<FoodMenuController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<FoodMenuController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
