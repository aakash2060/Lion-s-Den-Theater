using System;
using System.Linq;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Movies;
using Microsoft.EntityFrameworkCore;
namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedShowtimes
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<DataContext>();
                Seed(context);
            }
        }

        private static void Seed(DataContext context)
        {
            if (!context.Set<Showtime>().Any())
            {
                var movies = context.Set<Movie>().ToList();
                var halls = context.Set<Hall>().Include(h => h.Theater).ToList();

                if (!movies.Any() || !halls.Any())
                {
                    return; // Need movies and halls first
                }

                var random = new Random();

                // For each movie, create multiple showtimes
                foreach (var movie in movies)
                {
                    // For the next 7 days
                    for (int day = 0; day < 7; day++)
                    {
                        // Create 3 showtimes per day (morning, afternoon, evening)
                        int[] hours = { 10, 15, 20 };

                        foreach (var hour in hours)
                        {
                            // For each hall or limit to 2 halls per movie
                            foreach (var hall in halls.Take(2))
                            {
                                var showtime = new Showtime
                                {
                                    MovieId = movie.Id,
                                    HallId = hall.Id,
                                    StartTime = DateTime.Now.Date.AddDays(day).AddHours(hour),
                                    TicketPrice = (decimal)(9.99 + (day == 0 || day == 6 ? 2 : 0) + (hour >= 18 ? 1 : 0)),
                                    Is3D = random.Next(10) < 3 // 30% chance of being 3D
                                };

                                // Calculate end time based on movie duration
                                showtime.EndTime = showtime.StartTime.AddMinutes(movie.Duration);

                                context.Set<Showtime>().Add(showtime);
                            }
                        }
                    }
                }

                context.SaveChanges();
            }
        }
    }
}