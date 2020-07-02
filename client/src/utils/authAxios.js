import axios from 'axios'
import { getToken } from './localStorage'


const authToken = getToken()
const authAxios = axios.create({
  headers: {
    Authorization: authToken
  }
})

export default authAxios
