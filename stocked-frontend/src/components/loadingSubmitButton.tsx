import React, { useEffect } from "react";
import {Button, CircularProgress, makeStyles} from "@material-ui/core";
import PropTypes from "prop-types";
import {isMobile} from "react-device-detect";

const STATUS_UNDEFINED = 0;
const STATUS_LOADING = 1;

const LoadingSubmitButton: React.FC<{title: string, loadingStatus: boolean, onButtonClick: any, className: string}> = (props) => {
    const { title, onButtonClick, loadingStatus, className} = props;

    const classes = useStyles();
    const [status, setStatus] = React.useState(STATUS_UNDEFINED);

    useEffect(() => {
        setStatus(loadingStatus ? STATUS_LOADING : STATUS_UNDEFINED);
    }, [props, loadingStatus]);

    const handleButtonClick = () => {
        if (status !== STATUS_LOADING) {
            onButtonClick();
        }
    };

    return (
        <div className={classes.wrapper}>
            <Button
                type="submit"
                color="primary"
                variant="contained"
                size={isMobile ? "medium" : "small"}
                disabled={status === STATUS_LOADING}
                onClick={handleButtonClick}
                className={className}
            >
                {title}
            </Button>
            {status === STATUS_LOADING && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonProgress: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -8,
        marginLeft: -12,
    }
}));

LoadingSubmitButton.propTypes = {
    title: PropTypes.string.isRequired,
    loadingStatus: PropTypes.bool.isRequired,
    className: PropTypes.string.isRequired,
    onButtonClick: PropTypes.func.isRequired
};

LoadingSubmitButton.defaultProps = {
    title: "",
    loadingStatus: false,
    className: "",
    onButtonClick: () => {}
};

export default LoadingSubmitButton;