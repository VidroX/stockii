import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {
    CircularProgress,
    makeStyles,
    TextField,
    Theme
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {Autocomplete} from "@material-ui/lab";
import {
    getProducts,
    setSnackbar,
    showSnackbar
} from "../../redux/actions";
import {ProductSelectorInterface, OptionType, WarehouseFull} from "../../intefaces";

const ProductSelector: React.FC<ProductSelectorInterface> = (props: ProductSelectorInterface) => {
    const {
        onSelect,
        onClear,
        error,
        helperText
    } = props;

    const { t } = useTranslation();
    const classes = useStyles();

    const [warehouseArray, setWarehouseArray] = React.useState<WarehouseFull[]>([]);

    const [suggestions, setSuggestions] = React.useState<OptionType[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<OptionType>({
        id: 0,
        label: ''
    });

    const dispatch = useDispatch();
    const productsGetProgress = useSelector((state: any) => state.main.productsGetProgress);
    const productsData = useSelector((state: any) => state.main.productsData);

    useEffect(() => {
        if (suggestionsLoading && !productsGetProgress && productsData != null) {
            if (productsData.error) {
                dispatch(setSnackbar(productsData.error, 'error'));
                dispatch(showSnackbar(true));
            }

            setSuggestions(productsData.results.map((obj: any) => {
                warehouseArray[obj.id] = obj.warehouse;

                return {
                    id: obj.id,
                    label: obj.name + (obj.warehouse != null ? ' (' + obj.warehouse.location + ')' : '')
                };
            }));

            setSuggestionsLoading(false);
        }
    }, [dispatch, productsData, productsGetProgress, suggestionsLoading, warehouseArray]);

    useEffect(() => {
        setSuggestionsLoading(true);
        dispatch(getProducts(0, '-id'));
    }, [dispatch]);

    return (
        <Autocomplete
            className={classes.textField}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionLabel={option => option != null && option.label != null ? option.label : ""}
            options={suggestions}
            loading={suggestionsLoading}
            freeSolo={false}
            onChange={(event: object, value: OptionType) => {
                if (value != null) {
                    if(onSelect != null) {
                        onSelect(value, warehouseArray[value.id]);
                    }
                    setValue(value);
                } else {
                    setSuggestionsLoading(true);
                    dispatch(getProducts(0, '-id'));
                }
            }}
            onInputChange={(event: object, value: string) => {
                if(value != null && value.length <= 0) {
                    setValue({
                        id: 0,
                        label: ''
                    });
                    setWarehouseArray([]);
                    if (onClear != null) {
                        onClear();
                    }
                }
                if (value == null) {
                    setWarehouseArray([]);
                    setValue({
                        id: 0,
                        label: ''
                    });
                }

                setSuggestionsLoading(true);
                dispatch(getProducts(0, '-id', value));
            }}
            renderInput={params => (
                <TextField
                    {...params}
                    label={t('main.selectProduct')}
                    fullWidth
                    required
                    error={error != null ? error : false}
                    helperText={helperText}
                    variant="outlined"
                    value={value.label}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {suggestionsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
};

const useStyles = makeStyles((theme: Theme) => ({
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

export default ProductSelector;
