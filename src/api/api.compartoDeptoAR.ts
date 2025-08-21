import axios from "axios";

const axiosApi = axios.create({
  baseURL: import.meta.env.BASE_URL!,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});



export default axiosApi;