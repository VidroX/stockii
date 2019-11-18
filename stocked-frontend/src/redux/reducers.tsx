import {
    SET_TOOLBAR_TITLE, SET_USER_DATA,
    USER_LOGIN,
    USER_LOGIN_FAIL,
    USER_LOGIN_SUCCESS, USER_LOGOUT, USER_LOGOUT_FAIL, USER_LOGOUT_SUCCESS
} from "./actions";

const initialState = {
    userData: null,
    toolbarTitle: 'Home',
    authData: null,
    logoutInitiated: false
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
        default:{
            return state;
        }
    }
}