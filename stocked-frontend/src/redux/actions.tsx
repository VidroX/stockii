// Action types
import config from "../config";

export const USER_LOGIN = "stocked/user/LOGIN";
export const USER_LOGIN_SUCCESS = "stocked/user/LOGIN_SUCCESS";
export const USER_LOGIN_FAIL = "stocked/user/LOGIN_FAIL";

export const USER_LOGOUT = "stocked/user/LOGOUT";
export const USER_LOGOUT_SUCCESS = "stocked/user/LOGOUT_SUCCESS";
export const USER_LOGOUT_FAIL = "stocked/user/LOGOUT_FAIL";

export const WAREHOUSES_GET = "stocked/warehouses/GET";
export const WAREHOUSES_GET_SUCCESS = "stocked/warehouses/GET_SUCCESS";
export const WAREHOUSES_GET_FAIL = "stocked/warehouses/GET_FAIL";

export const SET_USER_DATA = "stocked/user/DATA";

export const SET_TOOLBAR_TITLE = "stocked/toolbar/TITLE_SET";

export const SET_LOADING = "stocked/loading/SET";

// Actions
export function userLogin(email: string, password: string) {
    let formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    if(!config.api.same_site) {
        formData.append('return_token', 'True');
    }

    return {
        type: USER_LOGIN,
        payload: {
            client: 'auth',
            request: {
                url: '/auth/login/',
                method: 'POST',
                data: formData
            }
        }
    }
}

export function userLogout() {
    return {
        type: USER_LOGOUT,
        payload: {
            client: 'auth',
            request: {
                url: '/auth/logout/',
                method: 'POST'
            }
        }
    }
}

export function getWarehouses() {
    return {
        type: WAREHOUSES_GET,
        payload: {
            client: 'default',
            request: {
                url: '/api/warehouses/',
                method: 'POST'
            }
        }
    }
}

export function setToolbarTitle(title: string) {
    return {
        type: SET_TOOLBAR_TITLE,
        payload: {
            toolbarTitle: title
        }
    }
}

export function setUserData(userData: object) {
    return {
        type: SET_USER_DATA,
        payload: {
            userData: userData
        }
    }
}

export function setLoading(loading: boolean) {
    return {
        type: SET_LOADING,
        payload: {
            isDataLoading: loading
        }
    }
}