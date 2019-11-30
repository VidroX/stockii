import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    makeStyles, TextField,
    Theme,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {LimitsViewerInterface, ProductLimit} from "../../intefaces";
import {setGlobalLoading, setProductLimits, setSnackbar, showSnackbar} from "../../redux/actions";
import config from "../../config";

interface Field {
    error: boolean,
    errorText: string,
    value: number
}

const LimitsViewer: React.FC<LimitsViewerInterface> = (props: LimitsViewerInterface) => {
    const {
        onOpen,
        onClose,
        open
    } = props;

    const { t } = useTranslation();

    const theme = useTheme();
    const classes = useStyles();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


    const [loading, setLoading] = React.useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
    const [mode, setMode] = React.useState<"default" | "add" | "edit">("default");
    const [pressed, setPressed] = React.useState<boolean>(false);
    const [localProductLimits, setLocalProductLimits] = React.useState<ProductLimit | null>(props.productData.limits);
    const [minLimitField, setMinLimitField] = React.useState<Field>({
        error: false,
        errorText: "",
        value: 0
    });
    const [maxLimitField, setMaxLimitField] = React.useState<Field>({
        error: false,
        errorText: "",
        value: 1
    });

    const dispatch = useDispatch();
    const productSetLimitsProgress = useSelector((state: any) => state.main.productSetLimitsProgress);
    const productSetLimitsData = useSelector((state: any) => state.main.productSetLimitsData);

    useEffect(() => {
        if (open) {
            setPressed(false);
            setLocalProductLimits(props.productData.limits);
            if (localProductLimits == null) {
                setMinLimitField({
                    error: false,
                    errorText: "",
                    value: 0
                });
                setMaxLimitField({
                    error: false,
                    errorText: "",
                    value: 1
                });
                setMode("add");
            } else {
                setMinLimitField({
                    error: false,
                    errorText: "",
                    value: localProductLimits.min_amount
                });
                setMaxLimitField({
                    error: false,
                    errorText: "",
                    value: localProductLimits.max_amount
                });
                setMode("edit");
            }
        }
    }, [open, localProductLimits, props.productData.limits]);

    useEffect(() => {
        if(loading || deleteLoading) {
            dispatch(setGlobalLoading(true));
        } else {
            dispatch(setGlobalLoading(false));
        }
    }, [deleteLoading, dispatch, loading]);

    useEffect(() => {
        if (deleteLoading && !productSetLimitsProgress && productSetLimitsData != null) {
            setDeleteLoading(false);
            dispatch(setSnackbar(t('products.limitsRemoved'), 'success'));
            dispatch(showSnackbar(true));

            if(onClose) {
                onClose(true);
            }
        }
        if (loading && !productSetLimitsProgress && productSetLimitsData != null) {
            if (productSetLimitsData.status === 26) {
                setMinLimitField({
                    error: true,
                    errorText: t('products.incorrectRange'),
                    value: minLimitField.value
                });
                setMaxLimitField({
                    error: true,
                    errorText: t('products.incorrectRange'),
                    value: maxLimitField.value
                });
                setLoading(false);
                return;
            } else if (productSetLimitsData.status === 25 || productSetLimitsData.status === 23) {
                setMaxLimitField({
                    error: true,
                    errorText: t('products.quantityLess'),
                    value: maxLimitField.value
                });
                setLoading(false);
                return;
            } else if (productSetLimitsData.status === 24 || productSetLimitsData.status === 22) {
                setMinLimitField({
                    error: true,
                    errorText: t('products.quantityMore'),
                    value: minLimitField.value
                });

                setLoading(false);
                return;
            } else {
                dispatch(setSnackbar(t('products.limitsSet'), 'success'));
                dispatch(showSnackbar(true));
            }

            setLoading(false);
            if(onClose) {
                onClose(true);
            }
        }
    }, [deleteLoading, dispatch, loading, maxLimitField.value, minLimitField.value, onClose, productSetLimitsData, productSetLimitsProgress, t]);


    const clearFields = (clearValues: boolean = false) => {
        setMinLimitField({
            error: false,
            errorText: "",
            value: clearValues ? 0 : minLimitField.value
        });
        setMaxLimitField({
            error: false,
            errorText: "",
            value: clearValues ? 1 : maxLimitField.value
        });
    };

    const onSubmit = () => {
        if (pressed) {
            clearFields();

            if (minLimitField.value < 0) {
                setMinLimitField({
                    error: true,
                    errorText: t('products.incorrectQuantity'),
                    value: minLimitField.value
                });
            }

            if (maxLimitField.value < 1) {
                setMaxLimitField({
                    error: true,
                    errorText: t('products.incorrectQuantity'),
                    value: maxLimitField.value
                });
            }

            if (maxLimitField.value === minLimitField.value) {
                setMinLimitField({
                    error: true,
                    errorText: t('products.incorrectQuantity'),
                    value: minLimitField.value
                });
                setMaxLimitField({
                    error: true,
                    errorText: t('products.incorrectQuantity'),
                    value: maxLimitField.value
                });
            }

            if (isEverythingCompleted()) {
                setLoading(true);

                dispatch(setProductLimits(props.productData.id, minLimitField.value, maxLimitField.value));

                setTimeout(() => {
                    setLoading(false);
                }, config.main.connectionTimeout)
            }
        }
    };

    const isEverythingCompleted = (withPressed: boolean = true): boolean => {
        if (withPressed) {
            return  (!isNaN(minLimitField.value) && minLimitField.value >= 0 && !minLimitField.error) &&
                    (!isNaN(maxLimitField.value) && maxLimitField.value >= 1 && !maxLimitField.error) &&
                    maxLimitField.value !== minLimitField.value;
        } else {
            return  (!isNaN(minLimitField.value) && minLimitField.value >= 0 && !minLimitField.error) &&
                    (!isNaN(maxLimitField.value) && maxLimitField.value >= 1 && !maxLimitField.error);
        }
    };

    const deleteLimits = () => {
        setDeleteLoading(true);

        dispatch(setProductLimits(props.productData.id));

        setTimeout(() => {
            setDeleteLoading(false);
        }, config.main.connectionTimeout)
    };

    const renderBody = () => {
        if (pressed) {
            return (
                <React.Fragment>
                    <TextField
                        className={classes.textField}
                        label={t('products.minAmount')}
                        variant="outlined"
                        value={minLimitField.value}
                        required
                        error={minLimitField.error}
                        helperText={minLimitField.errorText}
                        type="number"
                        inputProps={{ min: "0", step: "1" }}
                        onChange={(e) => {
                            setMinLimitField({
                                error: false,
                                errorText: "",
                                value: e.target.value != null ? !isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : 0 : 0
                            });
                        }}
                    />
                    <TextField
                        className={classes.textField}
                        label={t('products.maxAmount')}
                        variant="outlined"
                        value={maxLimitField.value}
                        required
                        error={maxLimitField.error}
                        helperText={maxLimitField.errorText}
                        type="number"
                        inputProps={{ min: "1", step: "1" }}
                        onChange={(e) => {
                            setMaxLimitField({
                                error: false,
                                errorText: "",
                                value: e.target.value != null ? !isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : 0 : 0
                            });
                        }}
                    />
                </React.Fragment>
            );
        }
        if(localProductLimits == null) {
            return <DialogContentText>{t('products.noLimitsForProduct')}</DialogContentText>;
        } else {
            return (
                <React.Fragment>
                    <p className={classes.textField}>{t('products.minAmount')}: {localProductLimits.min_amount}</p>
                    <p className={classes.textField}>{t('products.maxAmount')}: {localProductLimits.max_amount}</p>
                </React.Fragment>
            );
        }
    };

    const renderSecondaryButton = () => {
        if (mode === 'edit' && !pressed) {
            return  <Button onClick={deleteLimits} color="primary">
                        { t('main.delete') }
                    </Button>
        }
    };
    
    const renderPrimaryButton = () => {
        if (mode === 'add') {
            return  <Button type={pressed ? "submit" : "button"}
                            onClick={pressed ? () => onSubmit() : () => setPressed(true)}
                            disabled={!isEverythingCompleted(pressed)} color="primary"
                            autoFocus={false}
                    >
                        {pressed ? t('main.save') : t('main.add')}
                    </Button>;
        } else {
            return  <Button type={pressed ? "submit" : "button"}
                            onClick={pressed ? () => onSubmit() : () => setPressed(true)}
                            disabled={!isEverythingCompleted(pressed)} color="primary"
                            autoFocus={false}
                    >
                        {pressed ? t('main.save') : t('main.edit')}
                    </Button>;
        }
    };

    const cleanMenu = () => {
        setPressed(false);
        clearFields();
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
            <DialogTitle>{ t('products.productLimits') }</DialogTitle>
            <DialogContent className={classes.content}>
                { renderBody() }
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={pressed ? cleanMenu : () => onClose != null ? onClose(false) : {}} color="primary">
                    { t('main.cancel') }
                </Button>
                { renderSecondaryButton() }
                { renderPrimaryButton() }
            </DialogActions>
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

export default LimitsViewer;