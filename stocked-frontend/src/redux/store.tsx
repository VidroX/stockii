import {applyMiddleware, combineReducers, createStore} from 'redux';
import mainReducer from './reducers';
import config_main from "../config";
import axios from "axios";
import {multiClientMiddleware} from "redux-axios-middleware";
import {composeWithDevTools} from "redux-devtools-extension/logOnlyInProduction";
import Cookies from 'js-cookie';

const clients = {
    "default": {
        client: axios.create({
            baseURL: config_main.api.url,
            responseType: 'json',
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    "auth": {
        client: axios.create({
            baseURL: config_main.api.url,
            responseType: 'json',
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
};

const options = {
    interceptors: {
        request: [
            (action: any, config: any) => {
                const token = Cookies.get(config_main.api.token_cookie);

                if(token != null) {
                    config.headers.Authorization = 'Bearer ' + token;
                }

                return config;
            }
        ]
    }
};

const axiosMiddleware = multiClientMiddleware(clients, options);

const appReducer = combineReducers({
    main: mainReducer
});

const store = createStore(
    appReducer,
    composeWithDevTools(
        applyMiddleware(
            axiosMiddleware
        )
    )
);

export default store;