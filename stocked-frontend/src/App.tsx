import React, { useEffect } from 'react';
import './assets/sass/App.scss';
import {
    BrowserRouter as Router
} from "react-router-dom";
import StockedDrawer from "./components/drawer";
import { useDispatch } from "react-redux";
import LoginPage from "./routes/login";
import Cookies from "js-cookie";
import { setUserData } from "./redux/actions";
import config from "./config";


const App: React.FC = () => {
    const [shouldLogin, setShouldLogin] = React.useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const userData = Cookies.get('user_data');
        if(config.api.same_site) {
            const token = Cookies.get('token');
            if (userData == null || token == null) {
                Cookies.remove('user_data');
                Cookies.remove('token');
                setShouldLogin(true);
            } else {
                try {
                    const decodedUserData = Base64.decode(userData);
                    const userDataParsed = JSON.parse(decodedUserData);
                    if (userDataParsed.auth_token !== token) {
                        Cookies.remove('user_data');
                        Cookies.remove('token');

                        dispatch(setUserData({}));

                        setShouldLogin(true);
                    } else {
                        dispatch(setUserData(userDataParsed));
                        setShouldLogin(false);
                    }
                } catch (e) {
                    Cookies.remove('user_data');
                    setShouldLogin(true);
                }
            }
        } else {
            if (userData != null) {
                try {
                    const decodedUserData = Base64.decode(userData);
                    const userDataParsed = JSON.parse(decodedUserData);
                    dispatch(setUserData(userDataParsed));
                    setShouldLogin(false);
                } catch (e) {
                    Cookies.remove('user_data');
                    setShouldLogin(true);
                }
            } else {
                dispatch(setUserData({}));
                setShouldLogin(true);
            }
        }
    }, [dispatch, shouldLogin]);

    if (shouldLogin) {
        return (
            <LoginPage />
        );
    } else {
        return (
            <Router>
                <StockedDrawer />
            </Router>
        );
    }
};

export default App;
