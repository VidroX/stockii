import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {
    Button,
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
import {createShipment, setGlobalLoading, setSnackbar, showSnackbar} from "../../redux/actions";
import {GenericProductInterface, ProviderDeliveryTimes, ProviderOptionType} from "../../intefaces";
import ProviderSelector from "../providers/providerSelector";
import moment from "moment";

const placeholderDate = moment().add(2, 'days').format('YYYY-MM-DD');

const ProductOrder: React.FC<GenericProductInterface> = (props: GenericProductInterface) => {
    const {
        onOpen,
        onClose,
        open,
        productData
    } = props;

    const { t } = useTranslation();

    const theme = useTheme();
    const classes = useStyles();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [provider, setProvider] = React.useState({
        error: false,
        errorText: "",
        value: "",
        id: 0
    });
    const [quantity, setQuantity] = React.useState({
        error: false,
        errorText: "",
        value: 1 | NaN
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const [deliveryTimes, setDeliveryTimes] = React.useState<ProviderDeliveryTimes>({
        workingFrom: "",
        workingTo: "",
        averageDeliveryTime: 0,
        weekends: false
    });
    const [estimatedDate, setEstimatedDate] = React.useState<string>(placeholderDate);

    const dispatch = useDispatch();
    const shipmentsCreateProgress = useSelector((state: any) => state.main.shipmentsCreateProgress);
    const shipmentsCreateData = useSelector((state: any) => state.main.shipmentsCreateData);

    const clearFields = (clearValues: boolean = false) => {
        setProvider({
            error: false,
            errorText: "",
            value: clearValues ? "" : provider.value,
            id: clearValues ? 0 : provider.id
        });
        setQuantity({
            error: false,
            errorText: "",
            value: clearValues ? 1 : quantity.value
        });
    };

    useEffect(() => {
        if (!open) {
            setProvider({
                error: false,
                errorText: "",
                value: "",
                id: 0
            });
            setQuantity({
                error: false,
                errorText: "",
                value: 1
            });
            return;
        }
    }, [open]);

    useEffect(() => {
        if(loading) {
            dispatch(setGlobalLoading(true));
        } else {
            dispatch(setGlobalLoading(false));
        }
    }, [dispatch, loading]);

    useEffect(() => {
        if (open) {
            const workingFromArr = deliveryTimes.workingFrom.split(":");
            const workingToArr = deliveryTimes.workingTo.split(":");
            if (workingFromArr != null && workingToArr != null &&
                workingToArr.length === 3 && (
                    parseInt(workingToArr[0]) >= 0 && parseInt(workingToArr[0]) < 24 && parseInt(workingToArr[1]) >= 0 && parseInt(workingToArr[1]) < 60 &&
                    parseInt(workingToArr[2]) >= 0 && parseInt(workingToArr[2]) < 60
                )
            ) {
                const workingTo = moment().set({
                    h: parseInt(workingToArr[0]),
                    m: parseInt(workingToArr[1]),
                    s: parseInt(workingToArr[2])
                });
                const today = moment();

                const day = today.isoWeekday();
                const isWeekend = (day === 6) || (day === 7);
                const isSaturday = day === 6;

                let additionalDays = 0;
                let estimated = placeholderDate;
                if (today.isAfter(workingTo)) {
                    additionalDays = 1;
                }

                if (deliveryTimes.weekends) {
                    estimated = moment().add(deliveryTimes.averageDeliveryTime + additionalDays, 'days').format('YYYY-MM-DD');
                } else {
                    if (isWeekend) {
                        if (today.isAfter(workingTo)) {
                            if (isSaturday) {
                                additionalDays += 1;
                            }
                        } else {
                            additionalDays += (isSaturday ? 2 : 1);
                        }
                    }
                    const approximateDate = moment().add(deliveryTimes.averageDeliveryTime  + additionalDays, 'days');
                    if (approximateDate.isoWeekday() === 6) {
                        approximateDate.add(2, 'days');
                    } else if (approximateDate.isoWeekday() === 7) {
                        approximateDate.add(1, 'days');
                    }
                    estimated = approximateDate.format('YYYY-MM-DD');
                }

                setEstimatedDate(estimated);
            }
        }
    }, [deliveryTimes, open]);

    useEffect(() => {
        if (loading && !shipmentsCreateProgress && shipmentsCreateData.id == null && shipmentsCreateData.provider != null) {
            setProvider({
                error: true,
                errorText: t('shipments.incorrectProvider'),
                value: provider.value,
                id: provider.id
            });
            setLoading(false);
            return;
        }
        if (loading && !shipmentsCreateProgress && shipmentsCreateData.status === 28) {
            setQuantity({
                error: true,
                errorText: t('shipments.totalQuantityMoreThanAllowed'),
                value: quantity.value
            });
            setLoading(false);
            return;
        }
        if (loading && !shipmentsCreateProgress && shipmentsCreateData != null) {
            if (shipmentsCreateData.id == null || shipmentsCreateData.id <= 0) {
                dispatch(setSnackbar(t('shipments.unableToCreateOrder'), 'error'));
                dispatch(showSnackbar(true));
            } else {
                dispatch(setSnackbar(t('shipments.orderCreated'), 'success'));
                dispatch(showSnackbar(true));
            }

            setLoading(false);
            if(onClose) {
                onClose(true);
            }
        }
    }, [dispatch, loading, onClose, provider, shipmentsCreateData, shipmentsCreateProgress, t, quantity]);

    const onSubmit = (e: any) => {
        e.preventDefault();
        clearFields();

        if (provider.value.length < 1 || provider.id < 1) {
            setProvider({
                error: true,
                errorText: t('products.incorrectProvider'),
                value: provider.value,
                id: provider.id
            });
        }
        if (quantity.value < 1) {
            setQuantity({
                error: true,
                errorText: t('products.incorrectQuantity'),
                value: quantity.value
            });
        }

        if(isEverythingCompleted()) {
            setLoading(true);
            dispatch(setGlobalLoading(true));

            dispatch(createShipment(provider.id, productData.id, estimatedDate, quantity.value));

            setTimeout(() => {
                setLoading(false);
            }, config.main.connectionTimeout)
        }
    };

    const renderDeliveryTimes = () => {
        return <p className={classes.textField}>{t('shipments.estimatedDelivery')}: <span className={classes.deliveryDate}>{estimatedDate.length > 0 ? estimatedDate : "..."}</span></p>;
    };

    const isEverythingCompleted = (): boolean => {
        return  (provider != null && quantity != null) &&
                (provider.value.length > 0 && provider.id > 0 && !provider.error) &&
                (!isNaN(quantity.value) && quantity.value > 0 && !quantity.error);
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
                <DialogTitle>{ t('products.orderProduct') }</DialogTitle>
                <DialogContent className={classes.content}>
                    <ProviderSelector
                        error={provider.error}
                        helperText={provider.errorText}
                        onClear={() => {
                            setProvider({
                                error: false,
                                errorText: "",
                                value: "",
                                id: 0
                            });
                            setEstimatedDate(placeholderDate);
                        }}
                        onSelect={(obj: ProviderOptionType) => {
                            setProvider({
                                error: false,
                                errorText: "",
                                value: obj.values.label,
                                id: obj.values.id
                            });
                            setDeliveryTimes({
                                workingFrom: obj.delivery.workingFrom,
                                workingTo: obj.delivery.workingTo,
                                averageDeliveryTime: obj.delivery.averageDeliveryTime,
                                weekends: obj.delivery.weekends
                            });
                        }}
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
                        inputProps={{ min: "1", step: "1" }}
                        onChange={(e) => {
                            setQuantity({
                                error: false,
                                errorText: "",
                                value: parseInt(e.target.value) != null ? parseInt(e.target.value) : 0
                            });
                        }}
                    />
                    { renderDeliveryTimes() }
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => onClose != null ? onClose(false) : {}} color="primary">
                        { t('main.cancel') }
                    </Button>
                    <Button disabled={!isEverythingCompleted()} type="submit" color="primary">
                        { t('main.order') }
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
    },
    deliveryDate: {
        marginLeft: 8,
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        textDecoration: 'underline'
    }
}));

export default ProductOrder;
