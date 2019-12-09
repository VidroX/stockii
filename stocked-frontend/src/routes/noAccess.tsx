import React from "react";
import {useTranslation} from "react-i18next";
import useToolbarTitle from "../hooks/toolbarTitle";

const NoAccess: React.FC = () => {
    const { t } = useTranslation();
    useToolbarTitle(t('main.noAccess'));

    return (
        <React.Fragment>
            <div>
                405 - Not Allowed!
            </div>
        </React.Fragment>
    );
};

export default NoAccess;
