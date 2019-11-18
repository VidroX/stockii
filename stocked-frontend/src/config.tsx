export default {
    "main": {
        "appName": "Stocked",
        "debugMode": true,
        "connectionTimeout": 10 * 1000
    },
    "api": {
        "url": "http://192.168.1.62:8000/api",
        "same_site": false,
        "token_cookie": "token" // Only if same_site = true
    },
    "auth": {
        "url": "http://192.168.1.62:8000/oauth"
    }
};