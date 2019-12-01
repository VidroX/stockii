import {Route, RouteProps, Switch} from "react-router";
import Warehouses from "./warehouses";
import NoMatch from "./noMatch";
import React from "react";
import Products from "./products";
import Providers from "./providers";
import { useSelector } from "react-redux";
import NoAccess from "./noAccess";

const AdminRoute = ({ children, ...rest }: RouteProps) => {
    const user = useSelector((state: any) => state.main.userData);

    return (
        <Route
            {...rest}
            render={({ location }) => {
                if (user != null && user.auth_token != null && user.is_superuser) {
                    return children;
                } else {
                    return <NoAccess />;
                }
            }}
        />
    );
};

const Routes: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Warehouses />
            </Route>
            <Route exact path="/products/">
                <Products />
            </Route>
            <AdminRoute exact path="/providers/">
                <Providers />
            </AdminRoute>
            <Route path="*">
                <NoMatch />
            </Route>
        </Switch>
    );
};

export default Routes;