import api from "../../api/api"
import { ErrorResponse } from "../../models/error"
import { User } from "../../models/user"
import { AppDispatch } from "../store"

export const FETCHING_LOGIN = "FETCHING_LOGIN"
export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGIN_FAILURE = "LOGIN_FAILURE"
export const LOGIN_RESET = "LOGIN_RESET"
export const USER_LOGOUT = "USER_LOGOUT"

const isFetchingLogin = (isLoginToken?: boolean) => {
    return { type: FETCHING_LOGIN, payload: isLoginToken }
}

const loginSuccess = (user: User) => {
    return { type: LOGIN_SUCCESS, payload: user }
}

const loginFailure = (err: ErrorResponse) => {
    return { type: LOGIN_FAILURE, payload: err }
}

export const loginReset = () => {
    return { type: LOGIN_RESET }
}

export const logout = () => {
    return { type: USER_LOGOUT }
}

export const loginActions = async (dispatch: AppDispatch, email?: string, password?: string, token?: string, isLoginToken?: boolean) => {
    dispatch(isFetchingLogin(isLoginToken))
    try {
        let data: User | undefined
        if (token) {
            data = await api.createRequest<User>("/auth/login", {}, "POST", token)
        }
        else {
            data = await api.createRequest<User>("/auth/login", { email, password }, "POST")
        }
        if (data) {
            const user: User = {
                token: data.token,
                userId: data.userId,
                role: data.role
            }
            dispatch(loginSuccess(user))
        }
        else {
            dispatch(loginFailure({
                message: "Something went wrong",
                code: 500
            }))
        }
    } catch (err) {
        let error: ErrorResponse = err as ErrorResponse
        dispatch(loginFailure(error))
    }

}