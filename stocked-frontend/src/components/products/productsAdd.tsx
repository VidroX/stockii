import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {
    Button, CircularProgress,
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
import config from "../../config";
import {addProduct, getWarehouses, setGlobalLoading, setSnackbar, showSnackbar} from "../../redux/actions";
import {Autocomplete} from "@material-ui/lab";

interface OptionType {
    id: number,
    label: string
}

interface ProductAdd {
    open: boolean,
    onOpen?(): void,
    onClose?(shouldRefresh: boolean): void
}

const ProductsAdd: React.FC<ProductAdd> = (props: ProductAdd) => {
    const {
        onOpen,
        onClose,
        open
    } = props;

    const { t } = useTranslation();

    const theme = useTheme();
    const classes = useStyles();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [name, setName] = React.useState({
        error: false,
        errorText: "",
        value: ""
    });
    const [warehouse, setWarehouse] = React.useState({
        error: false,
        errorText: "",
        value: "",
        id: 0
    });
    const [quantity, setQuantity] = React.useState({
        error: false,
        errorText: "",
        value: 0 | NaN
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const [autocompleteOpen, setAutocompleteOpen] = React.useState<boolean>(false);
    const [suggestions, setSuggestions] = React.useState<OptionType[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = React.useState<boolean>(false);

    const dispatch = useDispatch();
    const productsAddProgress = useSelector((state: any) => state.main.productsAddProgress);
    const productsAddData = useSelector((state: any) => state.main.productsAddData);
    const warehousesData = useSelector((state: any) => state.main.warehousesData);

    const clearFields = (clearValues: boolean = false) => {
        setName({
           error: false,
           errorText: "",
           value: clearValues ? "" : name.value
        });
        setWarehouse({
            error: false,
            errorText: "",
            value: clearValues ? "" : warehouse.value,
            id: clearValues ? 0 : warehouse.id
        });
        setQuantity({
            error: false,
            errorText: "",
            value: clearValues ? 0 : quantity.value
        });
    };
    
    useEffect(() => {
        if (!open) {
            setName({
                error: false,
                errorText: "",
                value: ""
            });
            setWarehouse({
                error: false,
                errorText: "",
                value: "",
                id: 0
            });
            setQuantity({
                error: false,
                errorText: "",
                value: 0
            });
        }
        setSuggestionsLoading(true);
        dispatch(getWarehouses(0));
    }, [dispatch, open]);

    useEffect(() => {
        if (suggestionsLoading && !warehousesData.isFetching && warehousesData.data != null) {
            if (warehousesData.data.error) {
                dispatch(setSnackbar(warehousesData.data.error, 'error'));
                dispatch(showSnackbar(true));
            }

            setSuggestions(warehousesData.data.results.map((obj: any) => {
                return {
                    id: obj.id,
                    label: obj.location
                };
            }));

            setSuggestionsLoading(false);
        }
    }, [dispatch, suggestionsLoading, warehousesData]);

    useEffect(() => {
        if (loading && !productsAddProgress && productsAddData == null) {
            dispatch(setSnackbar(t('products.unableToAddProduct'), 'error'));
            dispatch(showSnackbar(true));

            setLoading(false);
            dispatch(setGlobalLoading(false));

            if(onClose) {
                onClose(true);
            }
        }
        if (loading && !productsAddProgress && productsAddData != null) {
            setLoading(false);
            dispatch(setGlobalLoading(false));
            dispatch(setSnackbar(t('products.productAdded'), 'success'));
            dispatch(showSnackbar(true));

            if(onClose) {
                onClose(true);
            }
        }
    }, [dispatch, loading, name, onClose, productsAddData, productsAddProgress, t, warehouse]);

    const onSubmit = (e: any) => {
        e.preventDefault();
        clearFields();

        if (name.value.length < 1) {
            setName({
                error: true,
                errorText: t('common.fieldEmpty'),
                value: name.value
            });
        }
        if (warehouse.value.length < 1 || warehouse.id < 1) {
            setWarehouse({
                error: true,
                errorText: t('products.incorrectWarehouse'),
                value: warehouse.value,
                id: warehouse.id
            });
        }
        if (quantity.value < 0) {
            setQuantity({
                error: true,
                errorText: t('products.incorrectQuantity'),
                value: quantity.value
            });
        }

        if(isEverythingCompleted()) {
            setLoading(true);
            dispatch(setGlobalLoading(true));

            dispatch(addProduct(name.value, warehouse.id, quantity.value));

            setTimeout(() => {
                setLoading(false);
            }, config.main.connectionTimeout)
        }
    };

    const isEverythingCompleted = (): boolean => {
        return (name.value.length > 0 && !name.error) &&
            (warehouse.value.length > 0 && warehouse.id > 0 && !warehouse.error) &&
            (!isNaN(quantity.value) && quantity.value >= 0 && !quantity.error);
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => onClose != null ? onClose(false) : {}}
            onBackdropClick={() => onClose != null ? onClose(false) : {}}
            onEnter={onOpen}
            aria-labelledby="form-dialog-title"
            scroll="body"
        >
            <form className={classes.form} onSubmit={onSubmit} method="post">
                <DialogTitle>{ t('products.addProduct') }</DialogTitle>
                <DialogContent className={classes.content}>
                    <TextField
                        className={classes.textField}
                        label={t('products.name')}
                        variant="outlined"
                        value={name.value}
                        required
                        error={name.error}
                        helperText={name.errorText}
                        onChange={(e) => {
                            setName({
                                error: false,
                                errorText: "",
                                value: e.target.value
                            });
                        }}
                    />
                    <Autocomplete
                        className={classes.textField}
                        open={autocompleteOpen}
                        onOpen={() => {
                            setAutocompleteOpen(true);
                        }}
                        onClose={() => {
                            setAutocompleteOpen(false);
                        }}
                        getOptionLabel={option => option != null && option.label != null ? option.label : ""}
                        options={suggestions}
                        loading={suggestionsLoading}
                        freeSolo={false}
                        onChange={(event: object, value: OptionType) => {
                            if (value != null) {
                                setWarehouse({
                                    error: false,
                                    errorText: "",
                                    value: value.label,
                                    id: value.id
                                });
                            }
                        }}
                        onInputChange={(event: object, value: string) => {
                            if(value != null && value.length <= 0) {
                                setWarehouse({
                                    error: false,
                                    errorText: "",
                                    value: "",
                                    id: 0
                                });
                            }
                            if (value == null) {
                                setWarehouse({
                                    error: false,
                                    errorText: "",
                                    value: "",
                                    id: 0
                                });
                            }

                            setSuggestionsLoading(true);
                            dispatch(getWarehouses(0, '-id', value));
                        }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={t('products.selectWarehouse')}
                                fullWidth
                                required
                                error={warehouse.error}
                                helperText={warehouse.errorText}
                                variant="outlined"
                                value={warehouse.value}
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
                    <TextField
                        className={classes.textField}
                        label={t('products.quantity')}
                        variant="outlined"
                        value={isNaN(quantity.value) ? 0 : quantity.value}
                        required
                        error={quantity.error}
                        helperText={quantity.errorText}
                        type="number"
                        inputProps={{ min: "0", step: "1" }}
                        onChange={(e) => {
                            setQuantity({
                                error: false,
                                errorText: "",
                                value: parseInt(e.target.value) != null ? parseInt(e.target.value) : 0
                            });
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => onClose != null ? onClose(false) : {}} color="primary">
                        { t('main.cancel') }
                    </Button>
                    <Button disabled={!isEverythingCompleted()} type="submit" color="primary">
                        { t('main.add') }
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
    },
    textField: {
        display: 'flex',
        marginBottom: theme.spacing(2),
        width: 300,
        [theme.breakpoints.down('sm')]: {
            width: 'auto',
            flex: 1
        }
    }
}));

export default ProductsAdd;