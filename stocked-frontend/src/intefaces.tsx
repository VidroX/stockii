export interface Warehouse {
    location: string,
    workingFrom: string,
    workingTo: string,
    weekends: boolean,
    phone: string
}

export interface ProductLimit {
    id: number,
    minAmount: number,
    maxAmount: number
}

export interface Product {
    name: string,
    quantity: number,
    warehouse: string
}

export interface ProductInfo {
    id: number,
    limits: ProductLimit | null,
    warehouse: Warehouse | null
}