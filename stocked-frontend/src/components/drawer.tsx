import React, {useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import {isIOS, isMobile, withOrientationChange} from "react-device-detect";
import {Button, LinearProgress, Menu, MenuItem, SwipeableDrawer} from "@material-ui/core";
import Routes from "../routes/routes";
import {connect, useSelector} from "react-redux";
import {userLogout} from "../redux/actions";
import {AccountCircle} from "@material-ui/icons";
import {useTranslation} from "react-i18next";
import Cookies from "js-cookie";
import config from "../config";
import LanguageSelector from "./languageSelector";
import {useLocation} from "react-router";
import useToolbarTitle from "../hooks/toolbarTitle";
import StockedSnackBar from "./StockedSnackBar";


const drawerWidth = 240;

const getMobilePadding = (props: any) => props.isLandscape ? 24 : 16;

const StockedDrawer: React.FC = (props: any) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpened = Boolean(anchorEl);
    const { t } = useTranslation();
    const location = useLocation();
    const toolbarTitle = useToolbarTitle();
    const mobilePadding = isMobile ? getMobilePadding(props) : (windowWidth < 600 ? 16 : 24);

    const snackbarData = useSelector((state: any) => state.main.snackBarData);
    const showSnackbar = useSelector((state: any) => state.main.showSnackbar);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowWidth(window.innerWidth)
        });
    }, [windowWidth]);
    
    useEffect(() => {
        if (props.logoutInitiated && !props.logoutProgress) {
            Cookies.remove('token');
            Cookies.remove('user_data');
            window.location.reload();
        }
    }, [props.logoutInitiated, props.logoutProgress]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const renderItems = () => {
        return (
            <React.Fragment>
                <div className={classes.toolbar}>
                    {renderTopbar()}
                </div>
                <Divider/>
                <List classes={{
                    padding: classes.listPadding
                }}>
                    <ListItem className={classes.listRoot} button key="warehouses" selected={location.pathname === '/'}>
                        <ListItemIcon><HomeWorkIcon /></ListItemIcon>
                        <ListItemText primary={t('main.warehouses')}/>
                    </ListItem>
                </List>
            </React.Fragment>
        );
    };

    const renderDrawer = () => {
        if(isMobile) {
            return (
                <SwipeableDrawer
                    variant="temporary"
                    open={open}
                    onClose={toggleDrawer}
                    onOpen={toggleDrawer}
                    disableBackdropTransition={!isIOS}
                    disableDiscovery={isIOS}
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerCloseMobile]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerCloseMobile]: !open,
                        }),
                    }}
                >
                    {renderItems()}
                </SwipeableDrawer>
            );
        } else {
            return (
                <Drawer
                    variant={windowWidth < 600 ? "temporary" : "permanent"}
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open && windowWidth >= 600,
                        [classes.drawerCloseMobile]: !open && windowWidth < 600,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open && windowWidth >= 600,
                            [classes.drawerCloseMobile]: !open && windowWidth < 600,
                        }),
                    }}
                    open={open}
                >
                    {renderItems()}
                </Drawer>
            );
        }
    };

    const renderTopbar = () => {
        if(isMobile || windowWidth < 600) {
            return (
                <div className={classes.topBar}>
                    <IconButton className={classes.marginRight} onClick={toggleDrawer}>
                        <CloseIcon />
                    </IconButton>
                    <Typography className={classes.topBarTitle} variant="h6" component="h6">{config.main.appName}</Typography>
                </div>
            );
        } else {
            return null;
        }
    };

    const handleMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    /*const handleMyProfile = () => {
        setAnchorEl(null);
    };*/

    const handleLogout = () => {
        setAnchorEl(null);
        props.userLogout().catch((err: any) => {
            if(config.main.debugMode) {
                console.log(err);
                console.log(err.message);
            }
            Cookies.remove('token');
            Cookies.remove('user_data');
            window.location.reload();
        });
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const renderProgress = () => {
        if (props.isDataLoading) {
            return <LinearProgress className={classes.loading} />;
        }
        return null;
    };

    const renderSnackbar = () => {
        if (snackbarData != null && snackbarData.type != null && snackbarData.body != null && showSnackbar != null) {
            return <StockedSnackBar type={snackbarData.type} body={snackbarData.body} isShown={showSnackbar} />;
        } else {
            return null;
        }
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            { renderProgress() }
            { renderSnackbar() }
            <AppBar
                className={classes.appBar}
            >
                <Toolbar className={classes.toolbarMain}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        edge="start"
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.toolbarTitle}>
                        {toolbarTitle}
                    </Typography>
                    <LanguageSelector />
                    <div>
                        <Button
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <span className={classes.userButton}>{props.userData.first_name}</span>
                            <AccountCircle />
                        </Button>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={isMenuOpened}
                            onClose={handleClose}
                        >
                            {/*<MenuItem onClick={handleMyProfile}>{t('main.myProfile')}</MenuItem>*/}
                            <MenuItem onClick={handleLogout}>{t('main.logOut')}</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            {renderDrawer()}
            <div className={classes.mainContent}>
                <div className={classes.toolbar} />
                <main className={classes.content} style={{
                    paddingLeft: mobilePadding,
                    paddingRight: mobilePadding
                }}>
                    <Routes />
                </main>
            </div>
        </div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        userData: state.main.userData,
        logoutProgress: state.main.logoutProgress,
        logoutInitiated: state.main.logoutInitiated,
        isDataLoading: state.main.isDataLoading
    };
};

const mapDispatchToProps = {
    userLogout
};

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    mainContent: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    loading: {
        display: 'block',
        zIndex: 1600,
        position: 'fixed',
        width: '100%',
        top: 0
    },
    toolbarMain: {
        display: 'flex',
        flexDirection: 'row'
    },
    toolbarTitle: {
        flexGrow: 1
    },
    userButton: {
        marginRight: 8
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    menuButton: {
        marginRight: 37,
        [theme.breakpoints.down('xs')]: {
            marginRight: 12
        }
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: drawerWidth,
        [theme.breakpoints.up(0)]: {
            width: theme.spacing(9) + 1,
        },
    },
    drawerCloseMobile: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: drawerWidth
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: theme.spacing(1) + 4,
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        flexWrap: 'wrap',
        wordBreak: 'break-all',
        marginTop: 24
    },
    listPadding: {
        padding: 8,
        marginTop: 12
    },
    listRoot: {
        borderRadius: '4px',
        marginTop: 4
    },
    marginRight: {
        marginRight: 8
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    topBarTitle: {
        marginLeft: 12
    }
}));

export default withOrientationChange(connect(mapStateToProps, mapDispatchToProps)(StockedDrawer));