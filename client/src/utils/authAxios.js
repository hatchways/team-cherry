import axios from "axios";
import { storeUser } from './localStorage'

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
    storeUser(response.data.user)
    setProtectedRoutes()
    return response
  }, error => {
    console.log('something went wrong')

    return Promise.reject(error);
  }
  );
}
