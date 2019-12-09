import React, {useEffect} from "react";
import { useTranslation } from 'react-i18next';
import useToolbarTitle from "../hooks/toolbarTitle";
import StockedModal from "../components/modal";
import {IconButton, makeStyles, Theme, Tooltip} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {
    getUsers,
    removeUser,
    setGlobalLoading,
    setSnackbar,
    showSnackbar
} from "../redux/actions";
import config from "../config";
import {green, red} from "@material-ui/core/colors";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {ProviderInterface} from "../intefaces";
import StockedTable from "../components/stockedTable";
import TablePlaceholder from "../components/tablePlaceholder";
import UsersAdd from "../components/users/usersAdd";
import moment from "moment";

const Users: React.FC = (props: any) => {
    const { t, i18n } = useTranslation();

    const [modalOpen, setModalOpen] = React.useState(false);
    const [removeModalOpen, setRemoveModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [removeLoading, setRemoveLoading] = React.useState(false);
    const [globalLoadingState, setGlobalLoadingState] = React.useState(false);
    const [userId, setUserId] = React.useState<number>(0);
    const [data, setData] = React.useState<ProviderInterface[]>([]);
    const [count, setCount] = React.useState<number>(0);
    const [columns, setColumns] = React.useState<any[]>([]);
    const [shouldRefreshTable, setShouldRefreshTable] = React.useState<boolean>(true);
    const [firstStart, setFirstStart] = React.useState<boolean>(true);
    const [page, setPage] = React.useState<number>(0);
    const [sortItem, setSortItem] = React.useState<string>("-id");

    const classes = useStyles();

    useToolbarTitle(t('main.users'));

    const dispatch = useDispatch();
    const userListProgress = useSelector((state: any) => state.main.userListProgress);
    const userListData = useSelector((state: any) => state.main.userListData);
    const userRemoveProgress = useSelector((state: any) => state.main.userRemoveProgress);
    const userRemoveData = useSelector((state: any) => state.main.userRemoveData);
    const user = useSelector((state: any) => state.main.userData);

    const sortColumns = [
        [{item: "last_name"}],
        [{item: "email"}],
        [{item: "birthday"}],
        [{item: "mobile_phone"}]
    ];

    useEffect(() => {
        let columns: any[] = [
            {
                name: t('users.fullName'),
                options: {
                    sortDirection: 'none'
                }
            },
            {
                name: t('main.email'),
                options: {
                    sortDirection: 'none'
                }
            },
            {
                name: t('users.birthday'),
                options: {
                    sortDirection: 'none'
                }
            },
            {
                name: t('users.mobilePhone'),
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
        if (!userListProgress && userListData != null) {
            if(userListData.error) {
                setFirstStart(false);
                setLoading(false);
                setGlobalLoadingState(false);
            } else if(userListData.results != null) {
                const usersMap = userListData.results.filter((obj: any) => obj.id !== user.id).map((obj: any) => {
                    return [
                        obj.last_name + " " + obj.first_name + (obj.patronymic != null ? ' ' + obj.patronymic : ''),
                        obj.email,
                        moment(obj.birthday, "YYYY-MM-DD").format(i18n.language === 'en' ? 'DD/MM/YYYY' : 'DD.MM.YYYY').toString(),
                        obj.mobile_phone,
                        obj.id
                    ];
                });
                setData(usersMap);
                const localCount = userListData.count - 1;
                setCount(localCount >= 0 ? localCount : 0);
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
    }, [userListProgress, userListData, user, i18n.language]);

    useEffect(() => {
        if (removeLoading && !userRemoveProgress && userRemoveData != null) {
            if (userRemoveData.detail == null && userRemoveData.status === 12) {
                dispatch(setSnackbar(t('users.userRemoved'), 'success'));
            } else if (userRemoveData.detail == null && userRemoveData.status !== 12) {
                dispatch(setSnackbar(t('users.unableToRemoveUser'), 'error'));
            } else {
                dispatch(setSnackbar(userRemoveData.detail, 'error'));
            }

            setRemoveLoading(false);
            dispatch(setGlobalLoading(false));
            dispatch(showSnackbar(true));
            setShouldRefreshTable(true);
        }
    }, [dispatch, userRemoveData, userRemoveProgress, removeLoading, t]);

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
        setUserId(0);
        setRemoveModalOpen(false);
    };

    const onDeleteClick = (id: number) => {
        setUserId(id);
        setRemoveModalOpen(true);
    };

    const onDeleteClickSubmit = (e: any) => {
        e.preventDefault();

        if (userId != null && userId > 0) {
            setRemoveLoading(true);
            dispatch(setGlobalLoading(true));
            dispatch(removeUser(userId));
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
        dispatch(getUsers(page, sortItem, searchVal));
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
                    title={t('main.users')}
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
            <UsersAdd open={modalOpen} onClose={onModalClose} />
            <StockedModal
                form
                title={t('users.removeUserTitle')}
                contentText={t('users.removeUserBody')}
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

export default Users;
