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
    getWarehouses,
    setSnackbar,
    showSnackbar
} from "../../redux/actions";
import {OptionType, WarehouseSelectorInterface} from "../../intefaces";

const WarehouseSelector: React.FC<WarehouseSelectorInterface> = (props: WarehouseSelectorInterface) => {
    const {
        onSelect,
        error,
        helperText
    } = props;

    const { t } = useTranslation();
    const classes = useStyles();

    const [suggestions, setSuggestions] = React.useState<OptionType[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<OptionType>({id: 0, label: ""});

    const dispatch = useDispatch();
    const warehousesData = useSelector((state: any) => state.main.warehousesData);

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
                        onSelect(value);
                    }
                    setValue(value);
                }
            }}
            onInputChange={(event: object, value: string) => {
                if(value != null && value.length <= 0) {
                    setValue({
                        id: 0,
                        label: ""
                    });
                }
                if (value == null) {
                    setValue({
                        id: 0,
                        label: ""
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

export default WarehouseSelector;