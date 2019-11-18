import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './assets/sass/main.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createMuiTheme, CssBaseline, Grid } from "@material-ui/core";
import { blueGrey, cyan } from "@material-ui/core/colors";
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import store from "./redux/store";

import './i18n';

const Loader = () => (
    <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
    >

        <Grid item xs={3}>
            <CircularProgress />
        </Grid>

    </Grid>
);

const theme = createMuiTheme({
    palette: {
        primary: {
            light: blueGrey[300],
            main: blueGrey[500],
            dark: blueGrey[700]
        },
        secondary: {
            light: cyan[300],
            main: cyan[500],
            dark: cyan[700]
        },
        background: {
            default: "#fcfcfc"
        }
    },
});


ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <Suspense fallback={<Loader/>}>
                <CssBaseline />
                <App />
            </Suspense>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
