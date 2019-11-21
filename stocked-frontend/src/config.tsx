export default {
    "main": {
        "appName": "Stocked",
        "debugMode": true,
        "connectionTimeout": 10 * 1000
    },
    "api": {
        "url": "http://127.0.0.1:8000/api",
        "same_site": false,
        "token_cookie": "token", // Only if same_site = true
        "row_count": 20
    },
    "auth": {
        "url": "http://127.0.0.1:8000/oauth"
    }
};