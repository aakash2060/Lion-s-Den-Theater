using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedHalls
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                if (context.Halls.Any())
                {
                    return;
                }

                var theaters = context.Theaters.ToList();
                if (!theaters.Any())
                {
                    return; // Need theaters first
                }

                var hallsByTheater = new Dictionary<string, (string Name, int Count, int BaseCapacity)>
                {
                    { "Lion's Den New York", ("NYC", 2, 75) },
                    { "Lion's Den New Orleans", ("NOLA", 3, 65) },
                    { "Lion's Den Los Angeles", ("LA", 4, 75) }
                };

                foreach (var theater in theaters)
                {
                    if (hallsByTheater.TryGetValue(theater.Name, out var hallInfo))
                    {
                        // Create halls for each theater based on the config
                        for (int i = 1; i <= hallInfo.Count; i++)
                        {
                            // Assign different screen types based on hall number
                            string screenType = "Standard";
                            if (i == hallInfo.Count) // Last hall in each theater
                            {
                                screenType = "IMAX";
                            }
                            else if (i == hallInfo.Count - 1 && hallInfo.Count > 2) // Second to last hall if there are more than 2
                            {
                                screenType = "3D";
                            }

                            var hall = new Hall
                            {
                                HallNumber = i,
                                TheaterId = theater.Id,
                                Capacity = hallInfo.BaseCapacity + (i * 5),
                                ScreenType = screenType
                            };

                            context.Halls.Add(hall);
                        }
                    }
                }

                context.SaveChanges();
            }
        }
    }
}