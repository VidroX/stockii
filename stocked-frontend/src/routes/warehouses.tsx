import React, { useEffect } from "react";
import { setToolbarTitle } from "../redux/actions";
import { connect } from "react-redux";
import { useTranslation } from 'react-i18next';
import config from "../config";
import MUIDataTable from "mui-datatables";

const Warehouses: React.FC = (props: any) => {
    const { t } = useTranslation();

    useEffect(() => {
        props.setToolbarTitle(t('main.warehouses'));
        document.title = t('main.warehouses') + " - " + config.main.appName;
    }, [props, props.toolbarTitle, t]);

    const columns = [''];

    const data = [['']];

    const changePage = (currentPage: number) => {

    };

    const onRowsDelete = (rowsDeleted: object) => {

    };

    return (
        <React.Fragment>
            <div>
                <MUIDataTable
                    title={t('main.yourWarehouses')}
                    data={data}
                    columns={columns}
                    options={{
                        filterType: 'checkbox',
                        rowsPerPageOptions: [],
                        rowsPerPage: 20,
                        responsive: 'scrollFullHeight',
                        print: false,
                        download: false,
                        onChangePage: changePage,
                        onRowsDelete: onRowsDelete
                    }}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(Warehouses);