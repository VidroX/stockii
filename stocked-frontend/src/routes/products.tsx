import React, {useEffect} from "react";
import { useTranslation } from 'react-i18next';
import useToolbarTitle from "../hooks/toolbarTitle";
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
import OpenWithIcon from '@material-ui/icons/OpenWith';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import ProductsAdd from "../components/products/productsAdd";
import { Product, ProductInfo } from "../intefaces";
import LimitsViewer from "../components/products/limitsViewer";
import ProductMove from "../components/products/productMove";
import ProductOrder from "../components/products/productsOrder";
import StockedTable from "../components/stockedTable";
import EditIcon from '@material-ui/icons/Edit';
import ProductQuantityUpdate from "../components/products/productsUpdate";

const Products: React.FC = (props: any) => {
    const { t } = useTranslation();

    const [limitsModalOpen, setLimitsModalOpen] = React.useState(false);
    const [addModalOpen, setAddModalOpen] = React.useState(false);
    const [moveModalOpen, setMoveModalOpen] = React.useState(false);
    const [updateModalOpen, setUpdateModalOpen] = React.useState(false);
    const [orderModalOpen, setOrderModalOpen] = React.useState(false);
    const [removeModalOpen, setRemoveModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [removeLoading, setRemoveLoading] = React.useState(false);
    const [globalLoadingState, setGlobalLoadingState] = React.useState(false);
    const [data, setData] = React.useState<Product[]>([]);
    const [productInfo, setProductInfo] = React.useState<ProductInfo>({id: 0, limits: null, warehouse: null});
    const [count, setCount] = React.useState<number>(0);
    const [columns, setColumns] = React.useState<any[]>([]);
    const [page, setPage] = React.useState<number>(0);
    const [shouldRefreshTable, setShouldRefreshTable] = React.useState<boolean>(true);
    const [productInfoArray] = React.useState<ProductInfo[]>([]);
    const [firstStart, setFirstStart] = React.useState<boolean>(true);
    const [sortItem, setSortItem] = React.useState<string>("-id");

    const classes = useStyles();

    useToolbarTitle(t('main.products'));

    const dispatch = useDispatch();
    const productsGetProgress = useSelector((state: any) => state.main.productsGetProgress);
    const productsData = useSelector((state: any) => state.main.productsData);
    const user = useSelector((state: any) => state.main.userData);
    const productsRemoveProgress = useSelector((state: any) => state.main.productsRemoveProgress);
    const productsRemoveData = useSelector((state: any) => state.main.productsRemoveData);

    const sortColumns = [
        [{item: "name"}],
        [{item: "warehouse"}],
        [{item: "quantity"}]
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
                                { user.is_superuser &&
                                    <Tooltip title={t('products.updateProductQuantity')}>
                                        <IconButton onClick={() => onUpdateProductQuantity(productInfo)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
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
                        limits: obj.limit,
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
            setFirstStart(false);
            setLoading(false);
            setGlobalLoadingState(false);
        }
        if(!productsGetProgress && productsData != null && productsData.error) {
            setFirstStart(false);
            setLoading(false);
            setGlobalLoadingState(false);
        }
        setTimeout(() => {
            setFirstStart(false);
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

    const onViewLimitsClick = (productInfoLocal: ProductInfo) => {
        setProductInfo(productInfoLocal);
        setLimitsModalOpen(true);
    };
    const onViewLimitsCancel = (shouldRefresh: boolean) => {
        setProductInfo({id: 0, limits: null, warehouse: null});
        setLimitsModalOpen(false);
        setShouldRefreshTable(shouldRefresh);
    };

    const onMoveClick = (productInfoLocal: ProductInfo) => {
        setProductInfo(productInfoLocal);
        setMoveModalOpen(true);
    };
    const onMoveClickCancel = (shouldRefresh: boolean) => {
        setProductInfo({id: 0, limits: null, warehouse: null});
        setShouldRefreshTable(shouldRefresh);
        setMoveModalOpen(false);
    };

    const onUpdateProductQuantity = (productInfo: ProductInfo) => {
        setProductInfo(productInfo);
        setUpdateModalOpen(true);
    };
    const onUpdateProductQuantityCancel = (shouldRefresh: boolean) => {
        setProductInfo({id: 0, limits: null, warehouse: null});
        setShouldRefreshTable(shouldRefresh);
        setUpdateModalOpen(false);
    };

    const onOrderProductClick = (productInfo: ProductInfo) => {
        setProductInfo(productInfo);
        setOrderModalOpen(true);
    };
    const onOrderProductCancel = (shouldRefresh: boolean) => {
        setProductInfo({id: 0, limits: null, warehouse: null});
        setShouldRefreshTable(shouldRefresh);
        setOrderModalOpen(false);
    };

    const handleAddClick = () => {
        setAddModalOpen(true);
    };

    const onAddModalClose = (shouldRefresh: boolean) => {
        setAddModalOpen(false);
        if(shouldRefresh) {
            setShouldRefreshTable(true);
        }
    };

    const onRemoveModalClose = () => {
        setProductInfo({id: 0, limits: null, warehouse: null});
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

    const onRequest = (type: "sort" | "changePage" | "search" | "refreshTable", page: number, sortItem: string | null, searchVal: string | null) => {
        if (firstStart) {
            setLoading(true);
        } else {
            setGlobalLoadingState(true);
        }

        setPage(page);
        if (sortItem != null) {
            setSortItem(sortItem);
        }
        dispatch(getProducts(page, sortItem, searchVal));
    };

    const onTableRefreshed = () => {
        setShouldRefreshTable(false);
    };

    const exportHeaders = [
        {
            name: t('products.name'),
            download: true,
        },
        {
            name: t('products.warehouse'),
            download: true,
        },
        {
            name: t('products.quantity'),
            download: true,
        },
    ];

    const renderTable = () => {
        if (loading) {
            return <TablePlaceholder />;
        } else {
            return (
                <StockedTable
                    title={t('main.products')}
                    count={count}
                    columns={columns}
                    data={data}
                    sortColumns={sortColumns}
                    sortItem={sortItem}
                    addEnabled={true}
                    onAddClick={handleAddClick}
                    onRequest={onRequest}
                    exportEnabled={true}
                    exportFileName="products.csv"
                    exportHeader={exportHeaders}
                    page={page}
                    refreshTable={shouldRefreshTable}
                    onTableRefreshed={onTableRefreshed}
                />
            );
        }
    };

    return (
        <React.Fragment>
            <ProductsAdd open={addModalOpen} onClose={onAddModalClose} />
            <LimitsViewer open={limitsModalOpen} onClose={onViewLimitsCancel} productData={productInfo} />
            <ProductMove open={moveModalOpen} onClose={onMoveClickCancel} productData={productInfo} />
            <ProductOrder open={orderModalOpen} onClose={onOrderProductCancel} productData={productInfo} />
            <ProductQuantityUpdate open={updateModalOpen} productData={productInfo} onClose={onUpdateProductQuantityCancel} />
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
