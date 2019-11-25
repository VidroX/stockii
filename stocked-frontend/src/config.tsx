export default {
    "main": {
        "appName": "Stocked",
        "debugMode": true,
        "connectionTimeout": 10 * 1000,
        "snackbarAutoHideDuration": 6 * 1000
    },
    "api": {
        "url": "http://192.168.1.62:8000/api",
        "same_site": false,
        "token_cookie": "token", // Only if same_site = true
        "row_count": 10
    },
    "auth": {
        "url": "http://192.168.1.62:8000/oauth"
    }
};