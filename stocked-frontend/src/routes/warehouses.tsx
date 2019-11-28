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
    getWarehouses,
    removeWarehouse,
    setGlobalLoading,
    setSnackbar,
    showSnackbar
} from "../redux/actions";
import config from "../config";
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import {green, red} from "@material-ui/core/colors";
import FaceIcon from '@material-ui/icons/Face';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import WarehouseAccess from "../components/warehouses/warehouseAccess";
import WarehouseAdd from "../components/warehouses/warehouseAdd";
import { Warehouse } from "../intefaces";

const Warehouses: React.FC = (props: any) => {
    const { t } = useTranslation();
    const tableLocalization = useTableLocalization();
    const [modalOpen, setModalOpen] = React.useState(false);
    const [removeModalOpen, setRemoveModalOpen] = React.useState(false);
    const [accessModalOpen, setAccessModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [removeWarehouseLoading, setRemoveWarehouseLoading] = React.useState(false);
    const [globalLoadingState, setGlobalLoadingState] = React.useState(false);
    const [data, setData] = React.useState<Warehouse[]>([]);
    const [columnId, setColumnId] = React.useState<number>(0);
    const [count, setCount] = React.useState<number>(0);
    const [columns, setColumns] = React.useState<any[]>([]);
    const [currentSortColumn, setCurrentSortColumn] = React.useState<number>(-1);
    const [currentSortDirection, setCurrentSortDirection] = React.useState<string>("none");
    const [page, setPage] = React.useState<number>(0);
    const [shouldRefreshTable, setShouldRefreshTable] = React.useState<boolean>(true);
    const [searchVal, setSearchVal] = React.useState<string>("");

    const classes = useStyles();

    useToolbarTitle(t('main.warehouses'));

    const dispatch = useDispatch();
    const warehousesData = useSelector((state: any) => state.main.warehousesData);
    const user = useSelector((state: any) => state.main.userData);
    const warehouseRemoveProgress = useSelector((state: any) => state.main.warehouseRemoveProgress);
    const removeWarehousesData = useSelector((state: any) => state.main.removeWarehousesData);

    const sortColumns = [
        "location",
        "working_from",
        "working_to",
        "weekends",
        "phone"
    ];

    useEffect(() => {
        let columns: any[] = [
            {
                name: t('main.location'),
                options: {
                    sortDirection: 'none'
                }
            },
            {
                name: t('main.workingFrom'),
                options: {
                    sortDirection: 'none'
                }
            },
            {
                name: t('main.workingTo'),
                options: {
                    sortDirection: 'none'
                }
            },
            {
                name: t('main.weekends'),
                options: {
                    sortDirection: 'none',
                    customBodyRender: (value: boolean) => {
                        if (value) {
                            return <DoneIcon className={classes.available} />;
                        } else {
                            return <ClearIcon className={classes.notAvailable} />;
                        }
                    }
                }
            },
            {
                name: t('main.phone'),
                options: {
                    sortDirection: 'none'
                }
            }
        ];

        if(user.is_superuser) {
            columns.push({
                name: t('main.actions'),
                options: {
                    sort: false,
                    sortDirection: 'none',
                    customBodyRender: (id: number) => {
                        return (
                            <div className={classes.actions}>
                                <Tooltip title={t('main.giveAccess')}>
                                    <IconButton onClick={() => onGiveAccessClick(id)}>
                                        <FaceIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t('main.delete')}>
                                    <IconButton onClick={() => onDeleteClick(id)}>
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        );
                    }
                }
            });
        }

        setColumns(columns);
    }, [classes, t, user.is_superuser]);

    useEffect(() => {
        if(loading || globalLoadingState) {
            dispatch(setGlobalLoading(true));
        } else {
            dispatch(setGlobalLoading(false));
        }
    }, [dispatch, globalLoadingState, loading]);
    
    useEffect(() => {
        if (warehousesData != null && !warehousesData.isFetching) {
            if(warehousesData.data != null && warehousesData.data.results != null) {
                let warehouseMap = [];
                if(user.is_superuser) {
                    warehouseMap = warehousesData.data.results.map((obj: any) => [
                        obj.location,
                        obj.working_from,
                        obj.working_to,
                        obj.weekends,
                        obj.phone,
                        obj.id
                    ]);
                } else {
                    warehouseMap = warehousesData.data.results.map((obj: any) => [
                        obj.location,
                        obj.working_from,
                        obj.working_to,
                        obj.weekends,
                        obj.phone
                    ]);
                }
                setData(warehouseMap);
                setCount(warehousesData.data.count);
            }
            setLoading(false);
            setGlobalLoadingState(false);
        }
        if(warehousesData != null && warehousesData.error) {
            setLoading(false);
            setGlobalLoadingState(false);
        }
        setTimeout(() => {
            setLoading(false);
            setGlobalLoadingState(false);
        }, config.main.connectionTimeout)
    }, [loading, user.is_superuser, warehousesData]);

    useEffect(() => {
        if (removeWarehouseLoading && !warehouseRemoveProgress && removeWarehousesData != null) {
            if (removeWarehousesData.detail == null && removeWarehousesData.status === 12) {
                dispatch(setSnackbar(t('main.warehouseDeleted'), 'success'));
            } else if (removeWarehousesData.detail == null && removeWarehousesData.status !== 12) {
                dispatch(setSnackbar(t('main.unableToDeleteWarehouse'), 'error'));
            } else {
                dispatch(setSnackbar(removeWarehousesData.detail, 'error'));
            }

            setRemoveWarehouseLoading(false);
            dispatch(setGlobalLoading(false));
            dispatch(showSnackbar(true));
            setShouldRefreshTable(true);
        }
    }, [dispatch, removeWarehouseLoading, removeWarehousesData, t, warehouseRemoveProgress]);
    
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
                    dispatch(getWarehouses(page, sortItem, searchVal));
                } else {
                    dispatch(getWarehouses(page, sortItem));
                }
            } else {
                if(searchVal != null && searchVal.length > 0) {
                    dispatch(getWarehouses(page, '-id', searchVal));
                } else {
                    dispatch(getWarehouses(page));
                }
            }
            
            setShouldRefreshTable(false);
        }
    }, [currentSortColumn, currentSortDirection, dispatch, page, searchVal, shouldRefreshTable, sortColumns]);

    const onGiveAccessClick = (id: number) => {
        setColumnId(id);
        setAccessModalOpen(true);
    };
    const onGiveAccessCancel = () => {
        setColumnId(0);
        setAccessModalOpen(false);
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
            dispatch(getWarehouses(tableState.page, serverColumn));
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
                dispatch(getWarehouses(localPage, sortItem, searchValLocal));
            } else {
                dispatch(getWarehouses(localPage, sortItem));
            }
        } else {
            if(searchValLocal != null && searchValLocal.length > 0) {
                dispatch(getWarehouses(localPage, '-id', searchValLocal));
            } else {
                dispatch(getWarehouses(localPage));
            }
        }
    };

    const handleAddClick = () => {
        setModalOpen(true);
    };

    const onModalClose = (shouldRefresh: boolean) => {
        setModalOpen(false);
        if(shouldRefresh) {
            refreshPage(page);
        }
    };

    const onRemoveModalClose = () => {
        setColumnId(0);
        setRemoveModalOpen(false);
    };

    const onDeleteClick = (id: number) => {
        setColumnId(id);
        setRemoveModalOpen(true);
    };

    const onDeleteClickSubmit = (e: any) => {
        e.preventDefault();

        setRemoveWarehouseLoading(true);
        dispatch(setGlobalLoading(true));
        dispatch(removeWarehouse(columnId));

        setRemoveModalOpen(false);
    };

    const renderTable = () => {
        if (loading) {
            return <TablePlaceholder />;
        } else {
            return (
                <div className={classes.paddingBottom}>
                    <MUIDataTable
                        title={user.is_superuser ? t('main.yourWarehouses') : t('main.availableWarehouses')}
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
                            customToolbar: () => <DataTableToolbar isVisible={false} onAddButtonClick={handleAddClick}/>
                        }}
                    />
                </div>
            );
        }
    };

    return (
        <React.Fragment>
            <WarehouseAccess open={accessModalOpen} warehouseId={columnId} onClose={onGiveAccessCancel} />
            <WarehouseAdd open={modalOpen} onClose={onModalClose} />
            <StockedModal
                form
                title={t('main.removeWarehouseTitle')}
                contentText={t('main.removeWarehouseBody')}
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

export default Warehouses;