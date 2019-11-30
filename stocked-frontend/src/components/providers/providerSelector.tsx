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
    getProviders,
    setSnackbar,
    showSnackbar
} from "../../redux/actions";
import {ProviderOptionType, ProviderSelectorInterface} from "../../intefaces";

const ProviderSelector: React.FC<ProviderSelectorInterface> = (props: ProviderSelectorInterface) => {
    const {
        onSelect,
        onClear,
        error,
        helperText
    } = props;

    const { t } = useTranslation();
    const classes = useStyles();

    const [suggestions, setSuggestions] = React.useState<ProviderOptionType[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<ProviderOptionType>({
        values: {
          id: 0,
          label: ""
        },
        delivery: {
            workingFrom: "",
            workingTo: "",
            averageDeliveryTime: 0,
            weekends: false
        }
    });

    const dispatch = useDispatch();
    const providersGetProgress = useSelector((state: any) => state.main.providersGetProgress);
    const providersData = useSelector((state: any) => state.main.providersData);

    useEffect(() => {
        if (suggestionsLoading && !providersGetProgress && providersData != null) {
            if (providersData.error) {
                dispatch(setSnackbar(providersData.error, 'error'));
                dispatch(showSnackbar(true));
            }

            setSuggestions(providersData.results.map((obj: any) => {
                return {
                    values: {
                        id: obj.id,
                        label: obj.name
                    },
                    delivery: {
                        workingFrom: obj.working_from,
                        workingTo: obj.working_to,
                        averageDeliveryTime: obj.average_delivery_time,
                        weekends: obj.weekends
                    }
                };
            }));

            setSuggestionsLoading(false);
        }
    }, [dispatch, providersData, providersGetProgress, suggestionsLoading]);

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
            getOptionLabel={option => option != null && option.values != null && option.values.label != null ? option.values.label : ""}
            options={suggestions}
            loading={suggestionsLoading}
            freeSolo={false}
            onChange={(event: object, value: ProviderOptionType) => {
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
                        values: {
                            id: 0,
                            label: ""
                        },
                        delivery: {
                            workingFrom: "",
                            workingTo: "",
                            averageDeliveryTime: 0,
                            weekends: false
                        }
                    });
                    if (onClear != null) {
                        onClear();
                    }
                }
                if (value == null) {
                    setValue({
                        values: {
                            id: 0,
                            label: ""
                        },
                        delivery: {
                            workingFrom: "",
                            workingTo: "",
                            averageDeliveryTime: 0,
                            weekends: false
                        }
                    });
                }

                setSuggestionsLoading(true);
                dispatch(getProviders(0, '-id', value));
            }}
            renderInput={params => (
                <TextField
                    {...params}
                    label={t('main.selectProvider')}
                    fullWidth
                    required
                    error={error != null ? error : false}
                    helperText={helperText}
                    variant="outlined"
                    value={value.values.label}
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

export default ProviderSelector;