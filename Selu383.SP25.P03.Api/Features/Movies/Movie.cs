using System.ComponentModel.DataAnnotations;
using Selu383.SP25.P03.Api.Features.Theaters;

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
        public string TrailerId { get; set; }
        public ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
    };

};
