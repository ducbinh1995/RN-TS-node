import { AnyAction } from "redux";
import { ErrorResponse } from "../../models/error";
import { FETCHING_REGISTER, REGISTER_FAILURE, REGISTER_RESET, REGISTER_SUCCESS } from "../actions/register";

export type RegisterState = {
    isFetchingRegister: boolean,
    registerSuccess: boolean,
    errorRegister: ErrorResponse | null
}

const initialState: RegisterState = {
    isFetchingRegister: false,
    registerSuccess: false,
    errorRegister: null
}

export const registerReducer = (state: RegisterState = initialState, action: AnyAction) => {
    switch (action.type) {
        case FETCHING_REGISTER:
            return {
                ...state,
                isFetchingRegister: true
            }

        case REGISTER_SUCCESS: 
            return {
                ...state,
                isFetchingRegister: false,
                registerSuccess: true,
                errorRegister: null
            }

        case REGISTER_FAILURE: 
            return {
                ...state,
                isFetchingRegister: false,
                registerSuccess: false,
                errorRegister: action.payload
            }

        case REGISTER_RESET: 
            return initialState
    
        default:
            return state;
    }
}