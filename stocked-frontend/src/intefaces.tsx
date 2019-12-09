import {MUIDataTableColumnDef} from "mui-datatables";

export interface Warehouse {
    location: string,
    workingFrom: string,
    workingTo: string,
    weekends: boolean,
    phone: string
}

export interface WarehouseFull {
    id: number,
    location: string,
    workingFrom: string,
    workingTo: string,
    weekends: boolean,
    phone: string
}

export interface ProviderInterface {
    name: string,
    workingFrom: string,
    workingTo: string,
    averageDeliveryTime: number,
    weekends: boolean,
    phone: string
}

export interface LanguageSelectorInterface {
    type: "IconButton" | "Button"
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

export interface ProductWithWarehouse {
    name: string,
    quantity: number,
    warehouse: Warehouse
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

export interface GenericProductInterface {
    open: boolean,
    productData: ProductInfo,
    onOpen?(): void,
    onClose?(shouldRefresh: boolean): void
}

export interface GenericCreateInterface {
    open: boolean,
    onOpen?(): void,
    onClose?(shouldRefresh: boolean): void
}

export interface WarehouseSelectorInterface {
    error?: boolean,
    helperText?: string,
    onSelect?(value: OptionType): void
}

export interface GenericSelectorInterface {
    error?: boolean,
    helperText?: string,
    onSelect?(value: OptionType): void,
    onClear?(): void
}

export interface ProductSelectorInterface {
    error?: boolean,
    helperText?: string,
    onSelect?(value: OptionType, warehouse: WarehouseFull): void,
    onClear?(): void
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

export interface SortColumn {
    item: string,
    prefixAsc?: string,
    prefixDesc?: string
}

export interface HeaderOption {
    name: string,
    download: boolean
}

export interface StockedTableInterface {
    title: string,
    count: number,
    page: number,
    columns: MUIDataTableColumnDef[],
    data: Array<object | number[] | string[]>,
    sortColumns: Array<SortColumn[]>,
    addEnabled: boolean,
    onRequest(type: "sort" | "changePage" | "search" | "refreshTable", page: number, sortItem: string | null, searchVal: string | null): void,
    refreshTable?: boolean,
    sortItem?: string,
    exportEnabled?: boolean,
    exportFileName?: string,
    exportHeader?: Array<HeaderOption>,
    onTableRefreshed?(): void,
    onAddClick?(): void
}

export interface ShipmentsInterface {
    product: string,
    provider: string,
    warehouse: string,
    quantity: number,
    approximateDeliveryDate: number
}

export interface ShipmentObjectInterface {
    id: number,
    startDate: Date,
    approximateDeliveryDate: Date,
    delivered: boolean
}

export interface TriggersInterface {
    name: string,
    product: string,
    type: string,
    activationDate: string,
    activated: number
}

export interface TriggerObjectInterface {
    id: number,
    creationDate: Date,
    activationDate: Date,
    type: number,
    activated: boolean
}
