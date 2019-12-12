import {createMuiTheme} from "@material-ui/core";
import {blueGrey} from "@material-ui/core/colors";

const defaultTheme = createMuiTheme();

export const theme = createMuiTheme({
    palette: {
        primary: {
            light: blueGrey[300],
            main: blueGrey[500],
            dark: blueGrey[700]
        },
        secondary: {
            light: "#9198ca",
            main: "#626a99",
            dark: "#35406b"
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
                padding: '16px 24px',
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
            stackedCommon: {
                "&&": {
                    [defaultTheme.breakpoints.down('sm')]: {
                        width: 'auto',
                        border: 0,
                        marginLeft: 24,
                        marginRight: 24,
                        marginBottom: 8,
                        height: '1rem'
                    }
                },
                "&&:first-child": {
                    [defaultTheme.breakpoints.down('sm')]: {
                        marginTop: 16
                    }
                },
                "&&:nth-child(2n+1)": {
                    [defaultTheme.breakpoints.down('sm')]: {
                        fontWeight: 'bold'
                    }
                },
                "&&:nth-child(2n)": {
                    [defaultTheme.breakpoints.down('sm')]: {
                        width: 'auto',
                        border: 0,
                        marginLeft: 24,
                        marginRight: 24,
                        marginBottom: 16,
                        height: '1rem'
                    }
                },
                "&&:last-child": {
                    [defaultTheme.breakpoints.down('sm')]: {
                        paddingBottom: 36
                    }
                }
            }
        }
    },
});
