import React, {useEffect} from "react";
import { useTranslation } from 'react-i18next';
import useToolbarTitle from "../hooks/toolbarTitle";
import StockedModal from "../components/modal";
import {IconButton, LinearProgress, makeStyles, Theme, Tooltip, useTheme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteTrigger,
    getTriggers,
    setGlobalLoading,
    setSnackbar,
    showSnackbar
} from "../redux/actions";
import config from "../config";
import {green, orange, red} from "@material-ui/core/colors";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {ShipmentsInterface, TriggerObjectInterface} from "../intefaces";
import StockedTable from "../components/stockedTable";
import TablePlaceholder from "../components/tablePlaceholder";
import moment, {Moment} from "moment";
import FlashOnIcon from '@material-ui/icons/FlashOn';
import DoneIcon from '@material-ui/icons/Done';
import TriggerCreate from "../components/triggers/triggersCreate";

const Triggers: React.FC = (props: any) => {
    const { t, i18n } = useTranslation();

    const [modalOpen, setModalOpen] = React.useState(false);
    const [removeModalOpen, setRemoveModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [removeLoading, setRemoveLoading] = React.useState(false);
    const [globalLoadingState, setGlobalLoadingState] = React.useState(false);
    const [data, setData] = React.useState<ShipmentsInterface[]>([]);
    const [count, setCount] = React.useState<number>(0);
    const [columns, setColumns] = React.useState<any[]>([]);
    const [shouldRefreshTable, setShouldRefreshTable] = React.useState<boolean>(true);
    const [firstStart, setFirstStart] = React.useState<boolean>(true);
    const [page, setPage] = React.useState<number>(0);
    const [sortItem, setSortItem] = React.useState<string>("-id");

    const defaultTriggerInfo = {
        id: 0,
        creationDate: new Date(),
        activationDate: new Date(),
        type: 0,
        activated: false
    };
    const [triggerInfo, setTriggerInfo] = React.useState<TriggerObjectInterface>(defaultTriggerInfo);
    const [triggerInfoArray] = React.useState<TriggerObjectInterface[]>([]);

    const classes = useStyles();
    const theme = useTheme();

    useToolbarTitle(t('main.triggers'));

    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.main.userData);
    const triggersGetProgress = useSelector((state: any) => state.main.triggersGetProgress);
    const triggersData = useSelector((state: any) => state.main.triggersData);
    const triggersDeleteProgress = useSelector((state: any) => state.main.triggersDeleteProgress);
    const triggersDeleteData = useSelector((state: any) => state.main.triggersDeleteData);

    const sortColumns = [
        [{item: "name"}],
        [{item: "product"}],
        [{item: "polymorphic_ctype"}],
        [{item: "status"}, {item: "activation_date", prefixAsc: '-', prefixDesc: ''}],
    ];

    useEffect(() => {
        const renderIcon = (activated = false) => {
            if (activated) {
                return <DoneIcon className={classes.deliveredIcon} />;
            } else {
                return <FlashOnIcon className={classes.inProgressIcon} />;
            }
        };

        const timeDifferenceInPercentage = (startDate: Moment, endDate: Moment, toTheEndOfDay = false) => {
            const today = moment();

            endDate = endDate.startOf('day');
            if (toTheEndOfDay) {
                endDate = endDate.endOf('day');
            }

            const total     =   endDate.toDate().getTime() - startDate.toDate().getTime();
            const elapsed   =   today.toDate().getTime() - startDate.toDate().getTime();

            if (elapsed >= total) {
                return 100;
            } else if (elapsed < 0) {
                return 0;
            }

            return Math.floor(elapsed / total * 100);
        };

        let columns: any[] = [
            {
                name: t('main.name'),
                options: {
                    sortDirection: 'none'
                }
            },
            {
                name: t('shipments.product'),
                options: {
                    sortDirection: 'none'
                }
            },
            {
                name: t('triggers.type'),
                options: {
                    sortDirection: 'none'
                }
            },
            {
                name: t('shipments.status'),
                options: {
                    sortDirection: 'none',
                    customBodyRender: (id: number) => {
                        const localTriggerInfo = triggerInfoArray[id];

                        const startDate = moment(localTriggerInfo.creationDate);
                        const endDate = moment(localTriggerInfo.activationDate);

                        const difference = endDate.endOf('day').diff(new Date(), 'days', false);
                        let calculatedPercentage = timeDifferenceInPercentage(startDate, endDate);

                        let daysLeft = t('shipments.daysLeft', {count: difference});

                        if (difference === 0) {
                            daysLeft = t('triggers.activatingToday');
                        }
                        if (localTriggerInfo.activated) {
                            daysLeft = t('triggers.activated');
                            calculatedPercentage = 100;
                        }

                        return (
                            <div className={classes.status}>
                                <div className={classes.progress}>
                                    <LinearProgress variant="determinate" value={calculatedPercentage} valueBuffer={100} />
                                </div>
                                <span className={classes.bottomText}>
                                    { renderIcon(localTriggerInfo.activated) } { daysLeft } ({i18n.language === 'en' ? endDate.format('DD/MM/YYYY').toString() : endDate.format('DD.MM.YYYY').toString()})
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
                        const localTriggerInfo = triggerInfoArray[id];
                        return (
                            <div className={classes.actions}>
                                <Tooltip title={t('main.delete')}>
                                    <IconButton onClick={() => onDeleteClick(localTriggerInfo)}>
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
    }, [classes, t, user.is_superuser, triggerInfoArray, theme, dispatch, i18n.language]);

    useEffect(() => {
        if(loading || globalLoadingState) {
            dispatch(setGlobalLoading(true));
        } else {
            dispatch(setGlobalLoading(false));
        }
    }, [dispatch, globalLoadingState, loading]);

    useEffect(() => {
        if (!triggersGetProgress && triggersData != null) {
            if(triggersData.error) {
                setFirstStart(false);
                setLoading(false);
                setGlobalLoadingState(false);
            } else if(triggersData.results != null) {
                const triggersMap = triggersData.results.map((obj: any) => {
                    triggerInfoArray[obj.id] = {
                        id: obj.id,
                        creationDate: moment(obj.creation_date, "YYYY-MM-DD").toDate(),
                        activationDate: moment(obj.activation_date, "YYYY-MM-DD").toDate(),
                        type: obj.type,
                        activated: obj.status === 2
                    };

                    return [
                        obj.name,
                        obj.product.name,
                        obj.resourcetype === "RestockTrigger" ? t('triggers.triggerType1') : t('triggers.triggerType2'),
                        obj.id,
                        obj.id
                    ];
                });
                setData(triggersMap);
                setCount(triggersData.count);
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
    }, [triggersGetProgress, triggersData, triggerInfoArray, t]);

    useEffect(() => {
        if (removeLoading && !triggersDeleteProgress && triggersDeleteData != null) {
            if (triggersDeleteData.detail == null && triggersDeleteData.status === 12) {
                dispatch(setSnackbar(t('triggers.triggerRemoved'), 'success'));
            } else if (triggersDeleteData.detail == null && triggersDeleteData.status !== 12) {
                dispatch(setSnackbar(t('triggers.unableToRemoveTrigger'), 'error'));
            } else {
                dispatch(setSnackbar(triggersDeleteData.detail, 'error'));
            }

            setRemoveLoading(false);
            dispatch(setGlobalLoading(false));
            dispatch(showSnackbar(true));
            setShouldRefreshTable(true);
        }
    }, [dispatch, triggersDeleteData, triggersDeleteProgress, removeLoading, t]);

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
        setTriggerInfo(defaultTriggerInfo);
        setRemoveModalOpen(false);
    };

    const onDeleteClick = (localTriggerInfo: TriggerObjectInterface) => {
        setTriggerInfo(localTriggerInfo);
        setRemoveModalOpen(true);
    };

    const onDeleteClickSubmit = (e: any) => {
        e.preventDefault();

        if (triggerInfo != null && triggerInfo.id > 0) {
            setRemoveLoading(true);
            dispatch(setGlobalLoading(true));
            dispatch(deleteTrigger(triggerInfo.id));
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

        dispatch(getTriggers(page, sortItem, searchValLocal));
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
                    title={t('main.triggers')}
                    count={count}
                    columns={columns}
                    data={data}
                    sortColumns={sortColumns}
                    sortItem={sortItem}
                    addEnabled={true}
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
            <TriggerCreate open={modalOpen} onClose={onModalClose} />
            <StockedModal
                form
                title={t('triggers.removeTriggerTitle')}
                contentText={t('triggers.removeTriggerBody')}
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

export default Triggers;
