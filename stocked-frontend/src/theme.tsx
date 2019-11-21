import {createMuiTheme} from "@material-ui/core";
import {blueGrey, cyan} from "@material-ui/core/colors";

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
    }
});