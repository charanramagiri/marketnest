import axios from "axios";

const API = axios.create({
  baseURL: "https://marketnest-backend-htxq.onrender.com/api",
  withCredentials: true
});

export default API;