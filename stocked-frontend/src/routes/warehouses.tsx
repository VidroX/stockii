import React, {useEffect} from "react";
import { useTranslation } from 'react-i18next';
import MUIDataTable, {MUIDataTableState} from "mui-datatables";
import useToolbarTitle from "../hooks/toolbarTitle";
import useTableLocalization from "../hooks/tableLocalization";
import DataTableToolbar from "../components/dataTableToolbar";
import StockedModal from "../components/modal";
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import TablePlaceholder from "../components/tablePlaceholder";
import {getWarehouses} from "../redux/actions";
import config from "../config";

interface Warehouse {
    location: string,
    workingFrom: string,
    workingTo: string,
    weekends: boolean,
    phone: string
}

const Warehouses: React.FC = (props: any) => {
    const { t } = useTranslation();
    const tableLocalization = useTableLocalization();
    const [modalOpen, setModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState<any[]>([]);
    const [count, setCount] = React.useState<number>(0);
    const [page, setPage] = React.useState<number>(0);

    useToolbarTitle(t('main.warehouses'));

    const dispatch = useDispatch();
    const warehousesData = useSelector((state: any) => state.main.warehousesData);

    const columns = [
        t('main.location'),
        t('main.workingFrom'),
        t('main.workingTo'),
        t('main.weekends'),
        t('main.phone')
    ];

    useEffect(() => {
        setLoading(true);
        dispatch(getWarehouses(1)); 
    }, [dispatch]);
    
    useEffect(() => {
        if (warehousesData != null && !warehousesData.isFetching) {
            /*console.log(warehousesData);
            const tempData = warehousesData.data.results.map(
                (warehouse: Warehouse) => [
                    warehouse.location,
                    warehouse.workingFrom,
                    warehouse.workingTo,
                    warehouse.weekends,
                    warehouse.phone
                ]
            );*/
            setData(warehousesData.data.results);
            setCount(warehousesData.data.count);
            setLoading(false);
        }
        if(warehousesData != null && warehousesData.error) {
            setLoading(false);
        }
        setTimeout(() => {
            setLoading(false);
        }, config.main.connectionTimeout)
    }, [loading, warehousesData]);

    const onTableChange = (action: string, tableState: MUIDataTableState) => {
        switch (action) {
            case 'changePage':
                setLoading(true);
                setPage(tableState.page);
                dispatch(getWarehouses(tableState.page));
                break;
            default:
                break;
        }
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
            return (
                <MUIDataTable
                    title={t('main.yourWarehouses')}
                    data={data}
                    columns={columns}
                    options={{
                        filterType: 'checkbox',
                        rowsPerPageOptions: [],
                        rowsPerPage: 1,
                        serverSide: true,
                        responsive: 'scrollFullHeight',
                        print: false,
                        download: false,
                        search: false,
                        page: page,
                        count: count,
                        textLabels: tableLocalization,
                        onTableChange: onTableChange,
                        customToolbar: () => <DataTableToolbar onAddButtonClick={handleAddClick}/>
                    }}
                />
            );
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

export default Warehouses;