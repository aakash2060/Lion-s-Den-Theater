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
                    new FoodItem { Name = "Nachos with Cheese", Description = "Tortilla chips with cheese", Price = 6.99f, StockQuantity = 30, ImgUrl = "https://www.jocooks.com/wp-content/uploads/2021/02/nacho-cheese-sauce-1-8.jpg" },
                    new FoodItem { Name = "Pretzel with Cheese", Description = "Soft pretzel with cheese", Price = 5.49f, StockQuantity = 15, ImgUrl = "https://www.platingsandpairings.com/wp-content/uploads/2020/01/pretzel-bites-14.jpg" },
                    
                    // Drinks
                    new FoodItem { Name = "Large Soda", Description = "Refreshing soft drink", Price = 4.49f, StockQuantity = 40, ImgUrl = "https://static01.nyt.com/images/2012/09/06/opinion/video-opdoc-neistat-soda/video-opdoc-neistat-soda-articleLarge.jpg" },
                    new FoodItem { Name = "Coffee", Description = "Hot brewed coffee", Price = 2.99f, StockQuantity = 20, ImgUrl = "https://corkframes.com/cdn/shop/articles/Corkframes_Coffee_Guide_520x500_422ebe38-4cfa-42b5-a266-b9bfecabaf30.jpg?v=1734598727" },
                    new FoodItem { Name = "Slushie", Description = "Icy fruit-flavored drink", Price = 4.99f, StockQuantity = 30, ImgUrl = "https://www.savoringthegood.com/wp-content/uploads/2023/05/how-to-make-slushie.-kool-aid-slushie.-.jpg" },

                    // Fast Food
                    new FoodItem { Name = "Hot Dog", Description = "Classic hot dog", Price = 4.99f, StockQuantity = 20, ImgUrl = "https://www.belbrandsfoodservice.com/wp-content/uploads/2018/05/recipe-desktop-merkts-cheesy-hot-dawg.jpg" },
                    new FoodItem { Name = "Burger", Description = "Cheeseburger with lettuce and tomato", Price = 7.99f, StockQuantity = 15, ImgUrl = "https://images.unsplash.com/photo-1551782450-a2132b4ba21d" },
                    new FoodItem { Name = "Corn Dog", Description = "Battered and fried corn dog", Price = 3.99f, StockQuantity = 20, ImgUrl = "https://cdn.apartmenttherapy.info/image/upload/v1591988652/k/Photo/Recipes/2020-06-HT-Corn-Dogs/2020-06-08_AT-K18468.jpg" },
                    new FoodItem { Name = "French Fries", Description = "Golden crispy fries", Price = 3.99f, StockQuantity = 35, ImgUrl = "https://www.inspiredtaste.net/wp-content/uploads/2022/10/Baked-French-Fries-Recipe-1200.jpg" },
                    new FoodItem { Name = "Mozzarella Sticks", Description = "Fried mozzarella cheese sticks", Price = 6.49f, StockQuantity = 20, ImgUrl = "https://www.onionringsandthings.com/wp-content/uploads/2018/07/homemade-mozzarella-sticks-with-marinara-sauce-7-500x500.jpg" },
                    new FoodItem { Name = "Chicken Tenders", Description = "Crispy fried chicken tenders", Price = 7.99f, StockQuantity = 25, ImgUrl = "https://glutenfreecuppatea.co.uk/wp-content/uploads/2020/11/air-fryer-chicken-tenders-recipe-featured.jpg" },

                    // Desserts & Candy
                    new FoodItem { Name = "Ice Cream", Description = "Vanilla or chocolate", Price = 3.99f, StockQuantity = 10, ImgUrl = "https://icecreamfromscratch.com/wp-content/uploads/2022/02/Oreo-Ice-Cream-1.2-735x1103.jpg" },
                    new FoodItem { Name = "Churros", Description = "Warm cinnamon sugar churros", Price = 4.99f, StockQuantity = 18, ImgUrl = "https://i.imgur.com/dw9b1nz.jpg" },
                    new FoodItem { Name = "Brownie", Description = "Chocolate fudge brownie", Price = 3.49f, StockQuantity = 12, ImgUrl = "https://www.stuckonsweet.com/wp-content/uploads/2024/01/Fudge-Brownies-7.jpg" },
                    new FoodItem { Name = "Candy (M&Ms)", Description = "Sweet chocolate candies", Price = 3.99f, StockQuantity = 25, ImgUrl = "https://m.media-amazon.com/images/I/81cGvqG4DKL.jpg" },
                    new FoodItem { Name = "Gummy Bears", Description = "Assorted fruit-flavored gummy bears", Price = 2.99f, StockQuantity = 15, ImgUrl = "https://m.media-amazon.com/images/I/816nlo9PrqL.jpg" },
                    new FoodItem { Name = "Chocolate Bar", Description = "Milk chocolate bar", Price = 3.49f, StockQuantity = 20, ImgUrl = "https://www.candywarehouse.com/cdn/shop/files/hershey-s-milk-chocolate-candy-bars-36-piece-box-candy-warehouse-1_17c6a529-8b44-4d54-a1ba-434faa796dcd.jpg?v=1736551908" },
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
