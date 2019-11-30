export interface Warehouse {
    location: string,
    workingFrom: string,
    workingTo: string,
    weekends: boolean,
    phone: string
}

export interface ProductLimit {
    id: number,
    min_amount: number,
    max_amount: number
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

export interface OptionType {
    id: number,
    label: string
}

export interface ProviderDeliveryTimes {
    workingFrom: string,
    workingTo: string,
    averageDeliveryTime: number,
    weekends: boolean
}

export interface ProviderOptionType {
    values: OptionType,
    delivery: ProviderDeliveryTimes
}

export interface WarehouseAccessInterface {
    warehouseId: number,
    open: boolean,
    onOpen?(): void,
    onClose?(): void
}

export interface ProductAddInterface {
    open: boolean,
    onOpen?(): void,
    onClose?(shouldRefresh: boolean): void
}

export interface ProductOrderInterface {
    open: boolean,
    productData: ProductInfo,
    onOpen?(): void,
    onClose?(shouldRefresh: boolean): void
}

export interface WarehouseSelectorInterface {
    error?: boolean,
    helperText?: string,
    onSelect?(value: OptionType): void
}

export interface ProviderSelectorInterface {
    error?: boolean,
    helperText?: string,
    onSelect?(value: ProviderOptionType): void,
    onClear?(): void
}

export interface LimitsViewerInterface {
    open: boolean,
    productData: ProductInfo,
    onOpen?(): void,
    onClose?(shouldRefresh: boolean): void
}

export interface ProductMoveInterface {
    open: boolean,
    productData: ProductInfo,
    onOpen?(): void,
    onClose?(shouldRefresh: boolean): void
}