import {
    SET_TOOLBAR_TITLE, SET_USER_DATA,
    USER_LOGIN,
    USER_LOGIN_FAIL,
    USER_LOGIN_SUCCESS
} from "./actions";

const initialState = {
    userData: null,
    toolbarTitle: 'Home',
    authData: null
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