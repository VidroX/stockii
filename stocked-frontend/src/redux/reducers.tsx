import {
    SET_LOADING, SET_SNACKBAR,
    SET_TOOLBAR_TITLE,
    SET_USER_DATA, SHOW_SNACKBAR,
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
    USER_LOGOUT_SUCCESS, WAREHOUSES_ADD, WAREHOUSES_ADD_FAIL, WAREHOUSES_ADD_SUCCESS,
    WAREHOUSES_GET,
    WAREHOUSES_GET_FAIL,
    WAREHOUSES_GET_SUCCESS, WAREHOUSES_REMOVE, WAREHOUSES_REMOVE_FAIL, WAREHOUSES_REMOVE_SUCCESS
} from "./actions";

const initialState = {
    userData: null,
    toolbarTitle: 'Home',
    authData: null,
    logoutInitiated: false,
    isDataLoading: false,
    showSnackbar: false,
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