import {useTranslation} from "react-i18next";

const useTableLocalization = () => {
    const { t } = useTranslation("table");

    return {
        body: {
            noMatch: t('body.noMatch'),
            toolTip: t('body.toolTip')
        },
        pagination: {
            next: t('pagination.next'),
            previous: t('pagination.previous'),
            rowsPerPage: t('pagination.rowsPerPage'),
            displayRows: t('pagination.displayRows'),
        },
        toolbar: {
            search: t('toolbar.search'),
            downloadCsv: t('toolbar.downloadCsv'),
            print: t('toolbar.print'),
            viewColumns: t('toolbar.viewColumns'),
            filterTable: t('toolbar.filterTable'),
        },
        filter: {
            all: t('filter.all'),
            title: t('filter.title'),
            reset: t('filter.reset'),
        },
        viewColumns: {
            title: t('viewColumns.title'),
            titleAria: t('viewColumns.titleAria'),
        },
        selectedRows: {
            text: t('selectedRows.text'),
            delete: t('selectedRows.delete'),
            deleteAria: t('selectedRows.deleteAria'),
        }
    };
};

export default useTableLocalization;