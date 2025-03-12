using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class Movie
    {
        public int Id { get; set; }
        [Required] public string Title { get; set; }
        [MaxLength(500)] public string Description { get; set; }
        public string Director { get; set; }
        public int Duration { get; set; }
        public string Rating { get; set; }
        [Required] public string Genre { get; set; }
        [Required] public string PosterUrl { get; set; }
        public DateTime ReleaseDate { get; set; }
    };

};
