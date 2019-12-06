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
export const USER_CREATE = "stocked/user/CREATE";
export const USER_CREATE_SUCCESS = "stocked/user/CREATE_SUCCESS";
export const USER_CREATE_FAIL = "stocked/user/CREATE_FAIL";
export const USER_REMOVE = "stocked/user/REMOVE";
export const USER_REMOVE_SUCCESS = "stocked/user/REMOVE_SUCCESS";
export const USER_REMOVE_FAIL = "stocked/user/REMOVE_FAIL";
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

export const PRODUCTS_GET = "stocked/products/GET";
export const PRODUCTS_GET_SUCCESS = "stocked/products/GET_SUCCESS";
export const PRODUCTS_GET_FAIL = "stocked/products/GET_FAIL";
export const PRODUCTS_REMOVE = "stocked/products/REMOVE";
export const PRODUCTS_REMOVE_SUCCESS = "stocked/products/REMOVE_SUCCESS";
export const PRODUCTS_REMOVE_FAIL = "stocked/products/REMOVE_FAIL";
export const PRODUCTS_ADD = "stocked/products/ADD";
export const PRODUCTS_ADD_SUCCESS = "stocked/products/ADD_SUCCESS";
export const PRODUCTS_ADD_FAIL = "stocked/products/ADD_FAIL";
export const PRODUCTS_UPDATE = "stocked/products/UPDATE";
export const PRODUCTS_UPDATE_SUCCESS = "stocked/products/UPDATE_SUCCESS";
export const PRODUCTS_UPDATE_FAIL = "stocked/products/UPDATE_FAIL";
export const PRODUCT_SET_LIMITS = "stocked/products/SET_LIMITS";
export const PRODUCT_SET_LIMITS_SUCCESS = "stocked/products/SET_LIMITS_SUCCESS";
export const PRODUCT_SET_LIMITS_FAIL = "stocked/products/SET_LIMITS_FAIL";

export const SHIPMENTS_GET = "stocked/shipments/GET";
export const SHIPMENTS_GET_SUCCESS = "stocked/shipments/GET_SUCCESS";
export const SHIPMENTS_GET_FAIL = "stocked/shipments/GET_FAIL";
export const SHIPMENTS_CREATE = "stocked/shipments/CREATE";
export const SHIPMENTS_CREATE_SUCCESS = "stocked/shipments/CREATE_SUCCESS";
export const SHIPMENTS_CREATE_FAIL = "stocked/shipments/CREATE_FAIL";
export const SHIPMENTS_UPDATE = "stocked/shipments/UPDATE";
export const SHIPMENTS_UPDATE_SUCCESS = "stocked/shipments/UPDATE_SUCCESS";
export const SHIPMENTS_UPDATE_FAIL = "stocked/shipments/UPDATE_FAIL";

export const PROVIDERS_GET = "stocked/providers/GET";
export const PROVIDERS_GET_SUCCESS = "stocked/providers/GET_SUCCESS";
export const PROVIDERS_GET_FAIL = "stocked/providers/GET_FAIL";
export const PROVIDERS_CREATE = "stocked/providers/CREATE";
export const PROVIDERS_CREATE_SUCCESS = "stocked/providers/CREATE_SUCCESS";
export const PROVIDERS_CREATE_FAIL = "stocked/providers/CREATE_FAIL";
export const PROVIDERS_REMOVE = "stocked/providers/REMOVE";
export const PROVIDERS_REMOVE_SUCCESS = "stocked/providers/REMOVE_SUCCESS";
export const PROVIDERS_REMOVE_FAIL = "stocked/providers/REMOVE_FAIL";

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

export function register(email: string, password: string, mobilePhone: string, lastName: string, firstName: string, patronymic: string, birthday: string, setToken: boolean = false) {
    let formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('mobile_phone', mobilePhone);
    formData.append('last_name', lastName);
    formData.append('first_name', firstName);
    formData.append('patronymic', patronymic);
    formData.append('birthday', birthday);
    formData.append('set_token', setToken ? "True" : "False");

    return {
        type: USER_CREATE,
        payload: {
            client: 'auth',
            request: {
                url: '/auth/register/',
                method: 'POST',
                data: formData
            }
        }
    }
}

export function removeUser(userId: number) {
    return {
        type: USER_REMOVE,
        payload: {
            client: 'default',
            request: {
                url: '/users/' + userId + '/',
                method: 'DELETE'
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

export function getWarehouses(page: number = 0, ordering: string | null = '-id', search: string | null = null) {
    const offset = page * config.api.row_count;

    let params: any = {
        'offset': offset
    };

    if (ordering != null) {
        params.ordering = ordering;
    }
    if (search != null) {
        params.search = search;
    }

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

export function getUsers(page: number = 0, ordering: string | null = '-id', search: string | null = null) {
    const offset = page * config.api.row_count;

    let params: any = {
        'offset': offset
    };

    if (ordering != null) {
        params.ordering = ordering;
    }
    if (search != null) {
        params.search = search;
    }

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

export function getProducts(page: number = 0, ordering: string | null = '-id', search: string | null = null) {
    const offset = page * config.api.row_count;

    let params: any = {
        'offset': offset
    };

    if (ordering != null) {
        params.ordering = ordering;
    }
    if (search != null) {
        params.search = search;
    }

    return {
        type: PRODUCTS_GET,
        payload: {
            client: 'default',
            request: {
                url: '/products/',
                method: 'GET',
                params: params
            }
        }
    }
}

export function removeProduct(productId: number) {
    return {
        type: PRODUCTS_REMOVE,
        payload: {
            client: 'default',
            request: {
                url: '/products/' + productId + '/',
                method: 'DELETE'
            }
        }
    }
}

export function addProduct(name: string, warehouse: number, quantity: number = 0) {
    let formData = new FormData();
    formData.append('name', name);
    formData.append('warehouse', warehouse.toString());
    formData.append('quantity', quantity.toString());

    return {
        type: PRODUCTS_ADD,
        payload: {
            client: 'default',
            request: {
                url: '/products/',
                method: 'POST',
                data: formData
            }
        }
    }
}

export function setProductLimits(productId: number, minAmount: number = 0, maxAmount: number = 0) {
    let formData = new FormData();
    formData.append('min_amount', minAmount.toString());
    formData.append('max_amount', maxAmount.toString());

    return {
        type: PRODUCT_SET_LIMITS,
        payload: {
            client: 'default',
            request: {
                url: '/products/limit/' + productId  + '/',
                method: 'PUT',
                data: formData
            }
        }
    }
}

export function updateProduct(productId: number, name: string | null = null, warehouse: number | null = null, quantity: number | null = null) {
    let formData = new FormData();
    if (name != null) {
        formData.append('name', name);
    }
    if (warehouse != null) {
        formData.append('warehouse', warehouse.toString());
    }
    if (quantity != null) {
        formData.append('quantity', quantity.toString());
    }

    return {
        type: PRODUCTS_UPDATE,
        payload: {
            client: 'default',
            request: {
                url: '/products/' + productId + '/',
                method: 'PUT',
                data: formData
            }
        }
    }
}

export function getProviders(page: number = 0, ordering: string | null = '-id', search: string | null = null) {
    const offset = page * config.api.row_count;

    let params: any = {
        'offset': offset
    };

    if (ordering != null) {
        params.ordering = ordering;
    }
    if (search != null) {
        params.search = search;
    }

    return {
        type: PROVIDERS_GET,
        payload: {
            client: 'default',
            request: {
                url: '/providers/',
                method: 'GET',
                params: params
            }
        }
    }
}

export function removeProvider(providerId: number) {
    return {
        type: PROVIDERS_REMOVE,
        payload: {
            client: 'default',
            request: {
                url: '/providers/' + providerId + '/',
                method: 'DELETE'
            }
        }
    }
}

export function createShipment(providerId: number, productId: number, approximateDelivery: string, quantity: number = 0, status: number | null = null) {
    let formData = new FormData();
    formData.append('provider', providerId.toString());
    formData.append('product', productId.toString());
    formData.append('approximate_delivery', approximateDelivery);
    formData.append('quantity', quantity.toString());
    if (status != null) {
        formData.append('status', status.toString());
    }

    return {
        type: SHIPMENTS_CREATE,
        payload: {
            client: 'default',
            request: {
                url: '/shipments/',
                method: 'POST',
                data: formData
            }
        }
    }
}

export function addProvider(name: string, workingFrom: string, workingTo: string, avgDeliveryTime: number, phone: string, weekends: boolean) {
    let formData = new FormData();
    formData.append('name', name);
    formData.append('working_from', workingFrom);
    formData.append('working_to', workingTo);
    formData.append('average_delivery_time', avgDeliveryTime.toString());
    formData.append('phone', phone);
    formData.append('weekends', weekends ? "True" : "False");

    return {
        type: PROVIDERS_CREATE,
        payload: {
            client: 'default',
            request: {
                url: '/providers/',
                method: 'POST',
                data: formData
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
