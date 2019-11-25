import React from "react";
import {
    IconButton,
    makeStyles,
    Snackbar,
    SnackbarContent,
    Theme,
} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {showSnackbar} from "../redux/actions";
import config from "../config";
import {green} from "@material-ui/core/colors";
import clsx from "clsx";
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';

interface StockedSnackBar {
    type: 'default' | 'success' | 'error',
    body: string
    isShown: boolean
}

const variantIcon = {
    success: CheckCircleIcon,
    error: ErrorIcon,
    default: InfoIcon,
};

const StockedSnackBar: React.FC<StockedSnackBar> = (props: StockedSnackBar) => {
    const {
        type,
        body,
        isShown
    } = props;

    const Icon = variantIcon[type];

    const classes = useStyles();
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(showSnackbar(false));
    };

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={isShown}
            autoHideDuration={config.main.snackbarAutoHideDuration}
            onClose={handleClose}
        >
            <SnackbarContent
                className={classes[type]}
                message={
                    <span className={classes.body}>
                        <Icon className={clsx(classes.icon, classes.iconVariant)} />
                        {body}
                    </span>
                }
                action={[
                    <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon className={classes.icon} />
                    </IconButton>,
                ]}
            />
        </Snackbar>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    default: {
        backgroundColor: theme.palette.primary.main,
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    body: {
        display: 'flex',
        alignItems: 'center',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    }
}));

export default StockedSnackBar;