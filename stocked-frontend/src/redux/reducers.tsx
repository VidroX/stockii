import {
    PRODUCT_SET_LIMITS,
    PRODUCT_SET_LIMITS_FAIL,
    PRODUCT_SET_LIMITS_SUCCESS,
    PRODUCTS_ADD,
    PRODUCTS_ADD_FAIL,
    PRODUCTS_ADD_SUCCESS,
    PRODUCTS_GET,
    PRODUCTS_GET_FAIL,
    PRODUCTS_GET_SUCCESS,
    PRODUCTS_REMOVE,
    PRODUCTS_REMOVE_FAIL,
    PRODUCTS_REMOVE_SUCCESS,
    PRODUCTS_UPDATE,
    PRODUCTS_UPDATE_FAIL,
    PRODUCTS_UPDATE_SUCCESS,
    PROVIDERS_CREATE,
    PROVIDERS_CREATE_FAIL,
    PROVIDERS_CREATE_SUCCESS,
    PROVIDERS_GET, PROVIDERS_GET_FAIL,
    PROVIDERS_GET_SUCCESS, PROVIDERS_REMOVE, PROVIDERS_REMOVE_FAIL, PROVIDERS_REMOVE_SUCCESS,
    SET_LOADING,
    SET_SNACKBAR,
    SET_TOOLBAR_TITLE,
    SET_USER_DATA,
    SHIPMENTS_CREATE,
    SHIPMENTS_CREATE_FAIL,
    SHIPMENTS_CREATE_SUCCESS,
    SHIPMENTS_GET,
    SHIPMENTS_GET_FAIL,
    SHIPMENTS_GET_SUCCESS,
    SHIPMENTS_UPDATE,
    SHIPMENTS_UPDATE_FAIL,
    SHIPMENTS_UPDATE_SUCCESS,
    SHOW_SNACKBAR,
    USER_ACCESS_ADD,
    USER_ACCESS_ADD_FAIL,
    USER_ACCESS_ADD_SUCCESS,
    USER_LIST,
    USER_LIST_FAIL,
    USER_LIST_SUCCESS,
    USER_LOGIN,
    USER_LOGIN_FAIL,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_LOGOUT_FAIL,
    USER_LOGOUT_SUCCESS,
    WAREHOUSES_ADD,
    WAREHOUSES_ADD_FAIL,
    WAREHOUSES_ADD_SUCCESS,
    WAREHOUSES_GET,
    WAREHOUSES_GET_FAIL,
    WAREHOUSES_GET_SUCCESS,
    WAREHOUSES_REMOVE,
    WAREHOUSES_REMOVE_FAIL,
    WAREHOUSES_REMOVE_SUCCESS
} from "./actions";

const initialState = {
    userData: null,
    toolbarTitle: 'Home',
    authData: null,
    logoutInitiated: false,
    isDataLoading: false,
    showSnackbar: false,
    warehousesData: {
        isFetching: false,
        data: null,
        error: false
    },
    snackBarData: {
        type: 'default',
        body: ""
    }
};

export default function mainReducer(state = initialState, action: any){
    switch (action.type){
        case USER_LOGIN:{
            return {...state, authProgress: true}
        }
        case USER_LOGIN_SUCCESS:{
            return {
                ...state,
                authProgress: false,
                authData: action.payload.data
            }
        }
        case USER_LOGIN_FAIL:{
            return {...state, authProgress: false, error: 'Cannot authenticate user'}
        }
        case USER_LOGOUT:{
            return {...state, logoutInitiated: true, logoutProgress: true}
        }
        case USER_LOGOUT_SUCCESS:{
            return {...state, logoutProgress: false}
        }
        case USER_LOGOUT_FAIL:{
            return {...state, logoutProgress: false, error: 'Cannot logout user'}
        }
        case USER_LIST:{
            return {...state, userListProgress: true}
        }
        case USER_LIST_SUCCESS:{
            return {...state, userListProgress: false, userListData: action.payload.data}
        }
        case USER_LIST_FAIL:{
            return {...state, userListProgress: false, error: 'Cannot get user list'}
        }
        case USER_ACCESS_ADD:{
            return {...state, userAccessProgress: true}
        }
        case USER_ACCESS_ADD_SUCCESS:{
            return {...state, userAccessProgress: false, userAccessData: action.payload.data}
        }
        case USER_ACCESS_ADD_FAIL:{
            return {...state, userAccessProgress: false, error: 'Cannot give access to user'}
        }
        case WAREHOUSES_ADD:{
            return {...state, warehouseAddProgress: true}
        }
        case WAREHOUSES_ADD_SUCCESS:{
            return {...state, warehouseAddProgress: false, addWarehousesData: action.payload.data}
        }
        case WAREHOUSES_ADD_FAIL:{
            return {...state, warehouseAddProgress: false, error: 'Cannot add warehouse'}
        }
        case WAREHOUSES_REMOVE:{
            return {...state, warehouseRemoveProgress: true}
        }
        case WAREHOUSES_REMOVE_SUCCESS:{
            return {...state, warehouseRemoveProgress: false, removeWarehousesData: action.payload.data}
        }
        case WAREHOUSES_REMOVE_FAIL:{
            return {...state, warehouseRemoveProgress: false, error: 'Cannot remove warehouse'}
        }
        case PRODUCTS_ADD:{
            return {...state, productsAddProgress: true}
        }
        case PRODUCTS_ADD_SUCCESS:{
            return {...state, productsAddProgress: false, productsAddData: action.payload.data}
        }
        case PRODUCTS_ADD_FAIL:{
            return {...state, productsAddProgress: false, error: 'Cannot add product'}
        }
        case PRODUCTS_REMOVE:{
            return {...state, productsRemoveProgress: true}
        }
        case PRODUCTS_REMOVE_SUCCESS:{
            return {...state, productsRemoveProgress: false, productsRemoveData: action.payload.data}
        }
        case PRODUCTS_REMOVE_FAIL:{
            return {...state, productsRemoveProgress: false, error: 'Cannot remove product'}
        }
        case PRODUCTS_GET:{
            return {...state, productsGetProgress: true}
        }
        case PRODUCTS_GET_SUCCESS:{
            return {...state, productsGetProgress: false, productsData: action.payload.data}
        }
        case PRODUCTS_GET_FAIL:{
            return {...state, productsGetProgress: false, error: 'Cannot get products'}
        }
        case PRODUCTS_UPDATE:{
            return {...state, productsUpdateProgress: true}
        }
        case PRODUCTS_UPDATE_SUCCESS:{
            return {...state, productsUpdateProgress: false, productsUpdateData: action.payload.data}
        }
        case PRODUCTS_UPDATE_FAIL:{
            return {...state, productsUpdateProgress: false, error: 'Cannot update product'}
        }
        case PRODUCT_SET_LIMITS:{
            return {...state, productSetLimitsProgress: true}
        }
        case PRODUCT_SET_LIMITS_SUCCESS:{
            return {...state, productSetLimitsProgress: false, productSetLimitsData: action.payload.data}
        }
        case PRODUCT_SET_LIMITS_FAIL:{
            return {...state, productSetLimitsProgress: false, error: 'Cannot set limits on product'}
        }
        case SHIPMENTS_CREATE:{
            return {...state, shipmentsCreateProgress: true}
        }
        case SHIPMENTS_CREATE_SUCCESS:{
            return {...state, shipmentsCreateProgress: false, shipmentsCreateData: action.payload.data}
        }
        case SHIPMENTS_CREATE_FAIL:{
            return {...state, shipmentsCreateProgress: false, error: 'Cannot create shipment'}
        }
        case SHIPMENTS_GET:{
            return {...state, shipmentsGetProgress: true}
        }
        case SHIPMENTS_GET_SUCCESS:{
            return {...state, shipmentsGetProgress: false, shipmentsData: action.payload.data}
        }
        case SHIPMENTS_GET_FAIL:{
            return {...state, shipmentsGetProgress: false, error: 'Cannot get shipments'}
        }
        case SHIPMENTS_UPDATE:{
            return {...state, shipmentsUpdateProgress: true}
        }
        case SHIPMENTS_UPDATE_SUCCESS:{
            return {...state, shipmentsUpdateProgress: false, shipmentsUpdateData: action.payload.data}
        }
        case SHIPMENTS_UPDATE_FAIL:{
            return {...state, shipmentsUpdateProgress: false, error: 'Cannot update shipment'}
        }
        case PROVIDERS_CREATE:{
            return {...state, providersCreateProgress: true}
        }
        case PROVIDERS_CREATE_SUCCESS:{
            return {...state, providersCreateProgress: false, providersCreateData: action.payload.data}
        }
        case PROVIDERS_CREATE_FAIL:{
            return {...state, providersCreateProgress: false, error: 'Cannot create provider'}
        }
        case PROVIDERS_GET:{
            return {...state, providersGetProgress: true}
        }
        case PROVIDERS_GET_SUCCESS:{
            return {...state, providersGetProgress: false, providersData: action.payload.data}
        }
        case PROVIDERS_GET_FAIL:{
            return {...state, providersGetProgress: false, error: 'Cannot get providers'}
        }
        case PROVIDERS_REMOVE:{
            return {...state, providersRemoveProgress: true}
        }
        case PROVIDERS_REMOVE_SUCCESS:{
            return {...state, providersRemoveProgress: false, providersRemoveData: action.payload.data}
        }
        case PROVIDERS_REMOVE_FAIL:{
            return {...state, providersRemoveProgress: false, error: 'Cannot remove provider'}
        }
        case SET_TOOLBAR_TITLE:{
            return {...state, toolbarTitle: action.payload.toolbarTitle}
        }
        case SET_USER_DATA:{
            return {...state, userData: action.payload.userData}
        }
        case SET_LOADING:{
            return {...state, isDataLoading: action.payload.isDataLoading}
        }
        case SET_SNACKBAR:{
            return {...state, snackBarData: action.payload.snackbar}
        }
        case SHOW_SNACKBAR:{
            return {...state, showSnackbar: action.payload.showSnackbar}
        }
        case WAREHOUSES_GET:{
            return {
                ...state,
                warehousesData: {
                    isFetching: true,
                    data: null,
                    error: false
                }
            }
        }
        case WAREHOUSES_GET_SUCCESS:{
            return {
                ...state,
                warehousesData: {
                    isFetching: false,
                    data: action.payload.data,
                    error: false
                }
            }
        }
        case WAREHOUSES_GET_FAIL:{
            return {
                ...state,
                warehousesData: {
                    isFetching: false,
                    data: null,
                    error: true
                }
            }
        }
        default:{
            return state;
        }
    }
}