import React, {useEffect} from "react";
import { useTranslation } from 'react-i18next';
import MUIDataTable from "mui-datatables";
import useToolbarTitle from "../hooks/toolbarTitle";
import useTableLocalization from "../hooks/tableLocalization";
import DataTableToolbar from "../components/dataTableToolbar";
import StockedModal from "../components/modal";
import {IconButton, makeStyles, Theme, Tooltip} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import TablePlaceholder from "../components/tablePlaceholder";
import {
    getProducts,
    removeProduct,
    setGlobalLoading,
    setSnackbar,
    showSnackbar
} from "../redux/actions";
import config from "../config";
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda';
import {green, red} from "@material-ui/core/colors";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Warehouse } from "./warehouses";
import OpenWithIcon from '@material-ui/icons/OpenWith';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import ProductsAdd from "../components/products/productsAdd";
import WarehouseAdd from "../components/warehouses/warehouseAdd";

interface ProductLimit {
    id: number,
    minAmount: number,
    maxAmount: number
}

interface Product {
    name: string,
    quantity: number,
    warehouse: string
}

interface ProductInfo {
    id: number,
    limits: ProductLimit | null,
    warehouse: Warehouse | null
}

const Products: React.FC = (props: any) => {
    const { t } = useTranslation();
    const tableLocalization = useTableLocalization();

    const [modalOpen, setModalOpen] = React.useState(false);
    const [addModalOpen, setAddModalOpen] = React.useState(false);
    const [removeModalOpen, setRemoveModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [removeLoading, setRemoveLoading] = React.useState(false);
    const [globalLoadingState, setGlobalLoadingState] = React.useState(false);
    const [data, setData] = React.useState<Product[]>([]);
    const [productInfo, setProductInfo] = React.useState<ProductInfo | null>(null);
    const [count, setCount] = React.useState<number>(0);
    const [columns, setColumns] = React.useState<any[]>([]);
    const [currentSortColumn, setCurrentSortColumn] = React.useState<number>(-1);
    const [currentSortDirection, setCurrentSortDirection] = React.useState<string>("none");
    const [page, setPage] = React.useState<number>(0);
    const [shouldRefreshTable, setShouldRefreshTable] = React.useState<boolean>(true);
    const [searchVal, setSearchVal] = React.useState<string>("");
    const [productInfoArray] = React.useState<ProductInfo[]>([]);

    const classes = useStyles();

    useToolbarTitle(t('main.products'));

    const dispatch = useDispatch();
    const productsGetProgress = useSelector((state: any) => state.main.productsGetProgress);
    const productsData = useSelector((state: any) => state.main.productsData);
    const user = useSelector((state: any) => state.main.userData);
    const productsRemoveProgress = useSelector((state: any) => state.main.productsRemoveProgress);
    const productsRemoveData = useSelector((state: any) => state.main.productsRemoveData);

    const sortColumns = [
        "name",
        "warehouse",
        "quantity"
    ];

    useEffect(() => {
        let columns: any[] = [
            {
                name: t('products.name'),
                options: {
                    sortDirection: 'none'
                }
            },
            {
                name: t('products.warehouse'),
                options: {
                    sortDirection: 'none'
                }
            },
            {
                name: t('products.quantity'),
                options: {
                    sortDirection: 'none'
                }
            },
            {
                name: t('main.actions'),
                options: {
                    sort: false,
                    sortDirection: 'none',
                    customBodyRender: (id: number) => {
                        const productInfo = productInfoArray[id];
                        return (
                            <div className={classes.actions}>
                                <Tooltip title={t('products.viewLimits')}>
                                    <IconButton onClick={() => onViewLimitsClick(productInfo)}>
                                        <ViewAgendaIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t('products.moveProduct')}>
                                    <IconButton onClick={() => onMoveClick(productInfo)}>
                                        <OpenWithIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t('products.orderProduct')}>
                                    <IconButton onClick={() => onOrderProductClick(productInfo)}>
                                        <ShoppingBasketIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t('main.delete')}>
                                    <IconButton onClick={() => onDeleteClick(productInfo)}>
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        );
                    }
                }
            }
        ];

        setColumns(columns);
    }, [classes, productInfoArray, t, user.is_superuser]);

    useEffect(() => {
        setLoading(true);
        dispatch(getProducts(0));
    }, [dispatch]);

    useEffect(() => {
        if(loading || globalLoadingState) {
            dispatch(setGlobalLoading(true));
        } else {
            dispatch(setGlobalLoading(false));
        }
    }, [dispatch, globalLoadingState, loading]);
    
    useEffect(() => {
        if (!productsGetProgress && productsData != null) {
            if(productsData.results != null) {
                const productsMap = productsData.results.map((obj: any) => {
                    productInfoArray[obj.id] = {
                        id: obj.id,
                        limits: obj.limits,
                        warehouse: obj.warehouse
                    };
                    return [
                        obj.name,
                        (obj.warehouse != null && obj.warehouse.location != null) ? obj.warehouse.location : t("main.unknown"),
                        obj.quantity,
                        obj.id
                    ];
                });
                setData(productsMap);
                setCount(productsData.count);
            }
            setLoading(false);
            setGlobalLoadingState(false);
        }
        if(!productsGetProgress && productsData != null && productsData.error) {
            setLoading(false);
            setGlobalLoadingState(false);
        }
        setTimeout(() => {
            setLoading(false);
            setGlobalLoadingState(false);
        }, config.main.connectionTimeout)
    }, [loading, productInfoArray, productsData, productsGetProgress, t]);

    useEffect(() => {
        if (removeLoading && !productsRemoveProgress && productsRemoveData != null) {
            if (productsRemoveData.detail == null && productsRemoveData.status === 12) {
                dispatch(setSnackbar(t('products.productDeleted'), 'success'));
            } else if (productsRemoveData.detail == null && productsRemoveData.status !== 12) {
                dispatch(setSnackbar(t('products.unableToDeleteProduct'), 'error'));
            } else {
                dispatch(setSnackbar(productsRemoveData.detail, 'error'));
            }

            setRemoveLoading(false);
            dispatch(setGlobalLoading(false));
            dispatch(showSnackbar(true));
            setShouldRefreshTable(true);
        }
    }, [dispatch, productsRemoveData, productsRemoveProgress, removeLoading, t]);
    
    useEffect(() => {
        if (shouldRefreshTable) {
            if(currentSortColumn !== -1 && currentSortDirection !== 'none' && sortColumns[currentSortColumn] != null) {
                let columnItem = sortColumns[currentSortColumn];

                let prefix = "-";
                if(currentSortDirection === 'asc') {
                    prefix = '';
                }

                const sortItem = prefix + columnItem;

                if(searchVal != null && searchVal.length > 0) {
                    dispatch(getProducts(page, sortItem, searchVal));
                } else {
                    dispatch(getProducts(page, sortItem));
                }
            } else {
                if(searchVal != null && searchVal.length > 0) {
                    dispatch(getProducts(page, '-id', searchVal));
                } else {
                    dispatch(getProducts(page));
                }
            }
            
            setShouldRefreshTable(false);
        }
    }, [currentSortColumn, currentSortDirection, dispatch, page, searchVal, shouldRefreshTable, sortColumns]);

    const onViewLimitsClick = (productInfo: ProductInfo) => {
        setProductInfo(productInfo);
    };
    const onViewLimitsCancel = () => {
        setProductInfo(null);
    };

    const onMoveClick = (productInfo: ProductInfo) => {
        setProductInfo(productInfo);
    };
    const onMoveClickCancel = () => {
        setProductInfo(null);
    };

    const onOrderProductClick = (productInfo: ProductInfo) => {
        setProductInfo(productInfo);
    };
    const onOrderProductCancel = () => {
        setProductInfo(null);
    };

    let timeout: any;

    const onTableChange = (action: string, tableState: any) => {
        if (action === 'changePage') {
            setLoading(true);

            refreshPage(tableState.page, searchVal);

            setPage(tableState.page);
        } else if (action === 'sort') {
            const columnId = tableState.activeColumn;

            if (currentSortColumn !== -1 && currentSortColumn !== columnId) {
                let tempColumns = [...columns];
                let item = {...tempColumns[currentSortColumn]};
                item.options.sortDirection = 'none';
                tempColumns[currentSortColumn] = item;
                setColumns(tempColumns);
            }

            setCurrentSortColumn(columnId);

            let tempColumns = [...columns];
            let item = {...tempColumns[columnId]};
            if (item.options.sortDirection === 'none') {
                item.options.sortDirection = 'desc';
            } else if (item.options.sortDirection === 'desc') {
                item.options.sortDirection = 'asc';
            } else {
                item.options.sortDirection = 'none';
            }
            tempColumns[columnId] = item;
            setColumns(tempColumns);

            let prefix = "-";
            if(item.options.sortDirection === 'asc') {
                prefix = '';
            }

            const serverColumn = columnId !== -1 || null ? item.options.sortDirection !== 'none' ? (prefix + sortColumns[columnId]) : "-id" : "-id";
            setCurrentSortDirection(item.options.sortDirection);
            setGlobalLoadingState(true);
            dispatch(getProducts(tableState.page, serverColumn));
        } else if (action === 'search') {
            setSearchVal(tableState.searchText);
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function () {
                setGlobalLoadingState(true);
                refreshPage(tableState.page, tableState.searchText);
            }, 1000);
        }
    };

    const refreshPage = (localPage: number, searchValLocal: string = '') => {
        if(currentSortColumn !== -1 && currentSortDirection !== 'none' && sortColumns[currentSortColumn] != null) {
            let columnItem = sortColumns[currentSortColumn];

            let prefix = "-";
            if(currentSortDirection === 'asc') {
                prefix = '';
            }

            const sortItem = prefix + columnItem;

            if(searchValLocal != null && searchValLocal.length > 0) {
                dispatch(getProducts(localPage, sortItem, searchValLocal));
            } else {
                dispatch(getProducts(localPage, sortItem));
            }
        } else {
            if(searchValLocal != null && searchValLocal.length > 0) {
                dispatch(getProducts(localPage, '-id', searchValLocal));
            } else {
                dispatch(getProducts(localPage));
            }
        }
    };

    const handleAddClick = () => {
        setAddModalOpen(true);
    };

    const onAddModalClose = (shouldRefresh: boolean) => {
        setAddModalOpen(false);
        if(shouldRefresh) {
            refreshPage(page);
        }
    };

    const onRemoveModalClose = () => {
        setProductInfo(null);
        setRemoveModalOpen(false);
    };

    const onDeleteClick = (productInfo: ProductInfo) => {
        setProductInfo(productInfo);
        setRemoveModalOpen(true);
    };

    const onDeleteClickSubmit = (e: any) => {
        e.preventDefault();

        if (productInfo != null && productInfo.id != null && productInfo.id > 0) {
            setRemoveLoading(true);
            dispatch(setGlobalLoading(true));
            dispatch(removeProduct(productInfo.id));
        }

        setRemoveModalOpen(false);
    };

    const renderTable = () => {
        if (loading) {
            return <TablePlaceholder />;
        } else {
            return (
                <div className={classes.paddingBottom}>
                    <MUIDataTable
                        title={t('main.products')}
                        data={data}
                        columns={columns}
                        options={{
                            rowsPerPageOptions: [],
                            rowsPerPage: config.api.row_count,
                            responsive: 'stacked',
                            print: false,
                            search: true,
                            filter: false,
                            rowHover: false,
                            selectableRows: 'none',
                            serverSide: true,
                            download: false,
                            page: page,
                            count: count,
                            textLabels: tableLocalization,
                            searchText: searchVal,
                            onSearchClose: () => setSearchVal(""),
                            onTableChange: onTableChange,
                            customToolbar: () => <DataTableToolbar onAddButtonClick={handleAddClick}/>
                        }}
                    />
                </div>
            );
        }
    };

    return (
        <React.Fragment>
            <ProductsAdd open={addModalOpen} onClose={onAddModalClose} />
            <StockedModal
                form
                title={t('products.removeProductTitle')}
                contentText={t('products.removeProductBody')}
                actionOk={t('main.yes')}
                actionCancel={t("main.no")}
                open={removeModalOpen}
                onClose={onRemoveModalClose}
                onSubmit={onDeleteClickSubmit}
            />
            { renderTable() }
        </React.Fragment>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    available: {
        color: green[300]
    },
    notAvailable: {
        color: red[300]
    },
    paddingBottom: {
        paddingBottom: 24
    },
    actions: {
        display: 'block',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: -15,
        [theme.breakpoints.down('sm')]: {
            marginLeft: -14
        }
    }
}));

export default Products;