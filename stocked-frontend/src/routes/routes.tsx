import {Route, Switch} from "react-router";
import Main from "./main";
import NoMatch from "./noMatch";
import React from "react";

const Routes: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Main />
            </Route>
            <Route path="*">
                <NoMatch />
            </Route>
        </Switch>
    );
};

export default Routes;