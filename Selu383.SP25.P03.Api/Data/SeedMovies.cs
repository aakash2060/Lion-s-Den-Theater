using Selu383.SP25.P03.Api.Features.Movies;
using static System.Net.WebRequestMethods;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedMovies
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
            if (!context.Movies.Any())
            {
                var movies = new List<Movie>
                {
                    new Movie
                    {
                        Title = "Inception",
                        Description = "A mind-bending thriller about dream infiltration",
                        Director = "Christopher Nolan",
                        Duration = 148,
                        Rating = "PG-13",
                        Genre = "Sci-Fi",
                        PosterUrl = "https://image.tmdb.org/t/p/original/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
                        ReleaseDate = new DateTime(2010, 7, 16)
                    },
                    new Movie
                    {
                        Title = "The Avengers",
                        Description = "Earth's mightiest heroes unite to save the world",
                        Director = "Joss Whedon",
                        Duration = 143,
                        Rating = "PG-13",
                        Genre = "Action",
                        PosterUrl = "https://m.media-amazon.com/images/M/MV5BNGE0YTVjNzUtNzJjOS00NGNlLTgxMzctZTY4YTE1Y2Y1ZTU4XkEyXkFqcGc@._V1_.jpg",
                        ReleaseDate = new DateTime(2012, 5, 4)
                    },
                    new Movie
                    {
                        Title = "Avatar: The Way of Water",
                        Description = "Jake Sully and Neytiri are back in the underwater world of Pandora, facing new threats.",
                        Director = "James Cameron",
                        Duration = 192,
                        Rating = "PG-13",
                        Genre = "Sci-Fi",
                        PosterUrl = "https://m.media-amazon.com/images/I/71s3cEqEZTL._AC_UF894,1000_QL80_.jpg",
                        ReleaseDate = new DateTime(2022, 12, 16)
                    },
                    new Movie
                    {
                        Title = "The Batman",
                        Description = "Batman ventures into Gotham City's underworld to unmask the culprit behind a series of sadistic killings.",
                        Director = "Matt Reeves",
                        Duration = 155,
                        Rating = "PG-13",
                        Genre = "Action",
                        PosterUrl = "https://m.media-amazon.com/images/M/MV5BMmU5NGJlMzAtMGNmOC00YjJjLTgyMzUtNjAyYmE4Njg5YWMyXkEyXkFqcGc@._V1_SL1024_.jpg",
                        ReleaseDate = new DateTime(2022, 3, 4)
                    },
                    new Movie
                    {
                        Title = "Spider-Man: No Way Home",
                        Description = "Spider-Man teams up with Doctor Strange to face multiple versions of Spider-Man and villains from other realities.",
                        Director = "Jon Watts",
                        Duration = 148,
                        Rating = "PG-13",
                        Genre = "Action",
                        PosterUrl = "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg",
                        ReleaseDate = new DateTime(2021, 12, 17)
                    },
                    new Movie
                    {
                        Title = "Dune",
                        Description = "Paul Atreides, a nobleman's son, becomes embroiled in a war for control of the most valuable resource in the universe.",
                        Director = "Denis Villeneuve",
                        Duration = 155,
                        Rating = "PG-13",
                        Genre = "Sci-Fi",
                        PosterUrl = "https://media.vanityfair.com/photos/5e962efaac720b00089fd0a9/1:1/w_1200,h_1200,c_limit/0520-Dune-Tout-Lede-a.jpg",
                        ReleaseDate = new DateTime(2021, 10, 22)
                    },
                    new Movie
                    {
                        Title = "Everything Everywhere All at Once",
                        Description = "An aging Chinese immigrant is swept up in an insane adventure where she alone can save the world by exploring other universes.",
                        Director = "Daniel Kwan, Daniel Scheinert",
                        Duration = 139,
                        Rating = "R",
                        Genre = "Sci-Fi",
                        PosterUrl = "https://upload.wikimedia.org/wikipedia/en/1/1e/Everything_Everywhere_All_at_Once.jpg",
                        ReleaseDate = new DateTime(2022, 3, 11)
                    },
                    new Movie
                    {
                        Title = "Top Gun: Maverick",
                        Description = "Pete 'Maverick' Mitchell is back as a seasoned Navy pilot, training the next generation of fighter pilots.",
                        Director = "Joseph Kosinski",
                        Duration = 131,
                        Rating = "PG-13",
                        Genre = "Action",
                        PosterUrl = "https://upload.wikimedia.org/wikipedia/en/thumb/1/13/Top_Gun_Maverick_Poster.jpg/220px-Top_Gun_Maverick_Poster.jpg",
                        ReleaseDate = new DateTime(2022, 5, 27)
                    },
                    new Movie
                    {
                        Title = "Black Panther: Wakanda Forever",
                        Description = "Queen Ramonda, Shuri, M'Baku, Okoye, and the Dora Milaje fight to protect their home from intervening world powers in the wake of King T'Challa's death.",
                        Director = "Ryan Coogler",
                        Duration = 161,
                        Rating = "PG-13",
                        Genre = "Action",
                        PosterUrl = "https://upload.wikimedia.org/wikipedia/en/3/3b/Black_Panther_Wakanda_Forever_poster.jpg",
                        ReleaseDate = new DateTime(2022, 11, 11)
                    }
                };

                context.Movies.AddRange(movies);
                context.SaveChanges();
            }
        }
    }
}
