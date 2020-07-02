import axios from "axios";


export default function AxiosInterceptor(unauth) {
  axios.interceptors.response.use((response) => {
    return response
  }, error => {
    if (error.response.status === 401) {
      unauth()
    }
    return Promise.reject(error);
  }
  );
}
