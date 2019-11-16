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


const App: React.FC = () => {
    const [shouldLogin, setShouldLogin] = React.useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const userData = Cookies.get('user_data');
        const token = Cookies.get('token');
        if (userData == null || token == null) {
            Cookies.remove('user_data');
            Cookies.remove('token');
            setShouldLogin(true);
        } else {
            const userDataParsed = JSON.parse(userData);
            if (userDataParsed.auth_token !== token) {
                Cookies.remove('user_data');
                Cookies.remove('token');

                dispatch(setUserData({}));

                setShouldLogin(true);
            } else {
                dispatch(setUserData(userDataParsed));
                setShouldLogin(false);
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
