public class SalesDataDto
{
    public string? MovieTitle { get; set; }
    public string? TheaterName { get; set; }
    public DateTime? Date { get; set; } // Nullable to skip in summary mode
    public int TicketsSold { get; set; }
    public decimal TotalRevenue { get; set; }
}
