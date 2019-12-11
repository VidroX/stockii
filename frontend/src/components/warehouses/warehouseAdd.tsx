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
import {addWarehouse, setGlobalLoading, setSnackbar, showSnackbar} from "../../redux/actions";
import PhoneMask from "../phoneMask";

interface WarehouseAdd {
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

const WarehouseAdd: React.FC<WarehouseAdd> = (props: WarehouseAdd) => {
    const {
        onOpen,
        onClose,
        open
    } = props;

    const { t } = useTranslation();

    const theme = useTheme();
    const classes = useStyles();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [location, setLocation] = React.useState({
        error: false,
        errorText: "",
        value: ""
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
    const warehouseAddProgress = useSelector((state: any) => state.main.warehouseAddProgress);
    const addWarehousesData = useSelector((state: any) => state.main.addWarehousesData);

    const clearFields = (clearValues: boolean = false) => {
        setLocation({
           error: false,
           errorText: "",
           value: clearValues ? "" : location.value
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
            setLocation({
                error: false,
                errorText: "",
                value: ""
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
        if (loading && !warehouseAddProgress && addWarehousesData != null) {
            if (addWarehousesData.id == null && addWarehousesData.location != null) {
                setLocation({
                    error: true,
                    errorText: t('main.warehouseAlreadyExists'),
                    value: location.value
                });
                setLoading(false);
                dispatch(setGlobalLoading(false));
                return;
            }

            setLoading(false);
            dispatch(setGlobalLoading(false));
            dispatch(setSnackbar(t('main.warehouseAdded'), 'success'));
            dispatch(showSnackbar(true));

            if(onClose) {
                onClose(true);
            }
        }
    }, [addWarehousesData, dispatch, loading, location.value, onClose, t, warehouseAddProgress]);

    const onSubmit = (e: any) => {
        e.preventDefault();
        clearFields();

        if (location.value.length < 1) {
            setLocation({
                error: true,
                errorText: t('common.fieldEmpty'),
                value: location.value
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

            dispatch(addWarehouse(location.value, workingFrom.value, workingTo.value, phone.value, weekends));

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
        return (location.value.length > 0 && !location.error) &&
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
                <DialogTitle>{ t('main.addWarehouse') }</DialogTitle>
                <DialogContent className={classes.content}>
                    <TextField
                        className={classes.textField}
                        label={t('main.location')}
                        variant="outlined"
                        value={location.value}
                        required
                        margin={fullScreen ? "normal" : "dense"}
                        error={location.error}
                        helperText={location.errorText}
                        onChange={(e) => {
                            setLocation({
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

export default WarehouseAdd;
