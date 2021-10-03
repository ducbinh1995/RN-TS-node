import { AnyAction } from "redux";
import { ErrorResponse } from "../../models/error";
import { User } from "../../models/user";
import { FETCHING_LOGIN, LOGIN_FAILURE, LOGIN_SUCCESS } from "../actions/auth";

export type AuthState = {
    isLoginToken: boolean | null,
    isFetchingLogin: boolean,
    user: User | null,
    errorLogin: ErrorResponse | null
}

const initialState: AuthState = {
    isLoginToken: null,
    isFetchingLogin: false,
    user: null,
    errorLogin: null
}

export const authReducer = (state: AuthState = initialState, action: AnyAction) => {
    switch (action.type) {
        case FETCHING_LOGIN:
            return {
                ...state,
                isFetchingLogin: true,
                isLoginToken: action.payload
            }

        case LOGIN_SUCCESS:
            return {
                ...state,
                isFetchingLogin: false,
                user: action.payload,
                errorLogin: null
            }

        case LOGIN_FAILURE:
            return {
                ...state,
                isFetchingLogin: false,
                user: null,
                errorLogin: action.payload
            }

        default:
            return state;
    }
}