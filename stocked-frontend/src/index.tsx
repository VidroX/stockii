import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './assets/sass/main.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CssBaseline, Grid } from "@material-ui/core";
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import store from "./redux/store";
import { theme } from "./theme";

import './i18n';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

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

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <Suspense fallback={<Loader/>}>
                    <CssBaseline />
                    <App />
                </Suspense>
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
