import { ShowtimeDetail } from "./ShowtimeInterfaces";

export interface CartDto {
    id: number;
    userId: number;
    items: CartItemDto[];
    foodItems: FoodCartItemDto[];
  }
  
  export interface CartItemDto {
    id: number;
    showtimeId: number;
    showtimeDetails: ShowtimeDetail;
    quantity: number;
    totalPrice: number;
  }
  
  export interface AddCartItemDto {
    showtimeId: number;
    quantity: number;
  }
  export interface FoodCartItemDto {
    id: number;
    foodItemId: number;
    foodName: string;
    foodDescription: string;
    foodImageUrl: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }
  export interface AddCartItemDto {
    showtimeId: number;
    quantity: number;
  }
  
  export interface AddFoodCartItemDto {
    foodItemId: number;
    quantity: number;
  }
  
  export interface UpdateCartItemDto {
    quantity: number;
  }
  
  