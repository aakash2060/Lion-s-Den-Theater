namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class HallDto
    {
        public int Id { get; set; }
        public int HallNumber { get; set; }
        public int TheaterId { get; set; }
        public int TheaterNumber { get; set; }
        public int Capacity { get; set; }
        public string ScreenType { get; set; }
    }

    public class HallDetailsDto : HallDto 
    {
        public bool IsInUse { get; set; }
    }
    public class CreateHallDto
    {
        public int HallNumber { get; set; }
        public int TheaterId { get; set; }
        public int Capacity { get; set; }
        public string ScreenType { get; set; }
    }

    public class UpdateHallDto 
    {
        public int HallNumber { get;set; }
        public int Capacity { get; set; }
        public string ScreenType { get; set; }
    }
}
