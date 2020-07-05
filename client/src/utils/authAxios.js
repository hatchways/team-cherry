import axios from "axios";
import { storeUser, } from './localStorage'

export function AxiosInterceptor(unauth, hideRoutes) {
  axios.interceptors.response.use((response) => {
    return response
  }, error => {
    if (error.response.status === 401) {
      unauth()
      hideRoutes()
    }
    return Promise.reject(error);
  }
  );
}

export function loginInterceptor(setProtectedRoutes) {
  axios.interceptors.response.use((response) => {
    storeUser(response.data)
    setProtectedRoutes()
    return response
  }, (error) => {
    const stringError = JSON.stringify(error)
    if (stringError.includes('409')) return 'That email already exists'
    if (stringError.includes('404')) return "User doesn't exist"
    if (stringError.includes('403')) return 'Password does not match'
  }
  );
}


