import React from 'react';
import './assets/sass/App.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Main from "./routes/main";
import NoMatch from "./routes/noMatch";
import NavBar from "./components/navBar";


const App: React.FC = () => {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route exact path="/">
                    <Main />
                </Route>
                <Route path="*">
                    <NoMatch />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
