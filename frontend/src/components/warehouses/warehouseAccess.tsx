import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    TextField,
    Theme,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {Autocomplete} from "@material-ui/lab";
import {addAccessToWarehouse, getUsers, setGlobalLoading, setSnackbar, showSnackbar} from "../../redux/actions";
import {OptionType, WarehouseAccessInterface} from "../../intefaces";

const WarehouseAccess: React.FC<WarehouseAccessInterface> = (props: WarehouseAccessInterface) => {
    const {
        onOpen,
        onClose,
        open,
        warehouseId
    } = props;

    const { t } = useTranslation();

    const theme = useTheme();
    const classes = useStyles();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [resultLoading, setResultLoading] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<object>({});
    const [userId, setUserId] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [suggestions, setSuggestions] = React.useState<OptionType[]>([]);
    const [autocompleteOpen, setAutocompleteOpen] = React.useState<boolean>(false);

    const dispatch = useDispatch();
    const userListData = useSelector((state: any) => state.main.userListData);
    const isDataLoading = useSelector((state: any) => state.main.isDataLoading);
    const userAccessProgress = useSelector((state: any) => state.main.userAccessProgress);
    const userAccessData = useSelector((state: any) => state.main.userAccessData);
    const user = useSelector((state: any) => state.main.userData);

    useEffect(() => {
        if (!open) {
            setSuggestions([]);
            setValue({});
            return;
        }
        setLoading(true);
        dispatch(getUsers(0));
    }, [dispatch, open]);

    useEffect(() => {
        if (loading && userListData != null) {
            if (userListData.error) {
                dispatch(setSnackbar(userListData.error, 'error'));
                dispatch(showSnackbar(true));
            }

            setSuggestions(userListData.results.filter((obj: any) => obj.id !== user.id).map((obj: any) => {
                return {
                    id: obj.id,
                    label: obj.last_name + " " + obj.first_name + (obj.patronymic != null ? " " + obj.patronymic : "")
                };
            }));

            setLoading(false);
        }
    }, [dispatch, loading, userListData, user.id]);

    useEffect(() => {
        if (resultLoading && !userAccessProgress && userAccessData != null && userAccessData.status === 15) {
            if (userAccessData.error) {
                dispatch(setSnackbar(userAccessData.error, 'error'));
            } else {
                dispatch(setSnackbar(t('main.accessGranted'), 'success'));
            }

            setResultLoading(false);
            dispatch(setGlobalLoading(false));
            dispatch(showSnackbar(true));
        } else if (resultLoading && !userAccessProgress && userAccessData != null && userAccessData.status !== 15) {
            setResultLoading(false);
            dispatch(setGlobalLoading(false));
            dispatch(setSnackbar(t('main.unableToGrant'), 'error'));
            dispatch(showSnackbar(true));
        }
    }, [dispatch, isDataLoading, resultLoading, t, userAccessData, userAccessProgress]);

    const handleChange = (event: object, value: any) => {
        if (value != null) {
            setValue(value);
        }
        if(value != null && value.id != null) {
            setUserId(value.id);
        }
    };

    const handleSearch = (event: object, value: string) => {
        setLoading(true);
        dispatch(getUsers(0, value));
    };

    const onSubmit = (e: any) => {
        e.preventDefault();

        setResultLoading(true);
        dispatch(setGlobalLoading(true));
        dispatch(addAccessToWarehouse(userId, warehouseId));

        if (onClose != null) {
            onClose();
        }
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={onClose}
            onBackdropClick={onClose}
            onEnter={onOpen}
            aria-labelledby="form-dialog-title"
            scroll="body"
        >
            <form className={classes.form} onSubmit={onSubmit} method="post">
                <DialogTitle>{ t('main.access') }</DialogTitle>
                <DialogContent className={classes.content}>
                    <Autocomplete
                        style={{ width: fullScreen ? 'auto' : 300 }}
                        open={autocompleteOpen}
                        onOpen={() => {
                            setAutocompleteOpen(true);
                        }}
                        onClose={() => {
                            setAutocompleteOpen(false);
                        }}
                        getOptionLabel={option => option != null && option.label != null ? option.label : ""}
                        options={suggestions}
                        loading={loading}
                        freeSolo={false}
                        onChange={handleChange}
                        onInputChange={handleSearch}
                        value={value}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={t('main.selectUser')}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={onClose} color="primary">
                        { t('main.cancel') }
                    </Button>
                    <Button disabled={userId <= 0} type="submit" color="primary">
                        { t('main.giveAccess') }
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        [theme.breakpoints.down('sm')]: {
            flex: 1
        }
    },
    form: {
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: '100%'
        }
    }
}));

export default WarehouseAccess;
