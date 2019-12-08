import React, {useEffect} from "react";
import { useTranslation } from 'react-i18next';
import useToolbarTitle from "../hooks/toolbarTitle";
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
import StockedTable from "../components/stockedTable";

const Warehouses: React.FC = (props: any) => {
    const { t } = useTranslation();
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
    const [shouldRefreshTable, setShouldRefreshTable] = React.useState<boolean>(true);
    const [firstStart, setFirstStart] = React.useState<boolean>(true);
    const [page, setPage] = React.useState<number>(0);
    const [sortItem, setSortItem] = React.useState<string>("-id");

    const classes = useStyles();

    useToolbarTitle(t('main.warehouses'));

    const dispatch = useDispatch();
    const warehousesData = useSelector((state: any) => state.main.warehousesData);
    const user = useSelector((state: any) => state.main.userData);
    const warehouseRemoveProgress = useSelector((state: any) => state.main.warehouseRemoveProgress);
    const removeWarehousesData = useSelector((state: any) => state.main.removeWarehousesData);

    const sortColumns = [
        [{item: "location"}],
        [{item: "working_from"}],
        [{item: "working_to"}],
        [{item: "weekends"}],
        [{item: "phone"}]
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
            if(warehousesData.error) {
                setFirstStart(false);
                setLoading(false);
                setGlobalLoadingState(false);
            } else if(warehousesData.data != null && warehousesData.data.results != null) {
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
            setFirstStart(false);
            setLoading(false);
            setGlobalLoadingState(false);
        }
        setTimeout(() => {
            setFirstStart(false);
            setLoading(false);
            setGlobalLoadingState(false);
        }, config.main.connectionTimeout)
    }, [user.is_superuser, warehousesData]);

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

    const onGiveAccessClick = (id: number) => {
        setColumnId(id);
        setAccessModalOpen(true);
    };
    const onGiveAccessCancel = () => {
        setColumnId(0);
        setAccessModalOpen(false);
    };

    const handleAddClick = () => {
        setModalOpen(true);
    };

    const onModalClose = (shouldRefresh: boolean) => {
        setModalOpen(false);
        if(shouldRefresh) {
            setShouldRefreshTable(true);
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
        dispatch(getWarehouses(page, sortItem, searchVal));
    };

    const onTableRefreshed = () => {
        setShouldRefreshTable(false);
    };

    const renderTable = () => {
        if (loading) {
            return <TablePlaceholder />;
        } else {
            return (
                <StockedTable
                    page={page}
                    title={user.is_superuser ? t('main.yourWarehouses') : t('main.availableWarehouses')}
                    count={count}
                    columns={columns}
                    data={data}
                    sortColumns={sortColumns}
                    sortItem={sortItem}
                    addEnabled={false}
                    onAddClick={handleAddClick}
                    onRequest={onRequest}
                    refreshTable={shouldRefreshTable}
                    onTableRefreshed={onTableRefreshed}
                />
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
