import {
    SET_LOADING,
    SET_TOOLBAR_TITLE,
    SET_USER_DATA,
    USER_LOGIN,
    USER_LOGIN_FAIL,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_LOGOUT_FAIL,
    USER_LOGOUT_SUCCESS,
    WAREHOUSES_GET,
    WAREHOUSES_GET_FAIL,
    WAREHOUSES_GET_SUCCESS
} from "./actions";

const initialState = {
    userData: null,
    toolbarTitle: 'Home',
    authData: null,
    logoutInitiated: false,
    isDataLoading: false
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
        case SET_TOOLBAR_TITLE:{
            return {...state, toolbarTitle: action.payload.toolbarTitle}
        }
        case SET_USER_DATA:{
            return {...state, userData: action.payload.userData}
        }
        case SET_LOADING:{
            return {...state, isDataLoading: action.payload.isDataLoading}
        }
        case WAREHOUSES_GET:{
            return {...state, warehousesFetchProgress: true}
        }
        case WAREHOUSES_GET_SUCCESS:{
            return {...state, warehousesFetchProgress: false, warehousesData: action.payload.data}
        }
        case WAREHOUSES_GET_FAIL:{
            return {...state, warehousesFetchProgress: false, error: 'Cannot logout user'}
        }
        default:{
            return state;
        }
    }
}