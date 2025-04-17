export interface CartDto {
    id: number;
    userId: number;
    items: CartItemDto[];
  }
  
  export interface CartItemDto {
    id: number;
    showtimeId: number;
    showtimeDetails: string;
    quantity: number;
    totalPrice: number;
  }
  
  export interface AddCartItemDto {
    showtimeId: number;
    quantity: number;
  }
  
  