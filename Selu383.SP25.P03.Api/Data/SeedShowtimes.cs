using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;

public static class SeedShowtimes
{
    public static void Initialize(IServiceProvider serviceProvider)
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
        var today = DateTime.UtcNow.Date;

        var dayOffsets = Enumerable.Range(-30, 38).ToList(); // 30 past to 7 future

        var showtimes = dayOffsets
            .SelectMany(dayOffset =>
            {
                var date = today.AddDays(dayOffset);
                return hallIds.SelectMany(hallId =>
                {
                    int showtimeCount = random.Next(2, 5);
                    return Enumerable.Range(0, showtimeCount).Select(i =>
                    {
                        var movieId = movieIds[random.Next(movieIds.Count)];
                        var startHour = 10 + i * 3;
                        var startTime = date.AddHours(startHour);
                        var endTime = startTime.AddHours(2);
                        var is3D = random.Next(0, 2) == 1;
                        var price = is3D ? 15.00m : 10.00m;

                        return new Showtime
                        {
                            MovieId = movieId,
                            HallId = hallId,
                            StartTime = startTime,
                            EndTime = endTime,
                            TicketPrice = price,
                            Is3D = is3D
                        };
                    });
                });
            })
            .ToList();

        context.Showtimes.AddRange(showtimes);
        context.SaveChanges();

        Console.WriteLine($"✅ Seeded {showtimes.Count} showtimes.");
    }
}
