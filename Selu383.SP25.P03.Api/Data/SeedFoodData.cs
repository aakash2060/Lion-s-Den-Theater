using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedFoodData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<DataContext>();
            Seed(context);
        }

        private static void Seed(DataContext context)
        {
            if (!context.FoodItems.Any())
            {
                var foodItems = new List<FoodItem>
                {
                    // Popcorn & Snacks
                    new FoodItem { Name = "Popcorn", Description = "Classic buttery popcorn", Price = 5.99f, StockQuantity = 50, ImgUrl = "https://www.momjunction.com/wp-content/uploads/2015/05/Ranch-Style-Popcorn.jpg" },
                    new FoodItem { Name = "Nachos with Cheese", Description = "Tortilla chips with cheese", Price = 6.99f, StockQuantity = 30, ImgUrl = "https://www.momjunction.com/wp-content/uploads/2015/05/Ranch-Style-Popcorn.jpg" },
                    new FoodItem { Name = "Pretzel with Cheese", Description = "Soft pretzel with cheese", Price = 5.49f, StockQuantity = 15, ImgUrl = "https://www.platingsandpairings.com/wp-content/uploads/2020/01/pretzel-bites-14.jpg" },
                    
                    // Drinks
                    new FoodItem { Name = "Large Soda", Description = "Refreshing soft drink", Price = 4.49f, StockQuantity = 40, ImgUrl = "https://static01.nyt.com/images/2012/09/06/opinion/video-opdoc-neistat-soda/video-opdoc-neistat-soda-articleLarge.jpg" },
                    new FoodItem { Name = "Coffee", Description = "Hot brewed coffee", Price = 2.99f, StockQuantity = 20, ImgUrl = "https://images.unsplash.com/photo-1498804103079-a6351b050096" },
                    new FoodItem { Name = "Slushie", Description = "Icy fruit-flavored drink", Price = 4.99f, StockQuantity = 30, ImgUrl = "https://images.unsplash.com/photo-1622794818187-79a1b93911c2" },

                    // Fast Food
                    new FoodItem { Name = "Hot Dog", Description = "Classic hot dog", Price = 4.99f, StockQuantity = 20, ImgUrl = "https://images.unsplash.com/photo-1571091718767-18b5b1457dd1" },
                    new FoodItem { Name = "Burger", Description = "Cheeseburger with lettuce and tomato", Price = 7.99f, StockQuantity = 15, ImgUrl = "https://images.unsplash.com/photo-1551782450-a2132b4ba21d" },
                    new FoodItem { Name = "Corn Dog", Description = "Battered and fried corn dog", Price = 3.99f, StockQuantity = 20, ImgUrl = "https://upload.wikimedia.org/wikipedia/commons/4/4a/CornDog.jpg" },
                    new FoodItem { Name = "French Fries", Description = "Golden crispy fries", Price = 3.99f, StockQuantity = 35, ImgUrl = "https://images.unsplash.com/photo-1576108930902-b6d1d481b4d6" },
                    new FoodItem { Name = "Mozzarella Sticks", Description = "Fried mozzarella cheese sticks", Price = 6.49f, StockQuantity = 20, ImgUrl = "https://upload.wikimedia.org/wikipedia/commons/1/14/Mozzarella_Sticks.jpg" },
                    new FoodItem { Name = "Chicken Tenders", Description = "Crispy fried chicken tenders", Price = 7.99f, StockQuantity = 25, ImgUrl = "https://images.unsplash.com/photo-1606755962775-3e041e7f5d83" },

                    // Desserts & Candy
                    new FoodItem { Name = "Ice Cream", Description = "Vanilla or chocolate", Price = 3.99f, StockQuantity = 10, ImgUrl = "https://images.unsplash.com/photo-1579954115545-2584ec59d9ae" },
                    new FoodItem { Name = "Churros", Description = "Warm cinnamon sugar churros", Price = 4.99f, StockQuantity = 18, ImgUrl = "https://upload.wikimedia.org/wikipedia/commons/9/93/ChurrosMadrid.jpg" },
                    new FoodItem { Name = "Brownie", Description = "Chocolate fudge brownie", Price = 3.49f, StockQuantity = 12, ImgUrl = "https://images.unsplash.com/photo-1601919050519-7cc0c8d2a883" },
                    new FoodItem { Name = "Candy (M&Ms)", Description = "Sweet chocolate candies", Price = 3.99f, StockQuantity = 25, ImgUrl = "https://images.unsplash.com/photo-1547499417-373c915b4dc5" },
                    new FoodItem { Name = "Gummy Bears", Description = "Assorted fruit-flavored gummy bears", Price = 2.99f, StockQuantity = 15, ImgUrl = "https://images.unsplash.com/photo-1518013431117-eb1465fa5752" },
                    new FoodItem { Name = "Chocolate Bar", Description = "Milk chocolate bar", Price = 3.49f, StockQuantity = 20, ImgUrl = "https://images.unsplash.com/photo-1534422298393-a01665a84fab" },
                };
                context.FoodItems.AddRange(foodItems);
                context.SaveChanges();
            }

            if (!context.FoodMenus.Any())
            {
                var foodItemLookup = context.FoodItems.ToList();

                var foodMenus = new List<FoodMenu>
                {
                    new FoodMenu
                    {
                        Name = "Snacks",
                        FoodMenuItems = foodItemLookup
                            .Where(fi => fi.Name == "Popcorn" || fi.Name == "Nachos with Cheese" || fi.Name == "Pretzel with Cheese")
                            .Select(fi => new FoodMenuItem { FoodItemId = fi.Id })
                            .ToList()
                    },
                    new FoodMenu
                    {
                        Name = "Drinks",
                        FoodMenuItems = foodItemLookup
                            .Where(fi => fi.Name == "Large Soda" || fi.Name == "Coffee" || fi.Name == "Slushie")
                            .Select(fi => new FoodMenuItem { FoodItemId = fi.Id })
                            .ToList()
                    },
                    new FoodMenu
                    {
                        Name = "Fast Food",
                        FoodMenuItems = foodItemLookup
                            .Where(fi => fi.Name == "Hot Dog" || fi.Name == "Burger" || fi.Name == "Corn Dog" ||
                                         fi.Name == "French Fries" || fi.Name == "Mozzarella Sticks" || fi.Name == "Chicken Tenders")
                            .Select(fi => new FoodMenuItem { FoodItemId = fi.Id })
                            .ToList()
                    },
                    new FoodMenu
                    {
                        Name = "Desserts & Candy",
                        FoodMenuItems = foodItemLookup
                            .Where(fi => fi.Name == "Ice Cream" || fi.Name == "Churros" || fi.Name == "Brownie" ||
                                         fi.Name == "Candy (M&Ms)" || fi.Name == "Gummy Bears" || fi.Name == "Chocolate Bar")
                            .Select(fi => new FoodMenuItem { FoodItemId = fi.Id })
                            .ToList()
                    }
                };

                context.FoodMenus.AddRange(foodMenus);
                context.SaveChanges();
            }
        }
    }
}
