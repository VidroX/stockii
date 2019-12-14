export default {
    "main": {
        "appName": "Stockii",
        "debugMode": false,
        "connectionTimeout": 10 * 1000,
        "snackbarAutoHideDuration": 6 * 1000
    },
    "api": {
        "url": "https://server.vidrox.me/api",
        "same_site": false,
        "token_cookie": "token", // Only if same_site = true
        "row_count": 10
    },
    "auth": {
        "url": "https://server.vidrox.me/oauth"
    }
};
