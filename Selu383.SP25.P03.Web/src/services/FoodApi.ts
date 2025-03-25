export const fetchFoodMenus = async () => {
    const response = await fetch('https://localhost:7027/api/foodmenu');
    if (!response.ok) {
      throw new Error('Failed to fetch food menus');
    }
    return response.json();
  };
  
  export const fetchFoodItems = async () => {
    const response = await fetch('https://localhost:7027/api/fooditem');
    if (!response.ok) {
      throw new Error('Failed to fetch food items');
    }
    return response.json();
  };
  