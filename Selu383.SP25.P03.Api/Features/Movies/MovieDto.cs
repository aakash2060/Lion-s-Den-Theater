using System.Security.Cryptography.X509Certificates;

namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class MovieDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Director { get; set; }
        public int Duration { get; set; }
        public string Rating { get; set; }
        public string Genre { get; set; }
        public string PosterUrl { get; set; }
        public DateTime ReleaseDate { get; set; }

    }
    public class MovieDetailsDto: MovieDto
    {

    }
    public class CreateMovieDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Director { get; set; }
        public int Duration { get; set; }
        public string Rating { get; set; }
        public string Genre { get; set; }
        public string PosterUrl { get; set; }
        public DateTime ReleaseDate { get; set; }
    }
    public class UpdateMovieDto : CreateMovieDto
    {

    }
}
