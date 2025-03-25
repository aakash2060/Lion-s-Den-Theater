using System.Text.Json.Serialization;

public class FoodMenuItem
{
    public int FoodMenuId { get; set; }

    [JsonIgnore]
    public FoodMenu FoodMenu { get; set; }

    public int FoodItemId { get; set; }
    public FoodItem FoodItem { get; set; }
}

public class FoodMenuItemDTO
{
    public int FoodMenuId { get; set; }
    public int FoodItemId { get; set; } 
}