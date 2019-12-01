import {MUIDataTableColumnDef} from "mui-datatables";

export interface Warehouse {
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

export interface StockedTableInterface {
    title: string,
    count: number,
    page: number,
    columns: MUIDataTableColumnDef[],
    data: Array<object | number[] | string[]>,
    sortColumns: Array<string>,
    addEnabled: boolean,
    onRequest(type: "sort" | "changePage" | "search" | "refreshTable", page: number, sortItem: string | null, searchVal: string | null): void,
    refreshTable?: boolean,
    sortItem?: string,
    onTableRefreshed?(): void,
    onAddClick?(): void
}

/*
export interface StockedTableInterface {
    title: string,
    count: number,
    columns: MUIDataTableColumnDef[],
    data: Array<object | number[] | string[]>,
    sortColumns: Array<string>,
    addEnabled: boolean,
    refreshTable?: boolean,
    onRequest?(localPage: number, sortItem: string | null, searchVal: string | null): void,
    onRequestCompleted?(): boolean,
    onAddClick?(): void,
    onTableRefreshed?(): void
}*/
