export interface Product {
    title: string,
    image: string,
    price: number,
    content: string,
    _id: string,
    isAvailable: boolean
}

export interface ProductResponse {
    products: Product[],
    totalItems: number,
    hasNextPage: boolean
}

export interface ProductDetailResponse {
    product: Product,
}