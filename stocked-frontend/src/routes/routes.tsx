import {Route, Switch} from "react-router";
import Warehouses from "./warehouses";
import NoMatch from "./noMatch";
import React from "react";

const Routes: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Warehouses />
            </Route>
            <Route path="*">
                <NoMatch />
            </Route>
        </Switch>
    );
};

export default Routes;