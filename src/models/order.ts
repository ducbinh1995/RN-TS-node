import { Cart } from "./cart";

export interface Order {
    date: Date,
    products: Cart[],
    total: number
}

export interface OrderResponse {
    orders: Order[]
}