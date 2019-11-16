import React, { useEffect } from "react";
import { setToolbarTitle } from "../redux/actions";
import { connect } from "react-redux";
import { useTranslation } from 'react-i18next';

const Main: React.FC = (props: any) => {
    const { t } = useTranslation();

    useEffect(() => {
        props.setToolbarTitle(t('main.homePage'));
    }, [props, props.toolbarTitle, t]);

    return (
        <React.Fragment>
            <div>
                123
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = (state: any) => {
    return {
        toolbarTitle: state.main.toolbarTitle
    };
};

const mapDispatchToProps = {
    setToolbarTitle
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);