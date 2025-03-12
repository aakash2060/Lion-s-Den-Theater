using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net.Sockets;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class Showtime
    {
        public int Id { get; set; }

        public int MovieId { get; set; }

        public int HallId { get; set; }

        [Required] public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        [Required] public decimal TicketPrice { get; set; }

        public bool IsSoldOut { get; set; }

        // Special showtime types
        public bool Is3D { get; set; }

        // Navigation properties
        public Movie Movie { get; set; }
        public Hall Hall { get; set; }
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}