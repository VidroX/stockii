import {Route, Switch} from "react-router";
import Warehouses from "./warehouses";
import NoMatch from "./noMatch";
import React from "react";
import Products from "./products";

const Routes: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Warehouses />
            </Route>
            <Route exact path="/products/">
                <Products />
            </Route>
            <Route path="*">
                <NoMatch />
            </Route>
        </Switch>
    );
};

export default Routes;