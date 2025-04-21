export interface ServiceItem {
    name: string;
    price: number; 
  }
  
  export interface CreateCheckoutSessionRequest {
    services: ServiceItem[];
  }