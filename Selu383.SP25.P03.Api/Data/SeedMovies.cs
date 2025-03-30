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
        ReleaseDate = new DateTime(2010, 7, 16),
        TrailerId = "YoHD9XEInc0"
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
        ReleaseDate = new DateTime(2012, 5, 4),
        TrailerId = "eOrNdBpGMv8"
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
        ReleaseDate = new DateTime(2022, 12, 16),
        TrailerId = "d9MyW72ELq0"
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
        ReleaseDate = new DateTime(2022, 3, 4),
        TrailerId = "mqqft2x_Aa4"
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
        ReleaseDate = new DateTime(2021, 12, 17),
        TrailerId = "JfVOs4VSpmA"
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
        ReleaseDate = new DateTime(2021, 10, 22),
        TrailerId = "n9xhJrPXop4"
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
        ReleaseDate = new DateTime(2022, 3, 11),
        TrailerId = "wxN1T1uxQ2g"
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
        ReleaseDate = new DateTime(2022, 5, 27),
        TrailerId = "giXco2jaZ_4"
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
        ReleaseDate = new DateTime(2022, 11, 11),
        TrailerId = "RlOB3UALvrQ"
    },
    new Movie
{
    Title = "The Shawshank Redemption",
    Description = "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    Director = "Frank Darabont",
    Duration = 142,
    Rating = "R",
    Genre = "Drama",
    PosterUrl = "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg",
    ReleaseDate = new DateTime(1994, 9, 23),
    TrailerId = "PLl99DlL6b4"
},
new Movie
{
    Title = "The Lord of the Rings: The Fellowship of the Ring",
    Description = "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    Director = "Peter Jackson",
    Duration = 178,
    Rating = "PG-13",
    Genre = "Fantasy",
    PosterUrl = "https://upload.wikimedia.org/wikipedia/en/8/8a/The_Lord_of_the_Rings_The_Fellowship_of_the_Ring_%282001%29.jpg",
    ReleaseDate = new DateTime(2001, 12, 19),
    TrailerId = "V75dMMIW2B4"
},
new Movie
{
    Title = "Parasite",
    Description = "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    Director = "Bong Joon-ho",
    Duration = 132,
    Rating = "R",
    Genre = "Drama",
    PosterUrl = "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png",
    ReleaseDate = new DateTime(2019, 5, 30),
    TrailerId = "5xH0HfJHsaY"
},
new Movie
{
    Title = "Interstellar",
    Description = "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    Director = "Christopher Nolan",
    Duration = 169,
    Rating = "PG-13",
    Genre = "Sci-Fi",
    PosterUrl = "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    ReleaseDate = new DateTime(2014, 11, 7),
    TrailerId = "zSWdZVtXT7E"
},
new Movie
{
    Title = "The Dark Knight",
    Description = "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    Director = "Christopher Nolan",
    Duration = 152,
    Rating = "PG-13",
    Genre = "Action",
    PosterUrl = "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg",
    ReleaseDate = new DateTime(2008, 7, 18),
    TrailerId = "EXeTwQWrcwY"
},
new Movie
{
    Title = "Spirited Away",
    Description = "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    Director = "Hayao Miyazaki",
    Duration = 125,
    Rating = "PG",
    Genre = "Animation",
    PosterUrl = "https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png",
    ReleaseDate = new DateTime(2001, 7, 20),
    TrailerId = "ByXuk9QqQkk"
},
new Movie
{
    Title = "The Matrix",
    Description = "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    Director = "Lana Wachowski, Lilly Wachowski",
    Duration = 136,
    Rating = "R",
    Genre = "Sci-Fi",
    PosterUrl = "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
    ReleaseDate = new DateTime(1999, 3, 31),
    TrailerId = "vKQi3bBA1y8"
},
new Movie
{
    Title = "Pulp Fiction",
    Description = "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    Director = "Quentin Tarantino",
    Duration = 154,
    Rating = "R",
    Genre = "Crime",
    PosterUrl = "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg",
    ReleaseDate = new DateTime(1994, 10, 14),
    TrailerId = "s7EdQ4FqbhY"
},
new Movie
{
    Title = "Coco",
    Description = "Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.",
    Director = "Lee Unkrich, Adrian Molina",
    Duration = 105,
    Rating = "PG",
    Genre = "Animation",
    PosterUrl = "https://upload.wikimedia.org/wikipedia/en/9/98/Coco_%282017_film%29_poster.jpg",
    ReleaseDate = new DateTime(2017, 11, 22),
    TrailerId = "xlnPHQ3TLX8"
},
new Movie
{
    Title = "Get Out",
    Description = "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
    Director = "Jordan Peele",
    Duration = 104,
    Rating = "R",
    Genre = "Horror",
    PosterUrl = "https://upload.wikimedia.org/wikipedia/en/a/a3/Get_Out_poster.png",
    ReleaseDate = new DateTime(2017, 2, 24),
    TrailerId = "DzfpyUB60YY"
}



                };

                context.Movies.AddRange(movies);
                context.SaveChanges();
            }
        }
    }
}