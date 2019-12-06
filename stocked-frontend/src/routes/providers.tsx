import React, {useEffect} from "react";
import { useTranslation } from 'react-i18next';
import useToolbarTitle from "../hooks/toolbarTitle";
import StockedModal from "../components/modal";
import {IconButton, makeStyles, Theme, Tooltip} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {
    getProviders,
    removeProvider,
    setGlobalLoading,
    setSnackbar,
    showSnackbar
} from "../redux/actions";
import config from "../config";
import {green, red} from "@material-ui/core/colors";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {ProviderInterface} from "../intefaces";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from '@material-ui/icons/Clear';
import StockedTable from "../components/stockedTable";
import TablePlaceholder from "../components/tablePlaceholder";
import ProviderAdd from "../components/providers/providersAdd";

const Providers: React.FC = (props: any) => {
    const { t } = useTranslation();

    const [modalOpen, setModalOpen] = React.useState(false);
    const [removeModalOpen, setRemoveModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [removeLoading, setRemoveLoading] = React.useState(false);
    const [globalLoadingState, setGlobalLoadingState] = React.useState(false);
    const [providerId, setProviderId] = React.useState<number>(0);
    const [data, setData] = React.useState<ProviderInterface[]>([]);
    const [count, setCount] = React.useState<number>(0);
    const [columns, setColumns] = React.useState<any[]>([]);
    const [shouldRefreshTable, setShouldRefreshTable] = React.useState<boolean>(true);
    const [firstStart, setFirstStart] = React.useState<boolean>(true);
    const [page, setPage] = React.useState<number>(0);
    const [sortItem, setSortItem] = React.useState<string>("-id");

    const classes = useStyles();

    useToolbarTitle(t('main.providers'));

    const dispatch = useDispatch();
    const providersGetProgress = useSelector((state: any) => state.main.providersGetProgress);
    const providersData = useSelector((state: any) => state.main.providersData);
    const user = useSelector((state: any) => state.main.userData);
    const providersRemoveProgress = useSelector((state: any) => state.main.providersRemoveProgress);
    const providersRemoveData = useSelector((state: any) => state.main.providersRemoveData);

    const sortColumns = [
        "name",
        "working_from",
        "working_to",
        "average_delivery_time",
        "weekends",
        "phone"
    ];

    useEffect(() => {
        let columns: any[] = [
            {
                name: t('main.name'),
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
                name: t('main.averageDeliveryTime'),
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
            },
            {
                name: t('main.actions'),
                options: {
                    sort: false,
                    sortDirection: 'none',
                    customBodyRender: (id: number) => {
                        return (
                            <div className={classes.actions}>
                                <Tooltip title={t('main.delete')}>
                                    <IconButton onClick={() => onDeleteClick(id)}>
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
    }, [classes, t, user.is_superuser]);

    useEffect(() => {
        if(loading || globalLoadingState) {
            dispatch(setGlobalLoading(true));
        } else {
            dispatch(setGlobalLoading(false));
        }
    }, [dispatch, globalLoadingState, loading]);

    useEffect(() => {
        if (!providersGetProgress && providersData != null) {
            if(providersData.error) {
                setFirstStart(false);
                setLoading(false);
                setGlobalLoadingState(false);
            } else if(providersData.results != null) {
                const providersMap = providersData.results.map((obj: any) => {
                    return [
                        obj.name,
                        obj.working_from,
                        obj.working_to,
                        obj.average_delivery_time,
                        obj.weekends,
                        obj.phone,
                        obj.id
                    ];
                });
                setData(providersMap);
                setCount(providersData.count);
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
    }, [providersData, providersGetProgress]);

    useEffect(() => {
        if (removeLoading && !providersRemoveProgress && providersRemoveData != null) {
            if (providersRemoveData.detail == null && providersRemoveData.status === 12) {
                dispatch(setSnackbar(t('shipments.providerDeleted'), 'success'));
            } else if (providersRemoveData.detail == null && providersRemoveData.status !== 12) {
                dispatch(setSnackbar(t('shipments.unableToDeleteProvider'), 'error'));
            } else {
                dispatch(setSnackbar(providersRemoveData.detail, 'error'));
            }

            setRemoveLoading(false);
            dispatch(setGlobalLoading(false));
            dispatch(showSnackbar(true));
            setShouldRefreshTable(true);
        }
    }, [dispatch, providersRemoveData, providersRemoveProgress, removeLoading, t]);

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
        setProviderId(0);
        setRemoveModalOpen(false);
    };

    const onDeleteClick = (id: number) => {
        setProviderId(id);
        setRemoveModalOpen(true);
    };

    const onDeleteClickSubmit = (e: any) => {
        e.preventDefault();

        if (providerId != null && providerId > 0) {
            setRemoveLoading(true);
            dispatch(setGlobalLoading(true));
            dispatch(removeProvider(providerId));
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
        dispatch(getProviders(page, sortItem, searchVal));
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
                    title={t('main.providers')}
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
            <ProviderAdd open={modalOpen} onClose={onModalClose} />
            <StockedModal
                form
                title={t('shipments.removeProviderTitle')}
                contentText={t('shipments.removeProviderBody')}
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
    available: {
        color: green[300]
    },
    notAvailable: {
        color: red[300]
    }
}));

export default Providers;
