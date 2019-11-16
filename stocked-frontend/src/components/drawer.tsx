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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {isIOS, isMobile, withOrientationChange} from "react-device-detect";
import {SwipeableDrawer} from "@material-ui/core";
import Routes from "../routes/routes";
import {connect} from "react-redux";
import {setToolbarTitle} from "../redux/actions";

const drawerWidth = 240;

const getMobilePadding = (props: any) => props.isLandscape ? 24 : 16;

const StockedDrawer: React.FC = (props: any) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowWidth(window.innerWidth)
        });
    }, [windowWidth]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const renderItems = () => {
        return (
            <React.Fragment>
                <div className={classes.toolbar}>
                    {renderCloseIcon()}
                </div>
                <Divider/>
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
                </List>
                <Divider/>
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
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

    const renderCloseIcon = () => {
        if(isMobile || windowWidth < 600) {
            return (
                <IconButton onClick={toggleDrawer}>
                    <CloseIcon />
                </IconButton>
            );
        } else {
            return null;
        }
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                className={clsx(classes.appBar)}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        edge="start"
                        className={clsx(classes.menuButton)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {props.toolbarTitle}
                    </Typography>
                </Toolbar>
            </AppBar>
            {renderDrawer()}
            <main className={classes.content} style={{
                padding: isMobile ? getMobilePadding(props) : (windowWidth < 600 ? 16 : 24)
            }}>
                <div className={classes.toolbar} />
                <Routes />
            </main>
        </div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        toolbarTitle: state.main.toolbarTitle
    };
};

const mapDispatchToProps = {
    setToolbarTitle
};

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
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
        padding: theme.spacing(1) - 4,
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        flexWrap: 'wrap',
        wordBreak: 'break-all'
    },
}));

export default withOrientationChange(connect(mapStateToProps, mapDispatchToProps)(StockedDrawer));