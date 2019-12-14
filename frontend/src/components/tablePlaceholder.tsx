import React from "react";
import {makeStyles, Paper} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

const TablePlaceholder: React.FC = () => {
    const classes = useStyles();

    return (
        <Paper elevation={4} className={classes.placeholder}>
            <div className={classes.placeholderTop}>
                <div className={classes.placeholderTopLeft}>
                    <div className={classes.textPlaceholder} />
                </div>
                <div className={classes.placeholderTopRight}>
                    <div className={classes.buttonPlaceholder} />
                    <div className={classes.buttonPlaceholder} />
                    <div className={classes.buttonPlaceholder} />
                </div>
            </div>
            <div className={classes.placeholderCenter}>
                <div className={classes.rowPlaceholder} />
                <div className={classes.rowPlaceholder} />
                <div className={classes.rowPlaceholder} />
            </div>
            <div className={classes.placeholderBottom}>
                <div className={classes.paginationPlaceholder} />
                <div className={classes.navButtonPlaceholder} />
                <div className={classes.navButtonPlaceholder} />
            </div>
        </Paper>
    );
};

const useStyles = makeStyles(theme => ({
    "@keyframes pulse": {
        "0%": {
            opacity: '.6',
        },
        "50%": {
            opacity: '1',
        },
        "100%": {
            opacity: '.6',
        }
    },
    placeholder: {
        animation: '$pulse 1.5s infinite',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: grey[200],
        borderRadius: 4,
        paddingRight: 24,
        paddingLeft: 24,
        paddingTop: 12,
        paddingBottom: 12,
        marginBottom: 24
    },
    placeholderTop: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'stretch'
    },
    placeholderCenter: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    placeholderBottom: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    placeholderTopLeft: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    placeholderTopRight: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    textPlaceholder: {
        display: 'flex',
        width: '100%',
        height: 20,
        backgroundColor: grey[400],
        borderRadius: 4
    },
    rowPlaceholder: {
        display: 'flex',
        width: '100%',
        height: 20,
        marginTop: 8,
        backgroundColor: grey[400],
        borderRadius: 4
    },
    buttonPlaceholder: {
        display: 'flex',
        height: 48,
        width: 48,
        backgroundColor: grey[400],
        borderRadius: '100%',
        margin: 'auto 8px'
    },
    paginationPlaceholder: {
        display: 'flex',
        width: 100,
        height: 16,
        alignSelf: 'center',
        backgroundColor: grey[400],
        borderRadius: 4,
        marginTop: 8,
        marginRight: 8
    },
    navButtonPlaceholder: {
        display: 'flex',
        height: 32,
        width: 32,
        backgroundColor: grey[400],
        borderRadius: '100%',
        margin: '8px 8px 0 0'
    }
}));

export default TablePlaceholder;