import {createMuiTheme} from "@material-ui/core";
import {blueGrey, cyan} from "@material-ui/core/colors";

const defaultTheme = createMuiTheme();

export const theme = createMuiTheme({
    palette: {
        primary: {
            light: blueGrey[300],
            main: blueGrey[500],
            dark: blueGrey[700]
        },
        secondary: {
            light: cyan[300],
            main: cyan[500],
            dark: cyan[700]
        },
        background: {
            default: "#fcfcfc"
        }
    },
    overrides: {
        MuiTableRow: {
            root: {
                [defaultTheme.breakpoints.down('sm')]: {
                    display: 'flex',
                    flexDirection: 'column'
                }
            }
        },
        MuiTableCell: {
            root: {
                [defaultTheme.breakpoints.down('sm')]: {
                    padding: 0
                }
            }
        },
        // @ts-ignore
        MUIDataTableBodyRow: {
            responsiveStacked: {
                "&&": {
                    [defaultTheme.breakpoints.down('sm')]: {
                        border: 0,
                        borderTop: 'solid 1px rgba(0, 0, 0, 0.15)'
                    }
                },
                "&&:first-child": {
                    [defaultTheme.breakpoints.down('sm')]: {
                        borderTop: 'solid 1px rgba(0, 0, 0, 0.15)'
                    }
                },
                "&&:last-child": {
                    [defaultTheme.breakpoints.down('sm')]: {
                        borderBottom: 'solid 1px rgba(0, 0, 0, 0.15)'
                    }
                },
            }
        },
        MUIDataTableBodyCell: {
            cellStacked: {
                [defaultTheme.breakpoints.down('sm')]: {
                    width: 'auto',
                    fontWeight: 'bold',
                    border: 0,
                    marginLeft: 24,
                    marginRight: 24,
                    marginTop: 6
                }
            },
            responsiveStacked: {
                "&&": {
                    [defaultTheme.breakpoints.down('sm')]: {
                        width: 'auto',
                        border: 0,
                        marginLeft: 24,
                        marginRight: 24,
                        marginBottom: 6
                    }
                },
                "&&:last-child": {
                    [defaultTheme.breakpoints.down('sm')]: {
                        marginBottom: 28
                    }
                }
            }
        }
    },
});