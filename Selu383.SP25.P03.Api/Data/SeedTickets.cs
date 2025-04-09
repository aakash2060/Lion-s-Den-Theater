using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;

public static class SeedTickets
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>());

        if (context.Tickets.Any())
        {
            return;
        }

        var showtimeIds = context.Showtimes.Select(s => s.Id).ToList();
        var userIds = context.Users.Select(u => u.Id).ToList(); // assumes Users are seeded

        if (!showtimeIds.Any() || !userIds.Any())
        {
            Console.WriteLine("❌ No showtimes or users found. Cannot seed tickets.");
            return;
        }

        var random = new Random();
        var tickets = new List<Ticket>();

        var today = DateTime.UtcNow.Date;

        // Create tickets from 30 days ago up to today
        for (int dayOffset = -30; dayOffset <= 0; dayOffset++)
        {
            var purchaseDate = today.AddDays(dayOffset);
            var ticketsToday = random.Next(3, 12); // Random number of tickets per day

            for (int i = 0; i < ticketsToday; i++)
            {
                var showtimeId = showtimeIds[random.Next(showtimeIds.Count)];
                var userId = userIds[random.Next(userIds.Count)];
                var seat = $"{(char)('A' + random.Next(0, 5))}{random.Next(1, 15)}";
                var price = random.Next(1, 3) == 1 ? 10.00m : 15.00m;
                var ticketType = price == 10.00m ? "Standard" : "VIP";
                var confirmation = $"TICKET{random.Next(1000, 9999)}";

                tickets.Add(new Ticket
                {
                    ShowtimeId = showtimeId,
                    UserId = userId,
                    PurchaseDate = purchaseDate.AddHours(random.Next(8, 20)), // 8AM–8PM
                    SeatNumber = seat,
                    Price = price,
                    TicketType = ticketType,
                    ConfirmationNumber = confirmation
                });
            }
        }

        context.Tickets.AddRange(tickets);
        context.SaveChanges();

        Console.WriteLine($"✅ Seeded {tickets.Count} tickets across 30 days.");
    }
}