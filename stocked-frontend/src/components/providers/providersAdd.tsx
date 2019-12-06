import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel,
    makeStyles,
    TextField,
    Theme,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import MaskedInput from "react-text-mask";
import config from "../../config";
import {addProvider, setGlobalLoading, setSnackbar, showSnackbar} from "../../redux/actions";
import PhoneMask from "../phoneMask";

interface ProvidersAddInterface {
    open: boolean,
    onOpen?(): void,
    onClose?(shouldRefresh: boolean): void
}

interface TextMaskCustomProps {
    inputRef: (ref: HTMLInputElement | null) => void;
}

function TimeMask(props: TextMaskCustomProps) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref: any) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/, /[0-9]/, ' ', ':', ' ', /[0-9]/, /[0-9]/, ' ', ':', ' ', /[0-9]/, /[0-9]/]}
            showMask
        />
    );
}

const ProviderAdd: React.FC<ProvidersAddInterface> = (props: ProvidersAddInterface) => {
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
    const [avgDelivery, setAvgDelivery] = React.useState({
        error: false,
        errorText: "",
        value: 1
    });
    const [workingFrom, setWorkingFrom] = React.useState({
        error: false,
        errorText: "",
        value: ""
    });
    const [workingTo, setWorkingTo] = React.useState({
        error: false,
        errorText: "",
        value: ""
    });
    const [weekends, setWeekends] = React.useState<boolean>(false);
    const [phone, setPhone] = React.useState({
        error: false,
        errorText: "",
        value: "",
        clearValue: ""
    });
    const [loading, setLoading] = React.useState<boolean>(false);

    const dispatch = useDispatch();
    const providersCreateProgress = useSelector((state: any) => state.main.providersCreateProgress);
    const providersCreateData = useSelector((state: any) => state.main.providersCreateData);

    const clearFields = (clearValues: boolean = false) => {
        setName({
           error: false,
           errorText: "",
           value: clearValues ? "" : name.value
        });
        setAvgDelivery({
            error: false,
            errorText: "",
            value: clearValues ? 0 : avgDelivery.value
        });
        setWorkingFrom({
            error: false,
            errorText: "",
            value: clearValues ? "" : workingFrom.value
        });
        setWorkingTo({
            error: false,
            errorText: "",
            value: clearValues ? "" : workingTo.value
        });
        setPhone({
            error: false,
            errorText: "",
            value: clearValues ? "" : phone.value,
            clearValue: clearValues ? "" : phone.clearValue
        });
        setWeekends(clearValues ? false : weekends);
    };

    useEffect(() => {
        if (!open) {
            setName({
                error: false,
                errorText: "",
                value: ""
            });
            setAvgDelivery({
                error: false,
                errorText: "",
                value: 1
            });
            setWorkingFrom({
                error: false,
                errorText: "",
                value: ""
            });
            setWorkingTo({
                error: false,
                errorText: "",
                value: ""
            });
            setPhone({
                error: false,
                errorText: "",
                value: "",
                clearValue: ""
            });
            setWeekends(false);
        }
    }, [open]);

    useEffect(() => {
        if (loading && !providersCreateProgress && providersCreateData != null) {
            if (providersCreateData.id == null && providersCreateData.name != null) {
                setName({
                    error: true,
                    errorText: t('shipments.providerAlreadyExists'),
                    value: name.value
                });
                setLoading(false);
                dispatch(setGlobalLoading(false));
                return;
            }

            setLoading(false);
            dispatch(setGlobalLoading(false));
            dispatch(setSnackbar(t('shipments.providerAdded'), 'success'));
            dispatch(showSnackbar(true));

            if(onClose) {
                onClose(true);
            }
        }
    }, [dispatch, loading, name, onClose, providersCreateData, providersCreateProgress, t]);

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
        if (avgDelivery.value < 1) {
            setName({
                error: true,
                errorText: t('common.incorrectValue'),
                value: name.value
            });
        }
        if (workingFrom.value.length !== 8) {
            setWorkingFrom({
                error: true,
                errorText: t('common.incorrectTime'),
                value: workingFrom.value
            });
        }
        if (workingTo.value.length !== 8) {
            setWorkingTo({
                error: true,
                errorText: t('common.incorrectTime'),
                value: workingTo.value
            });
        }
        if (phone.value.length < 1) {
            setPhone({
                error: true,
                errorText: t('common.fieldEmpty'),
                value: phone.value,
                clearValue: phone.clearValue
            });
        }
        if (phone.value.length !== 13) {
            setPhone({
                error: true,
                errorText: t('users.incorrectMobilePhone'),
                value: phone.value,
                clearValue: phone.clearValue
            });
        }

        checkTimeFields(true);

        if(isEverythingCompleted() && checkTimeFields()) {
            setLoading(true);
            dispatch(setGlobalLoading(true));

            dispatch(addProvider(name.value, workingFrom.value, workingTo.value, avgDelivery.value, phone.value, weekends));

            setTimeout(() => {
                setLoading(false);
            }, config.main.connectionTimeout)
        }
    };

    const checkTimeFields = (showErrors: boolean = false): boolean | void => {
        let workingFromExploded = [];
        let workingToExploded = [];
        try {
            workingFromExploded = workingFrom.value.split(":");
            workingToExploded = workingTo.value.split(":");
        } catch (e) {
            if (showErrors) {
                setWorkingTo({
                    error: true,
                    errorText: t('common.incorrectTime'),
                    value: workingTo.value
                });
                setWorkingFrom({
                    error: true,
                    errorText: t('common.incorrectTime'),
                    value: workingFrom.value
                });
                return;
            } else {
                return false;
            }
        }

        if (workingFromExploded.length === 3) {
            if (parseInt(workingFromExploded[0]) > 23) {
                if (showErrors) {
                    setWorkingFrom({
                        error: true,
                        errorText: t('common.incorrectTime'),
                        value: workingFrom.value
                    });
                } else {
                    return false;
                }
            }
            if (parseInt(workingFromExploded[1]) > 59) {
                if (showErrors) {
                    setWorkingFrom({
                        error: true,
                        errorText: t('common.incorrectTime'),
                        value: workingFrom.value
                    });
                } else {
                    return false;
                }
            }
            if (parseInt(workingFromExploded[2]) > 59) {
                if (showErrors) {
                    setWorkingFrom({
                        error: true,
                        errorText: t('common.incorrectTime'),
                        value: workingFrom.value
                    });
                } else {
                    return false;
                }
            }
        } else {
            if (showErrors) {
                setWorkingFrom({
                    error: true,
                    errorText: t('common.incorrectTime'),
                    value: workingFrom.value
                });
            } else {
                return false;
            }
        }

        if (workingToExploded.length === 3) {
            if (parseInt(workingToExploded[0]) > 23) {
                if (showErrors) {
                    setWorkingTo({
                        error: true,
                        errorText: t('common.incorrectTime'),
                        value: workingTo.value
                    });
                } else {
                    return false;
                }
            }
            if (parseInt(workingToExploded[1]) > 59) {
                if (showErrors) {
                    setWorkingTo({
                        error: true,
                        errorText: t('common.incorrectTime'),
                        value: workingTo.value
                    });
                } else {
                    return false;
                }
            }
            if (parseInt(workingToExploded[2]) > 59) {
                if (showErrors) {
                    setWorkingTo({
                        error: true,
                        errorText: t('common.incorrectTime'),
                        value: workingTo.value
                    });
                } else {
                    return false;
                }
            }
        } else {
            if (showErrors) {
                setWorkingTo({
                    error: true,
                    errorText: t('common.incorrectTime'),
                    value: workingTo.value
                });
            } else {
                return false;
            }
        }

        if(!showErrors) {
            return true;
        }
    };

    const isEverythingCompleted = (): boolean => {
        return  (name.value.length > 0 && !name.error) &&
                (avgDelivery.value != null && avgDelivery.value > 0) &&
                (workingFrom.value.length === 8 && !workingFrom.error) &&
                (workingTo.value.length === 8 && !workingTo.error) &&
                (phone.value.length === 13 && !phone.error);
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
                <DialogTitle>{ t('shipments.addProvider') }</DialogTitle>
                <DialogContent className={classes.content}>
                    <TextField
                        className={classes.textField}
                        label={t('main.name')}
                        variant="outlined"
                        value={name.value}
                        required
                        margin={fullScreen ? "normal" : "dense"}
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
                    <TextField
                        className={classes.textField}
                        label={t('main.workingFrom')}
                        variant="outlined"
                        value={workingFrom.value}
                        required
                        margin={fullScreen ? "normal" : "dense"}
                        error={workingFrom.error}
                        helperText={workingFrom.errorText}
                        onChange={(e) => {
                            setWorkingFrom({
                                error: false,
                                errorText: "",
                                value: e.target.value.replace(/[_\s]/gi, '')
                            });
                        }}
                        InputProps={{
                            inputComponent: TimeMask as any,
                        }}
                    />
                    <TextField
                        className={classes.textField}
                        label={t('main.workingTo')}
                        variant="outlined"
                        value={workingTo.value}
                        required
                        margin={fullScreen ? "normal" : "dense"}
                        error={workingTo.error}
                        helperText={workingTo.errorText}
                        onChange={(e) => {
                            setWorkingTo({
                                error: false,
                                errorText: "",
                                value: e.target.value.replace(/[_\s]/gi, '')
                            });
                        }}
                        InputProps={{
                            inputComponent: TimeMask as any,
                        }}
                    />
                    <TextField
                        className={classes.textField}
                        label={t('main.averageDeliveryTime')}
                        variant="outlined"
                        value={isNaN(avgDelivery.value) ? 0 : avgDelivery.value}
                        required
                        error={avgDelivery.error}
                        helperText={avgDelivery.errorText}
                        type="number"
                        margin={fullScreen ? "normal" : "dense"}
                        inputProps={{ min: "1", step: "1" }}
                        onChange={(e) => {
                            setAvgDelivery({
                                error: false,
                                errorText: "",
                                value: parseInt(e.target.value) != null ? parseInt(e.target.value) : 0
                            });
                        }}
                    />
                    <TextField
                        className={classes.textField}
                        label={t('main.phone')}
                        variant="outlined"
                        margin={fullScreen ? "normal" : "dense"}
                        value={phone.clearValue}
                        required
                        error={phone.error}
                        helperText={phone.errorText}
                        onChange={(e) => {
                            setPhone({
                                error: false,
                                errorText: "",
                                value: e.target.value.replace(/[_()\-\s]/gi, ''),
                                clearValue: e.target.value
                            });
                        }}
                        InputProps={{
                            inputComponent: PhoneMask as any,
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={weekends}
                                onChange={(e) => {
                                    setWeekends(e.target.checked);
                                }}
                            />
                        }
                        label={t("main.workingOnWeekends")}
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

export default ProviderAdd;
