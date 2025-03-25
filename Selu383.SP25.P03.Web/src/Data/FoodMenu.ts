import {FoodItem} from "../Data/FoodItem"

export interface FoodMenu {
    id: number;
    name: string;
    foodMenuItems: { foodItem: FoodItem} [];
}