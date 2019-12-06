import React from "react";
import useToolbarTitle from "../hooks/toolbarTitle";
import {useTranslation} from "react-i18next";

const NoMatch: React.FC = () => {
    const { t } = useTranslation();
    useToolbarTitle(t('main.notFound'));

    return (
        <React.Fragment>
            <div>
                404 - Not Found!
            </div>
        </React.Fragment>
    );
};

export default NoMatch;
