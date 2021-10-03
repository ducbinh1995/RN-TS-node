import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios'

export const HOST_IMAGE = 'http://192.168.1.6:8080/'

class AxiosClass {
    instance: AxiosInstance | undefined;

    constructor() {
        if (!this.instance) {
            this.instance = axios.create({
                baseURL: 'http://192.168.1.6:8080', // mac ip address
                timeout: 20000
            })
            this.instance.interceptors.response.use(this.interceptorsResponse, this.interceptorsError)
        }
    }

    interceptorsResponse = (response: AxiosResponse) => {
        return response
    }

    interceptorsError = (error: AxiosError) => {
        const { response } = error
        if (response) {
            return Promise.reject(response.data)
        }
        return Promise.reject(error)
    }

    createRequest = async <T>(url: string, body: {} | null, method: Method, token?: string) => {
        let response: AxiosResponse<T> | undefined
        let headers: {}
        if (token !== null && token !== undefined) {
            headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }
        else {
            headers = {
                'Content-Type': 'application/json'
            }
        }
        if (body || method === "POST") {
            response = await this.instance?.request({
                url: url,
                data: body,
                method: method,
                headers: headers
            })
        }
        else {
            response = await this.instance?.request({
                url: url,
                method: method,
                headers: headers
            })
        }
        if (response?.data) {
            return response.data
        }
        return undefined
    }

    createFormDataRequest = async <T>(url: string, formData: FormData, token: string) => {
        let response: AxiosResponse<T> | undefined
        let headers: {}
        headers = {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        response = await this.instance?.request({
            url: url,
            data: formData,
            method: "POST",
            headers: headers
        })
        if (response?.data) {
            return response.data
        }
        return undefined
    }
}

const api = new AxiosClass()

export default api;