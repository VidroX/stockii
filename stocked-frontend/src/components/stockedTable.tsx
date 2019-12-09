import React, { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import useTableLocalization from "../hooks/tableLocalization";
import DataTableToolbar from "../components/dataTableToolbar";
import { makeStyles, Theme } from "@material-ui/core";
import config from "../config";
import { green, red } from "@material-ui/core/colors";
import {SortColumn, StockedTableInterface} from "../intefaces";

const StockedTable: React.FC<StockedTableInterface> = (props: StockedTableInterface) => {
    const {
        title,
        columns,
        data,
        page,
        sortColumns,
        addEnabled,
        onAddClick,
        count,
        onRequest,
        refreshTable,
        onTableRefreshed,
        sortItem,
        exportEnabled,
        exportFileName,
        exportHeader
    } = props;

    const tableLocalization = useTableLocalization();

    const [localColumns, setLocalColumns] = React.useState<any[]>(columns);
    const [currentSortColumn, setCurrentSortColumn] = React.useState<number>(-1);
    //const [page, setPage] = React.useState<number>(0);
    const [searchVal, setSearchVal] = React.useState<string>("");

    const classes = useStyles();

    useEffect(() => {
        setLocalColumns(columns);
    }, [columns]);

    useEffect(() => {
        if (refreshTable) {
            if(searchVal != null && searchVal.length > 0) {
                if (onRequest != null) {
                    onRequest("refreshTable", page, sortItem != null ? sortItem : "-id", searchVal);
                }
            } else {
                if (onRequest != null) {
                    onRequest("refreshTable", page, sortItem != null ? sortItem : "-id", null);
                }
            }

            if(onTableRefreshed != null) {
                onTableRefreshed()
            }
        }
    }, [sortItem, onRequest, onTableRefreshed, page, refreshTable, searchVal, sortColumns]);


    let timeout: any;

    const onTableChange = (action: string, tableState: any) => {
        if (action === 'changePage') {
            refreshPage('changePage', tableState.page, searchVal);
        } else if (action === 'sort') {
            const columnId = tableState.activeColumn;

            if (currentSortColumn !== -1 && currentSortColumn !== columnId) {
                let tempColumns = [...localColumns];
                let item = {...tempColumns[currentSortColumn]};
                item.options.sortDirection = 'none';
                tempColumns[currentSortColumn] = item;
                setLocalColumns(tempColumns);
            }

            setCurrentSortColumn(columnId);

            let tempColumns = [...localColumns];
            let item = {...tempColumns[columnId]};
            if (item.options.sortDirection === 'none') {
                item.options.sortDirection = 'desc';
            } else if (item.options.sortDirection === 'desc') {
                item.options.sortDirection = 'asc';
            } else {
                item.options.sortDirection = 'none';
            }
            tempColumns[columnId] = item;
            setLocalColumns(tempColumns);

            let prefix = "-";
            if(item.options.sortDirection === 'asc') {
                prefix = '';
            }

            let columns = "";
            if (sortColumns[columnId].length > 1) {
                sortColumns[columnId].forEach((obj: SortColumn, index: number) => {
                    let customPrefix: string = "";
                    if (item.options.sortDirection === 'asc' && obj.prefixAsc != null) {
                        customPrefix = obj.prefixAsc || '';
                    } else if (item.options.sortDirection === 'desc' && obj.prefixDesc != null) {
                        customPrefix = obj.prefixDesc || '';
                    } else {
                        customPrefix = prefix;
                    }
                    if (index + 1 === sortColumns[columnId].length) {
                        columns += customPrefix + obj.item;
                    } else {
                        columns += customPrefix + obj.item + ",";
                    }
                });
            } else if(sortColumns[columnId].length === 1) {
                let customPrefix: string = "";
                if (sortColumns[columnId][0].prefixAsc != null && item.options.sortDirection === 'asc') {
                    customPrefix = sortColumns[columnId][0].prefixAsc || '';
                } else if (sortColumns[columnId][0].prefixDesc != null && item.options.sortDirection === 'desc') {
                    customPrefix = sortColumns[columnId][0].prefixDesc || '';
                } else {
                    customPrefix = prefix;
                }
                columns = customPrefix + sortColumns[columnId][0].item;
            }

            const serverColumn = columnId !== -1 || null ? item.options.sortDirection !== 'none' ? columns : "-id" : "-id";

            if (onRequest != null) {
                onRequest("sort", tableState.page, serverColumn, searchVal != null && searchVal.length > 0 ? searchVal : null);
            }
        } else if (action === 'search') {
            setSearchVal(tableState.searchText);
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function () {
                refreshPage('search', tableState.page, tableState.searchText);
            }, 1000);
        }
    };

    const refreshPage = (type: "sort" | "changePage" | "search", localPage: number, searchValLocal: string = '') => {
        if(searchValLocal != null && searchValLocal.length > 0) {
            if (onRequest != null) {
                onRequest(type, localPage, sortItem != null ? sortItem : "-id", searchValLocal);
            }
        } else {
            if (onRequest != null) {
                onRequest(type, localPage, sortItem != null ? sortItem : "-id", null);
            }
        }
    };


    let options: any = {
        rowsPerPageOptions: [],
        rowsPerPage: config.api.row_count,
        responsive: 'stacked',
        print: false,
        search: true,
        filter: false,
        rowHover: false,
        selectableRows: 'none',
        serverSide: true,
        download: exportEnabled != null && exportEnabled,
        downloadOptions: {filename: exportEnabled != null && exportFileName != null ? exportFileName : 'tableDownload.csv', separator: ','},
        page: page,
        count: count,
        textLabels: tableLocalization,
        searchText: searchVal,
        onSearchClose: () => setSearchVal(""),
        onTableChange: onTableChange,
        customToolbar: () => <DataTableToolbar isVisible={addEnabled} onAddButtonClick={onAddClick}/>
    };

    if (exportEnabled != null && exportHeader != null && exportHeader.length > 0) {
        options = {
            rowsPerPageOptions: [],
            rowsPerPage: config.api.row_count,
            responsive: 'stacked',
            print: false,
            search: true,
            filter: false,
            rowHover: false,
            selectableRows: 'none',
            serverSide: true,
            download: exportEnabled,
            downloadOptions: {filename: exportFileName != null ? exportFileName : 'tableDownload.csv', separator: ','},
            onDownload: (buildHead: any, buildBody: any, columns: any, data: any) => {
                return buildHead(exportHeader) + buildBody(data.map((obj: any) => {
                    obj.data = obj.data.splice(0, exportHeader.length);
                    return obj;
                }));
            },
            page: page,
            count: count,
            textLabels: tableLocalization,
            searchText: searchVal,
            onSearchClose: () => setSearchVal(""),
            onTableChange: onTableChange,
            customToolbar: () => <DataTableToolbar isVisible={addEnabled} onAddButtonClick={onAddClick}/>
        }
    }

    return (
        <div className={classes.paddingBottom}>
            <MUIDataTable
                title={title}
                data={data}
                columns={localColumns}
                options={options}
            />
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    paddingBottom: {
        paddingBottom: 24
    },
    actions: {
        display: 'block',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: -15,
        [theme.breakpoints.down('sm')]: {
            marginLeft: -14
        }
    },
    available: {
        color: green[300]
    },
    notAvailable: {
        color: red[300]
    }
}));

export default StockedTable;
