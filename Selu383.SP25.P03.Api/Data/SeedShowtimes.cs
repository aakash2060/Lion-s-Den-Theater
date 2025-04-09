using System;
using System.Linq;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Movies;
using Microsoft.EntityFrameworkCore;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedShowtimes
    {
        public static async Task  Initialize(IServiceProvider serviceProvider)
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

                // Common movie showing times
                TimeSpan[] commonTimes = {
                    new TimeSpan(10, 0, 0),  // 10:00 AM
                    new TimeSpan(15, 0, 0),  // 3:00 PM
                    new TimeSpan(20, 0, 0)   // 8:00 PM
                };

                // For each theater
                var theaters = halls.Select(h => h.Theater).Distinct().ToList();
                foreach (var theater in theaters)
                {
                    // Get all halls for this theater
                    var theaterHalls = halls.Where(h => h.Theater.Id == theater.Id).ToList();

                    // Select 3-5 movies to show at this theater (not all movies show at all theaters)
                    var theaterMovies = movies.OrderBy(m => random.Next()).Take(Math.Min(movies.Count, random.Next(3, 6))).ToList();

                    // For each movie at this theater
                    foreach (var movie in theaterMovies)
                    {
                        // Assign the movie to 1-2 halls
                        var movieHalls = theaterHalls.OrderBy(h => random.Next()).Take(random.Next(1, 3)).ToList();

                        // For the next 7 days
                        for (int day = 0; day < 7; day++)
                        {
                            var date = DateTime.Now.Date.AddDays(day);

                            // Skip some days (not all movies show every day)
                            if (random.Next(10) < 3 && day > 0)  // 30% chance to skip a day (but never skip today)
                            {
                                continue;
                            }

                            // For each hall assigned to this movie
                            foreach (var hall in movieHalls)
                            {
                                // Not all time slots are used - pick 1-2 times
                                var selectedTimes = commonTimes.OrderBy(t => random.Next()).Take(random.Next(1, 3)).ToList();

                                foreach (var time in selectedTimes)
                                {
                                    // Determine if showing is 3D (based on hall type)
                                    bool is3D = hall.ScreenType == "3D" ||
                                               (hall.ScreenType == "IMAX" && random.Next(10) < 3);

                                    // Use original ticket price logic
                                    decimal ticketPrice = (decimal)(9.99 + (day == 0 || day == 6 ? 2 : 0) + (time.Hours >= 18 ? 1 : 0));

                                    var startTime = date.Add(time);
                                    var showtime = new Showtime
                                    {
                                        MovieId = movie.Id,
                                        HallId = hall.Id,
                                        StartTime = startTime,
                                        EndTime = startTime.AddMinutes(movie.Duration),
                                        TicketPrice = ticketPrice,
                                        Is3D = is3D
                                    };

                                    context.Set<Showtime>().Add(showtime);
                                }
                            }
                        }
                    }
                }

                context.SaveChanges();
            }
        }
    }
}