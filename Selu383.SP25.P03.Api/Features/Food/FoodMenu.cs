using System.ComponentModel.DataAnnotations;

public class FoodMenu
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; }

    public List<FoodMenuItem> FoodMenuItems { get; set; } = new();
}
