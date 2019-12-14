import React, {useEffect} from "react";
import { useTranslation } from 'react-i18next';
import useToolbarTitle from "../hooks/toolbarTitle";
import StockedModal from "../components/modal";
import {IconButton, LinearProgress, makeStyles, Theme, Tooltip, useTheme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {
    getShipments,
    removeShipment,
    setGlobalLoading, setShipmentStatus,
    setSnackbar,
    showSnackbar
} from "../redux/actions";
import config from "../config";
import {green, orange, red} from "@material-ui/core/colors";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {ShipmentObjectInterface, ShipmentsInterface} from "../intefaces";
import StockedTable from "../components/stockedTable";
import TablePlaceholder from "../components/tablePlaceholder";
import moment, {Moment} from "moment";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import ShipmentsCreate from "../components/shipments/shipmentsCreate";

const Shipments: React.FC = (props: any) => {
    const { t } = useTranslation();

    const [modalOpen, setModalOpen] = React.useState(false);
    const [removeModalOpen, setRemoveModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [removeLoading, setRemoveLoading] = React.useState(false);
    const [changeStatusLoading, setChangeStatusLoading] = React.useState(false);
    const [globalLoadingState, setGlobalLoadingState] = React.useState(false);
    const [data, setData] = React.useState<ShipmentsInterface[]>([]);
    const [count, setCount] = React.useState<number>(0);
    const [columns, setColumns] = React.useState<any[]>([]);
    const [shouldRefreshTable, setShouldRefreshTable] = React.useState<boolean>(true);
    const [firstStart, setFirstStart] = React.useState<boolean>(true);
    const [page, setPage] = React.useState<number>(0);
    const [sortItem, setSortItem] = React.useState<string>("-id");

    const defaultShipmentInfo = {
        id: 0,
        startDate: new Date(),
        approximateDeliveryDate: new Date(),
        delivered: false
    };
    const [shipmentInfo, setShipmentInfo] = React.useState<ShipmentObjectInterface>(defaultShipmentInfo);
    const [shipmentInfoArray] = React.useState<ShipmentObjectInterface[]>([]);

    const classes = useStyles();
    const theme = useTheme();

    useToolbarTitle(t('main.shipments'));

    const dispatch = useDispatch();
    const shipmentsGetProgress = useSelector((state: any) => state.main.shipmentsGetProgress);
    const shipmentsData = useSelector((state: any) => state.main.shipmentsData);
    const user = useSelector((state: any) => state.main.userData);
    const shipmentsRemoveProgress = useSelector((state: any) => state.main.shipmentsRemoveProgress);
    const shipmentsRemoveData = useSelector((state: any) => state.main.shipmentsRemoveData);
    const shipmentsUpdateProgress = useSelector((state: any) => state.main.shipmentsUpdateProgress);
    const shipmentsUpdateData = useSelector((state: any) => state.main.shipmentsUpdateData);

    const sortColumns = [
        [{item: "product"}],
        [{item: "provider"}],
        [{item: "product__warehouse__location"}],
        [{item: "quantity"}],
        [{item: "status"}, {item: "approximate_delivery", prefixAsc: '-', prefixDesc: ''}],
    ];

    useEffect(() => {
        const renderIcon = (iconType = 1) => {
            switch (iconType) {
                case 1:
                    return <DoneIcon className={classes.deliveredIcon} />;
                case 2:
                    return <CloseIcon className={classes.overdueIcon} />;
                default:
                    return <LocalShippingIcon className={classes.inProgressIcon} />;
            }
        };

        const timeDifferenceInPercentage = (startDate: Moment, endDate: Moment) => {
            const today = moment();

            startDate = startDate.startOf('day');
            endDate = endDate.endOf('day');

            const total     =   endDate.toDate().getTime() - startDate.toDate().getTime();
            const elapsed   =   today.toDate().getTime() - startDate.toDate().getTime();

            if (elapsed >= total) {
                return 100;
            } else if (elapsed < 0) {
                return 0;
            }

            return Math.floor(elapsed / total * 100);
        };

        const onChangeStatus = (status: 1 | 2, localShipmentInfo: ShipmentObjectInterface) => {
            if (localShipmentInfo != null && localShipmentInfo.id > 0) {
                setChangeStatusLoading(true);
                dispatch(setGlobalLoading(true));
                dispatch(setShipmentStatus(localShipmentInfo.id, status));
            }
        };

        let columns: any[] = [
            {
                name: t('shipments.product'),
                options: {
                    sortDirection: 'none'
                }
            },
            {
                name: t('shipments.provider'),
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
                name: t('shipments.status'),
                options: {
                    sortDirection: 'none',
                    customBodyRender: (id: number) => {
                        const localShipmentInfo = shipmentInfoArray[id];

                        const startDate = moment(localShipmentInfo.startDate);
                        const endDate = moment(localShipmentInfo.approximateDeliveryDate);

                        const difference = endDate.endOf('day').diff(new Date(), 'days', false);
                        let calculatedPercentage = timeDifferenceInPercentage(startDate, endDate);

                        let daysLeft = t('shipments.daysLeft', {count: difference});
                        let iconType = 0;

                        if (difference < 0) {
                            iconType = 2;
                            daysLeft = t('shipments.overdue');
                            calculatedPercentage = 100;
                        } else if (difference === 0) {
                            daysLeft = t('shipments.arrivingToday');
                        }
                        if (localShipmentInfo.delivered) {
                            iconType = 1;
                            daysLeft = t('shipments.productArrived');
                            calculatedPercentage = 100;
                        }

                        return (
                            <div className={classes.status}>
                                <div className={classes.progress}>
                                    <LinearProgress variant="determinate" value={calculatedPercentage} valueBuffer={100} />
                                </div>
                                <span className={classes.bottomText}>
                                    { renderIcon(iconType) } { daysLeft }
                                </span>
                            </div>
                        );
                    }
                }
            },
            {
                name: t('main.actions'),
                options: {
                    sort: false,
                    sortDirection: 'none',
                    customBodyRender: (id: number) => {
                        const localShipmentInfo = shipmentInfoArray[id];
                        return (
                            <div className={classes.actions}>
                                { !localShipmentInfo.delivered && <Tooltip title={t('shipments.markAsArrived')}>
                                    <IconButton onClick={() => onChangeStatus(2, localShipmentInfo)}>
                                        <DoneIcon />
                                    </IconButton>
                                </Tooltip> }
                                { localShipmentInfo.delivered && <Tooltip title={t('shipments.markAsInProgress')}>
                                    <IconButton onClick={() => onChangeStatus(1, localShipmentInfo)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip> }
                                { user.is_superuser &&
                                    <Tooltip title={t('main.delete')}>
                                        <IconButton onClick={() => onDeleteClick(localShipmentInfo)}>
                                            <DeleteForeverIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </div>
                        );
                    }
                }
            }
        ];

        setColumns(columns);
    }, [classes, t, user.is_superuser, shipmentInfoArray, theme, dispatch]);

    useEffect(() => {
        if(loading || globalLoadingState) {
            dispatch(setGlobalLoading(true));
        } else {
            dispatch(setGlobalLoading(false));
        }
    }, [dispatch, globalLoadingState, loading]);

    useEffect(() => {
        if (!shipmentsGetProgress && shipmentsData != null) {
            if(shipmentsData.error) {
                setFirstStart(false);
                setLoading(false);
                setGlobalLoadingState(false);
            } else if(shipmentsData.results != null) {
                const shipmentsMap = shipmentsData.results.map((obj: any) => {
                    shipmentInfoArray[obj.id] = {
                        id: obj.id,
                        startDate: moment(obj.start_date).toDate(),
                        approximateDeliveryDate: moment(obj.approximate_delivery, "YYYY-MM-DD").toDate(),
                        delivered: obj.status === 2
                    };

                    return [
                        obj.product.name,
                        obj.provider.name,
                        obj.product.warehouse.location,
                        parseInt(obj.quantity, 10),
                        obj.id,
                        obj.id
                    ];
                });
                setData(shipmentsMap);
                setCount(shipmentsData.count);
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
    }, [shipmentsGetProgress, shipmentsData, shipmentInfoArray]);

    useEffect(() => {
        if (removeLoading && !shipmentsRemoveProgress && shipmentsRemoveData != null) {
            if (shipmentsRemoveData.detail == null && shipmentsRemoveData.status === 12) {
                dispatch(setSnackbar(t('shipments.shipmentRemoved'), 'success'));
            } else if (shipmentsRemoveData.detail == null && shipmentsRemoveData.status !== 12) {
                dispatch(setSnackbar(t('shipments.unableToRemoveShipment'), 'error'));
            } else {
                dispatch(setSnackbar(shipmentsRemoveData.detail, 'error'));
            }

            setRemoveLoading(false);
            dispatch(setGlobalLoading(false));
            dispatch(showSnackbar(true));
            setShouldRefreshTable(true);
        }
    }, [dispatch, shipmentsRemoveData, shipmentsRemoveProgress, removeLoading, t]);

    useEffect(() => {
        if (changeStatusLoading && !shipmentsUpdateProgress && shipmentsUpdateData != null) {
            if (shipmentsUpdateData.detail == null && shipmentsUpdateData.status === 12) {
                dispatch(setSnackbar(t('shipments.statusChanged'), 'success'));
            } else if (shipmentsUpdateData.detail == null && shipmentsUpdateData.status !== 12) {
                dispatch(setSnackbar(t('shipments.unableToChangeStatus'), 'error'));
            } else {
                dispatch(setSnackbar(shipmentsUpdateData.detail, 'error'));
            }

            setChangeStatusLoading(false);
            dispatch(setGlobalLoading(false));
            dispatch(showSnackbar(true));
            setShouldRefreshTable(true);
        }
    }, [dispatch, shipmentsUpdateData, shipmentsUpdateProgress, changeStatusLoading, t]);

    const handleAddClick = () => {
        setModalOpen(true);
    };

    const onModalClose = (shouldRefresh: boolean) => {
        setModalOpen(false);
        if(shouldRefresh) {
            setShouldRefreshTable(shouldRefresh);
        }
    };

    const onRemoveModalClose = () => {
        setShipmentInfo(defaultShipmentInfo);
        setRemoveModalOpen(false);
    };

    const onDeleteClick = (localShipmentInfo: ShipmentObjectInterface) => {
        setShipmentInfo(localShipmentInfo);
        setRemoveModalOpen(true);
    };

    const onDeleteClickSubmit = (e: any) => {
        e.preventDefault();

        if (shipmentInfo != null && shipmentInfo.id > 0) {
            setRemoveLoading(true);
            dispatch(setGlobalLoading(true));
            dispatch(removeShipment(shipmentInfo.id));
        }

        setRemoveModalOpen(false);
    };

    const onRequest = (type: "sort" | "changePage" | "search" | "refreshTable", page: number, sortItem: string | null, searchValLocal: string | null) => {
        if (firstStart) {
            setLoading(true);
        } else {
            setGlobalLoadingState(true);
        }

        setPage(page);
        if (sortItem != null) {
            setSortItem(sortItem);
        }

        dispatch(getShipments(page, sortItem, searchValLocal));
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
                    title={t('main.shipments')}
                    count={count}
                    columns={columns}
                    data={data}
                    sortColumns={sortColumns}
                    sortItem={sortItem}
                    addEnabled={user.is_superuser != null ? user.is_superuser : false}
                    onAddClick={handleAddClick}
                    onRequest={onRequest}
                    page={page}
                    refreshTable={shouldRefreshTable}
                    onTableRefreshed={onTableRefreshed}
                />
            );
        }
    };

    return (
        <React.Fragment>
            <ShipmentsCreate open={modalOpen} onClose={onModalClose} />
            <StockedModal
                form
                title={t('shipments.removeShipmentTitle')}
                contentText={t('shipments.removeShipmentBody')}
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
    },
    status: {
        display: 'flex',
        flexDirection: 'column',
    },
    progress: {
        flex: 1
    },
    bottomText: {
        display: 'flex',
        marginTop: 8,
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            marginTop: 0
        }
    },
    deliveredIcon: {
        marginRight: 8,
        color: green[300]
    },
    inProgressIcon: {
        marginRight: 8,
        color: orange[300]
    },
    overdueIcon: {
        marginRight: 8,
        color: red[300]
    }
}));

export default Shipments;
