// Action types
import config from "../config";

export const USER_LOGIN = "stocked/user/LOGIN";
export const USER_LOGIN_SUCCESS = "stocked/user/LOGIN_SUCCESS";
export const USER_LOGIN_FAIL = "stocked/user/LOGIN_FAIL";
export const USER_LOGOUT = "stocked/user/LOGOUT";
export const USER_LOGOUT_SUCCESS = "stocked/user/LOGOUT_SUCCESS";
export const USER_LOGOUT_FAIL = "stocked/user/LOGOUT_FAIL";
export const USER_LIST = "stocked/user/LIST";
export const USER_LIST_SUCCESS = "stocked/user/LIST_SUCCESS";
export const USER_LIST_FAIL = "stocked/user/LIST_FAIL";
export const USER_ACCESS_ADD = "stocked/user/ACCESS_ADD";
export const USER_ACCESS_ADD_SUCCESS = "stocked/user/ACCESS_ADD_SUCCESS";
export const USER_ACCESS_ADD_FAIL = "stocked/user/ACCESS_ADD_FAIL";
export const SET_USER_DATA = "stocked/user/DATA";

export const WAREHOUSES_GET = "stocked/warehouses/GET";
export const WAREHOUSES_GET_SUCCESS = "stocked/warehouses/GET_SUCCESS";
export const WAREHOUSES_GET_FAIL = "stocked/warehouses/GET_FAIL";
export const WAREHOUSES_REMOVE = "stocked/warehouses/REMOVE";
export const WAREHOUSES_REMOVE_SUCCESS = "stocked/warehouses/REMOVE_SUCCESS";
export const WAREHOUSES_REMOVE_FAIL = "stocked/warehouses/REMOVE_FAIL";
export const WAREHOUSES_ADD = "stocked/warehouses/ADD";
export const WAREHOUSES_ADD_SUCCESS = "stocked/warehouses/ADD_SUCCESS";
export const WAREHOUSES_ADD_FAIL = "stocked/warehouses/ADD_FAIL";

export const SET_TOOLBAR_TITLE = "stocked/toolbar/TITLE_SET";

export const SHOW_SNACKBAR = "stocked/snackbar/SHOW";
export const SET_SNACKBAR = "stocked/snackbar/SET";

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

export function getWarehouses(page: number = 0, ordering: string = '-id', search: string = '') {
    const offset = page * config.api.row_count;

    let params = {
        'offset': offset,
        'ordering': ordering,
        'search': search
    };

    return {
        type: WAREHOUSES_GET,
        payload: {
            client: 'default',
            request: {
                url: '/warehouses/',
                method: 'GET',
                params: params
            }
        }
    }
}

export function removeWarehouse(warehouseId: number) {
    return {
        type: WAREHOUSES_REMOVE,
        payload: {
            client: 'default',
            request: {
                url: '/warehouses/' + warehouseId + '/',
                method: 'DELETE'
            }
        }
    }
}

export function addWarehouse(location: string, workingFrom: string, workingTo: string, phone: string, weekends: boolean) {
    let formData = new FormData();
    formData.append('location', location);
    formData.append('working_from', workingFrom);
    formData.append('working_to', workingTo);
    formData.append('phone', phone);
    formData.append('weekends', weekends ? "True" : "False");

    return {
        type: WAREHOUSES_ADD,
        payload: {
            client: 'default',
            request: {
                url: '/warehouses/',
                method: 'POST',
                data: formData
            }
        }
    }
}

export function addAccessToWarehouse(userId: number, warehouseId: number) {
    return {
        type: USER_ACCESS_ADD,
        payload: {
            client: 'default',
            request: {
                url: '/users/' + userId + '/warehouses/' + warehouseId + '/',
                method: 'POST'
            }
        }
    }
}

export function getUsers(page: number = 0, search: string = '') {
    const offset = page * config.api.row_count;

    let params = {
        'offset': offset,
        'search': search
    };

    return {
        type: USER_LIST,
        payload: {
            client: 'default',
            request: {
                url: '/users/',
                method: 'GET',
                params: params
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

export function setSnackbar(body: string, snackbarType: 'default' | 'success' | 'error' = 'default') {
    return {
        type: SET_SNACKBAR,
        payload: {
            snackbar: {
                body,
                type: snackbarType
            }
        }
    }
}

export function showSnackbar(show: boolean = false) {
    return {
        type: SHOW_SNACKBAR,
        payload: {
            showSnackbar: show
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

export function setGlobalLoading(loading: boolean) {
    return {
        type: SET_LOADING,
        payload: {
            isDataLoading: loading
        }
    }
}