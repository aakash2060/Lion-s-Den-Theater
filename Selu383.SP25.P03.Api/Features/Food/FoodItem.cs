using System.ComponentModel.DataAnnotations;

public class FoodItem
{
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Name { get; set; }

    public string Description { get; set; }

    [Required, Range(0, 1000)]
    public float Price { get; set; }

    public string ImgUrl { get; set; }

    public int StockQuantity { get; set; }
}
