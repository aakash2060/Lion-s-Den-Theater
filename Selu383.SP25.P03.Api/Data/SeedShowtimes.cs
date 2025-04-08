using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;

public static class SeedShowtimes
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>());

        if (context.Showtimes.Any())
        {
            return;
        }

        var movieIds = context.Movies.Select(m => m.Id).ToList();
        var hallIds = context.Halls.Select(h => h.Id).ToList();

        if (!movieIds.Any() || !hallIds.Any())
        {
            Console.WriteLine("❌ Cannot seed showtimes. Ensure movies and halls are seeded.");
            return;
        }

        var random = new Random();
        var showtimes = new List<Showtime>();

        var today = DateTime.UtcNow.Date;

        // Generate showtimes from 30 days ago to 7 days in the future
        foreach (var dayOffset in Enumerable.Range(-30, 38)) // 30 past + today + 7 future
        {
            var currentDate = today.AddDays(dayOffset);

            foreach (var hallId in hallIds)
            {
                // 2–4 showtimes per hall per day
                int showtimeCount = random.Next(2, 5);

                for (int i = 0; i < showtimeCount; i++)
                {
                    var movieId = movieIds[random.Next(movieIds.Count)];
                    var startHour = 10 + i * 3; // 10 AM, 1 PM, 4 PM, etc.
                    var startTime = currentDate.AddHours(startHour);
                    var endTime = startTime.AddHours(2);
                    var is3D = random.Next(0, 2) == 1;
                    var price = is3D ? 15.00m : 10.00m;

                    showtimes.Add(new Showtime
                    {
                        MovieId = movieId,
                        HallId = hallId,
                        StartTime = startTime,
                        EndTime = endTime,
                        TicketPrice = price,
                        Is3D = is3D
                    });
                }
            }
        }

        context.Showtimes.AddRange(showtimes);
        context.SaveChanges();

        Console.WriteLine($"✅ Seeded {showtimes.Count} showtimes.");
    }
}