using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedTheaters
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                if (context.Theaters.Any())
                {
                    return;
                }
                context.Theaters.AddRange(
                    new Theater
                    {
                        Name = "Lion's Den New York",
                        Address = "570 2nd Ave, New York, NY 10016",
                        SeatCount = 150
                    },
                    new Theater
                    {
                        Name = "Lion's Den New Orleans",
                        Address = "636 N Broad St, New Orleans, LA 70119",
                        SeatCount = 200
                    },
                    new Theater
                    {
                        Name = "Lion's Den Los Angeles",
                        Address = "4020 Marlton Ave, Los Angeles, CA 90008",
                        SeatCount = 300
                    }
                );
                context.SaveChanges();
            }
        }
    }
}
