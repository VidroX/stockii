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
import {setGlobalLoading, setSnackbar, showSnackbar, updateProduct} from "../../redux/actions";
import {GenericProductInterface} from "../../intefaces";

const ProductQuantityUpdate: React.FC<GenericProductInterface> = (props: GenericProductInterface) => {
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

    const [quantity, setQuantity] = React.useState({
        error: false,
        errorText: "",
        value: 1 | NaN
    });
    const [loading, setLoading] = React.useState<boolean>(false);

    const dispatch = useDispatch();
    const productsUpdateProgress = useSelector((state: any) => state.main.productsUpdateProgress);
    const productsUpdateData = useSelector((state: any) => state.main.productsUpdateData);

    const clearFields = (clearValues: boolean = false) => {
        setQuantity({
            error: false,
            errorText: "",
            value: clearValues ? 1 : quantity.value
        });
    };

    useEffect(() => {
        if (!open) {
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
        if (loading && !productsUpdateProgress && productsUpdateData.status === 29) {
            setQuantity({
                error: true,
                errorText: t('products.negativeQuantity'),
                value: quantity.value
            });
            setLoading(false);
            return;
        }
        if (loading && !productsUpdateProgress && productsUpdateData.status === 22) {
            setQuantity({
                error: true,
                errorText: t('products.quantityLess'),
                value: quantity.value
            });
            setLoading(false);
            return;
        }
        if (loading && !productsUpdateProgress && productsUpdateData.status === 23) {
            setQuantity({
                error: true,
                errorText: t('products.quantityMore'),
                value: quantity.value
            });
            setLoading(false);
            return;
        }
        if (loading && !productsUpdateProgress && productsUpdateData != null) {
            if (productsUpdateData.status !== 12) {
                dispatch(setSnackbar(t('products.unableToUpdateProduct'), 'error'));
                dispatch(showSnackbar(true));
            } else {
                dispatch(setSnackbar(t('products.productUpdated'), 'success'));
                dispatch(showSnackbar(true));
            }

            setLoading(false);
            if(onClose) {
                onClose(true);
            }
        }
    }, [dispatch, loading, onClose, productsUpdateProgress, productsUpdateData, t, quantity]);

    const onSubmit = (e: any) => {
        e.preventDefault();
        clearFields();

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

            dispatch(updateProduct(productData.id, null, null, quantity.value));

            setTimeout(() => {
                setLoading(false);
            }, config.main.connectionTimeout)
        }
    };

    const isEverythingCompleted = (): boolean => {
        return  (quantity != null) &&
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
                <DialogTitle>{ t('products.updateProductQuantity') }</DialogTitle>
                <DialogContent className={classes.content}>
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
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => onClose != null ? onClose(false) : {}} color="primary">
                        { t('main.cancel') }
                    </Button>
                    <Button disabled={!isEverythingCompleted()} type="submit" color="primary">
                        { t('main.update') }
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

export default ProductQuantityUpdate;
