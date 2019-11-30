import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import config from "../../config";
import {setGlobalLoading, setSnackbar, showSnackbar, updateProduct} from "../../redux/actions";
import {OptionType, ProductMoveInterface} from "../../intefaces";
import WarehouseSelector from "../warehouses/warehouseSelector";

const ProductMove: React.FC<ProductMoveInterface> = (props: ProductMoveInterface) => {
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

    const [warehouse, setWarehouse] = React.useState({
        error: false,
        errorText: "",
        value: "",
        id: 0
    });
    const [loading, setLoading] = React.useState<boolean>(false);

    const dispatch = useDispatch();
    const productsUpdateProgress = useSelector((state: any) => state.main.productsUpdateProgress);
    const productsUpdateData = useSelector((state: any) => state.main.productsUpdateData);

    const clearFields = (clearValues: boolean = false) => {
        setWarehouse({
            error: false,
            errorText: "",
            value: clearValues ? "" : warehouse.value,
            id: clearValues ? 0 : warehouse.id
        });
    };
    
    useEffect(() => {
        if (!open) {
            setWarehouse({
                error: false,
                errorText: "",
                value: "",
                id: 0
            });
            return;
        }
    }, [open]);

    useEffect(() => {
        if (loading && !productsUpdateProgress && productsUpdateData != null && productsUpdateData.detail != null) {
            setWarehouse({
                error: true,
                errorText: t('products.incorrectWarehouse'),
                value: warehouse.value,
                id: warehouse.id
            });
            setLoading(false);
            return;
        }
        if (loading && !productsUpdateProgress && productsUpdateData != null) {
            if (productsUpdateData.status !== 12) {
                dispatch(setSnackbar(t('products.unableToMoveProduct'), 'error'));
                dispatch(showSnackbar(true));
            } else {
                dispatch(setSnackbar(t('products.productMoved'), 'success'));
                dispatch(showSnackbar(true));
            }

            setLoading(false);
            if(onClose) {
                onClose(true);
            }
        }
    }, [dispatch, loading, onClose, productsUpdateData, productsUpdateProgress, t, warehouse]);

    useEffect(() => {
        if(loading) {
            dispatch(setGlobalLoading(true));
        } else {
            dispatch(setGlobalLoading(false));
        }
    }, [dispatch, loading]);

    const onSubmit = (e: any) => {
        e.preventDefault();
        clearFields();

        if (warehouse.value.length < 1 || warehouse.id < 1) {
            setWarehouse({
                error: true,
                errorText: t('products.incorrectWarehouse'),
                value: warehouse.value,
                id: warehouse.id
            });
        }

        if(isEverythingCompleted()) {
            setLoading(true);

            dispatch(updateProduct(productData.id, null, warehouse.id, null));

            setTimeout(() => {
                setLoading(false);
            }, config.main.connectionTimeout)
        }
    };

    const isEverythingCompleted = (): boolean => {
        return warehouse.value.length > 0 && warehouse.id > 0 && !warehouse.error;
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
                <DialogTitle>{ t('products.moveProduct') }</DialogTitle>
                <DialogContent className={classes.content}>
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
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => onClose != null ? onClose(false) : {}} color="primary">
                        { t('main.cancel') }
                    </Button>
                    <Button disabled={!isEverythingCompleted()} type="submit" color="primary">
                        { t('main.move') }
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

export default ProductMove;