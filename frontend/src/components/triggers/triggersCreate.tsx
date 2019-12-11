import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    MenuItem,
    TextField,
    Theme,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import config from "../../config";
import {
    createMoveTrigger,
    createRestockTrigger,
    setGlobalLoading,
    setSnackbar,
    showSnackbar
} from "../../redux/actions";
import {GenericCreateInterface, OptionType, WarehouseFull} from "../../intefaces";
import moment from "moment";
import ProductSelector from "../products/productSelector";
import WarehouseSelector from "../warehouses/warehouseSelector";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {KeyboardDatePicker} from "@material-ui/pickers";

interface LocalQuantityInterface {
    error: boolean,
    errorText: string,
    value: number | null
}

interface LocalWarehouseInterface {
    error: boolean,
    errorText: string,
    value: string,
    id: number
}

interface LocalDateInterface {
    error: boolean,
    errorText: string,
    value: string
}

const TriggerCreate: React.FC<GenericCreateInterface> = (props: GenericCreateInterface) => {
    const {
        onOpen,
        onClose,
        open
    } = props;

    const { t, i18n } = useTranslation();

    const theme = useTheme();
    const classes = useStyles();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [todayDate, setTodayDate] = React.useState(moment().format(i18n.language === 'en' ? "DD/MM/YYYY" : "DD.MM.YYYY").toString());

    useEffect(() => {
        setTodayDate(moment().format(i18n.language === 'en' ? "DD/MM/YYYY" : "DD.MM.YYYY").toString());
    }, [i18n.language]);

    const [type, setType] = React.useState<number>(1);
    const [name, setName] = React.useState({
        error: false,
        errorText: "",
        value: ""
    });
    const [product, setProduct] = React.useState({
        error: false,
        errorText: "",
        value: "",
        id: 0
    });
    const [activationDate, setActivationDate] = React.useState<LocalDateInterface>({
        error: false,
        errorText: "",
        value: todayDate
    });
    const [warehouse, setWarehouse] = React.useState<LocalWarehouseInterface | null>(null);
    const [warehouseId, setWarehouseId] = React.useState<number>(0);
    const [quantity, setQuantity] = React.useState<LocalQuantityInterface | null>({
        error: false,
        errorText: "",
        value: 1
    });
    const [loading, setLoading] = React.useState<boolean>(false);

    const dispatch = useDispatch();
    const triggersCreateProgress = useSelector((state: any) => state.main.triggersCreateProgress);
    const triggersCreateData = useSelector((state: any) => state.main.triggersCreateData);

    const clearFields = (clearValues: boolean = false) => {
        setType(clearValues ? type : 1);
        setName({
            error: false,
            errorText: "",
            value: clearValues ? "" : name.value
        });
        setProduct({
            error: false,
            errorText: "",
            value: clearValues ? "" : product.value,
            id: clearValues ? 0 : product.id
        });
        setActivationDate({
            error: false,
            errorText: "",
            value: clearValues ? todayDate : activationDate.value
        });
        if (warehouse != null) {
            setWarehouse({
                error: false,
                errorText: "",
                value: clearValues ? "" : warehouse.value,
                id: clearValues ? 0 : warehouse.id
            });
        }
        if (quantity != null) {
            setQuantity({
                error: false,
                errorText: "",
                value: clearValues ? 1 : quantity.value
            });
        }
    };

    useEffect(() => {
        if (!open) {
            setType(1);
            setWarehouseId(0);
            setName({
                error: false,
                errorText: "",
                value: ""
            });
            setProduct({
                error: false,
                errorText: "",
                value: "",
                id: 0
            });
            setActivationDate({
                error: false,
                errorText: "",
                value: todayDate
            });
            setWarehouse(null);
            setQuantity({
                error: false,
                errorText: "",
                value: 1
            });
            return;
        }
    }, [open, todayDate]);

    useEffect(() => {
        if(loading) {
            dispatch(setGlobalLoading(true));
        } else {
            dispatch(setGlobalLoading(false));
        }
    }, [dispatch, loading]);

    useEffect(() => {
        if (loading && !triggersCreateProgress && triggersCreateData.id == null && triggersCreateData.product != null) {
            setProduct({
                error: true,
                errorText: t('shipments.incorrectProduct'),
                value: product.value,
                id: product.id
            });
            if (quantity != null) {
                setQuantity({
                    error: false,
                    errorText: '',
                    value: 1
                });
                setWarehouse(null);
                setType(1);
            } else if (warehouse != null) {
                setQuantity(null);
                setWarehouse({
                    error: false,
                    errorText: '',
                    value: '',
                    id: 0
                });
                setType(2);
            }
            setLoading(false);
            return;
        }
        if (loading && !triggersCreateProgress && triggersCreateData.id == null && triggersCreateData.name != null) {
            setName({
                error: true,
                errorText: t('triggers.incorrectName'),
                value: name.value
            });
            if (quantity != null) {
                setQuantity({
                    error: false,
                    errorText: '',
                    value: 1
                });
                setWarehouse(null);
                setType(1);
            } else if (warehouse != null) {
                setQuantity(null);
                setWarehouse({
                    error: false,
                    errorText: '',
                    value: '',
                    id: 0
                });
                setType(2);
            }
            setLoading(false);
            return;
        }
        if (loading && !triggersCreateProgress && triggersCreateData.id == null && triggersCreateData.to_warehouse != null && warehouse != null) {
            setWarehouse({
                error: true,
                errorText: t('products.incorrectWarehouse'),
                value: warehouse.value,
                id: warehouse.id
            });
            setQuantity(null);
            setType(2);
            setLoading(false);
            return;
        }
        if (loading && !triggersCreateProgress && triggersCreateData.id == null && triggersCreateData.quantity != null && quantity != null) {
            setQuantity({
                error: true,
                errorText: t('main.incorrectQuantity'),
                value: quantity.value
            });
            setWarehouse(null);
            setType(1);
            setLoading(false);
            return;
        }
        if (loading && !triggersCreateProgress && triggersCreateData != null) {
            if (triggersCreateData.id == null || triggersCreateData.id <= 0) {
                dispatch(setSnackbar(t('triggers.unableToCreateTrigger'), 'error'));
                dispatch(showSnackbar(true));
            } else {
                dispatch(setSnackbar(t('triggers.triggerCreated'), 'success'));
                dispatch(showSnackbar(true));
            }

            setLoading(false);
            if(onClose) {
                onClose(true);
            }
        }
    }, [dispatch, loading, onClose, product, name, warehouse, type, quantity, triggersCreateData, triggersCreateProgress, t]);

    const onSubmit = (e: any) => {
        e.preventDefault();
        clearFields();

        if (name.value.trim().length < 1) {
            setName({
                error: true,
                errorText: t('triggers.incorrectName'),
                value: name.value
            });
        }
        if (product.value.length < 1 || product.id < 1) {
            setProduct({
                error: true,
                errorText: t('products.incorrectProduct'),
                value: product.value,
                id: product.id
            });
        }
        if (activationDate.value != null && moment(activationDate.value, i18n.language === 'en' ? "DD/MM/YYYY" : "DD.MM.YYYY").isBefore(moment().startOf('day'))) {
            setActivationDate({
                error: true,
                errorText: t('common.incorrectDate'),
                value: activationDate.value
            });
        }
        if (type === 2 && warehouse != null && warehouseId < 1) {
            setProduct({
                error: true,
                errorText: t('products.incorrectProduct'),
                value: product.value,
                id: product.id
            });
        }
        if (type === 2 && warehouse != null && warehouse.value.length < 1) {
            setWarehouse({
                error: true,
                errorText: t('products.incorrectWarehouse'),
                value: warehouse.value,
                id: warehouse.id
            });
        }
        if (type === 2 && warehouse != null && warehouse.id < 1) {
            setWarehouse({
                error: true,
                errorText: t('products.incorrectWarehouse'),
                value: warehouse.value,
                id: warehouse.id
            });
        }
        if (type === 1 && quantity != null && quantity.value != null && quantity.value < 1) {
            setQuantity({
                error: true,
                errorText: t('products.incorrectQuantity'),
                value: quantity.value
            });
        }

        if(isEverythingCompleted(type) && activationDate.value != null) {
            setLoading(true);
            dispatch(setGlobalLoading(true));

            if (type === 1 && quantity != null && quantity.value != null) {
                dispatch(createRestockTrigger(name.value, product.id, quantity.value, moment(activationDate.value, i18n.language === 'en' ? "DD/MM/YYYY" : "DD.MM.YYYY")));
            } else if(type === 2 && warehouse != null && warehouseId > 0) {
                dispatch(createMoveTrigger(name.value, product.id, warehouseId, warehouse.id, moment(activationDate.value, i18n.language === 'en' ? "DD/MM/YYYY" : "DD.MM.YYYY")));
            }

            setTimeout(() => {
                setLoading(false);
            }, config.main.connectionTimeout)
        }
    };

    const isEverythingCompleted = (type: number = 1): boolean => {
        if (type === 1) {
            return  (name != null && product != null && warehouseId > 0 && quantity != null) &&
                    (name.value.trim().length > 0 && !name.error) &&
                    (product.value.length > 0 && product.id > 0 && !product.error) &&
                    (activationDate.value != null && moment(activationDate.value, i18n.language === 'en' ? "DD/MM/YYYY" : "DD.MM.YYYY").isAfter(moment().subtract(1, 'days').endOf('day')) && !activationDate.error) &&
                    (quantity.value != null && quantity.value > 0 && !quantity.error);
        } else if (type === 2) {
            return  (name != null && product != null && warehouseId > 0 && warehouse != null) &&
                    (name.value.trim().length > 0 && !name.error) &&
                    (product.value.length > 0 && product.id > 0 && !product.error) &&
                    (activationDate.value != null && moment(activationDate.value, i18n.language === 'en' ? "DD/MM/YYYY" : "DD.MM.YYYY").isAfter(moment().subtract(1, 'days').endOf('day')) && !activationDate.error) &&
                    (warehouse.value.length > 0 && warehouse.id > 0 && !warehouse.error);
        } else {
            return false;
        }
    };

    const renderTypeContent = (type: number) => {
        if (type === 1 && quantity != null) {
            return (
                <React.Fragment>
                    <TextField
                        className={classes.textField}
                        label={t('products.quantity')}
                        variant="outlined"
                        value={quantity.value || 1}
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
                </React.Fragment>
            );
        } else if (type === 2 && warehouse != null) {
            return (
                <React.Fragment>
                    <WarehouseSelector
                        error={warehouse.error}
                        helperText={warehouse.errorText}
                        onSelect={(value: OptionType) => {
                            setWarehouse({
                                error: false,
                                errorText: "",
                                value: value.label,
                                id: value.id
                            });
                        }}
                    />
                </React.Fragment>
            );
        }
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
                <DialogTitle>{ t('triggers.createTrigger') }</DialogTitle>
                <DialogContent className={classes.content}>
                    <TextField
                        className={classes.textField}
                        label={t('triggers.selectType')}
                        variant="outlined"
                        id="type-select-outlined"
                        value={type}
                        select
                        onChange={(e) => {
                            const localType = parseInt(e.target.value) != null ? parseInt(e.target.value) : 1;
                            setType(localType);

                            if (localType === 1) {
                                setWarehouse(null);
                                setQuantity({
                                    error: false,
                                    errorText: "",
                                    value: 1
                                });
                            } else {
                                setQuantity(null);
                                setWarehouse({
                                    error: false,
                                    errorText: "",
                                    value: "",
                                    id: 0
                                });
                            }
                        }}
                    >
                        <MenuItem value={1}>{t('triggers.triggerType1')}</MenuItem>
                        <MenuItem value={2}>{t('triggers.triggerType2')}</MenuItem>
                    </TextField>
                    <TextField
                        className={classes.textField}
                        label={t('main.name')}
                        variant="outlined"
                        value={name.value || ''}
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
                    <ProductSelector
                        error={product.error}
                        helperText={product.errorText}
                        onClear={() => {
                            setWarehouseId(0);
                            setProduct({
                                error: false,
                                errorText: "",
                                value: "",
                                id: 0
                            });
                        }}
                        onSelect={(obj: OptionType, localWarehouse: WarehouseFull) => {
                            setWarehouseId(localWarehouse.id);
                            setProduct({
                                error: false,
                                errorText: "",
                                value: obj.label,
                                id: obj.id
                            });
                        }}
                    />
                    { renderTypeContent(type) }
                    <KeyboardDatePicker
                        className={classes.textField}
                        id="date-picker-dialog-triggers-create"
                        label={t('triggers.activationDate')}
                        format={i18n.language === 'en' ? "DD/MM/YYYY" : "DD.MM.YYYY"}
                        variant="dialog"
                        inputVariant="outlined"
                        required
                        cancelLabel={t('main.cancel')}
                        okLabel={t('main.select')}
                        minDate={new Date()}
                        value={moment(activationDate.value || todayDate, i18n.language === 'en' ? "DD/MM/YYYY" : "DD.MM.YYYY").toDate()}
                        error={activationDate.error}
                        helperText={activationDate.errorText || ''}
                        onChange={(date: MaterialUiPickersDate | null) => {
                            setActivationDate({
                                error: false,
                                errorText: "",
                                value: date != null ? date.format(i18n.language === 'en' ? "DD/MM/YYYY" : "DD.MM.YYYY").toString() : todayDate
                            });
                        }}
                        KeyboardButtonProps={{
                            'aria-label': t('users.selectDate'),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => onClose != null ? onClose(false) : {}} color="primary">
                        { t('main.cancel') }
                    </Button>
                    <Button disabled={!isEverythingCompleted(type)} type="submit" color="primary">
                        { t('main.create') }
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

export default TriggerCreate;
