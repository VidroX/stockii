import React, {useEffect} from "react";
import { useTranslation } from 'react-i18next';
import MUIDataTable from "mui-datatables";
import useToolbarTitle from "../hooks/toolbarTitle";
import useTableLocalization from "../hooks/tableLocalization";
import DataTableToolbar from "../components/dataTableToolbar";
import StockedModal from "../components/modal";
import {Button, makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import TablePlaceholder from "../components/tablePlaceholder";

const Warehouses: React.FC = (props: any) => {
    const { t } = useTranslation();
    const tableLocalization = useTableLocalization();
    const [modalOpen, setModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const classes = useStyles();

    useToolbarTitle(t('main.warehouses'));

    const dispatch = useDispatch();
    const warehousesFetchProgress = useSelector((state: any) => state.main.warehousesFetchProgress);
    const warehousesData = useSelector((state: any) => state.main.warehousesData);

    const columns = [''];

    const data = [['']];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 5000);
    }, []);

    const changePage = (currentPage: number) => {

    };

    const onRowsDelete = (rowsDeleted: object) => {

    };

    const handleAddClick = () => {
        setModalOpen(true);
    };

    const onModalClose = () => {
        setModalOpen(false);
    };

    const onModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setModalOpen(false);
    };

    const renderTable = () => {
        if (loading) {
            return <TablePlaceholder />;
        } else {
            return <MUIDataTable
                title={t('main.yourWarehouses')}
                data={data}
                columns={columns}
                options={{
                    filterType: 'checkbox',
                    rowsPerPageOptions: [],
                    rowsPerPage: 20,
                    serverSide: true,
                    responsive: 'scrollFullHeight',
                    print: false,
                    download: false,
                    search: false,
                    onChangePage: changePage,
                    onRowsDelete: onRowsDelete,
                    textLabels: tableLocalization,
                    customToolbar: () => <DataTableToolbar onAddButtonClick={handleAddClick}/>
                }}
            />;
        }
    };

    return (
        <React.Fragment>
            <StockedModal
                form
                title="Test"
                contentText="Test content"
                onClose={onModalClose}
                onSubmit={onModalSubmit}
                open={modalOpen}
                contentBody={<Button>123123123123123123123123123123123123123123123123213123123123123</Button>}
            />
            { renderTable() }
        </React.Fragment>
    );
};

const useStyles = makeStyles(theme => ({
    spinner: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    placeholder: {
        transition: '.15s'
    }
}));

export default Warehouses;