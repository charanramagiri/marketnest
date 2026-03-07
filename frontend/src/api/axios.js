import axios from "axios";

const API = axios.create({
  baseURL: "https://marketnest-backend-htxq.onrender.com/",
  withCredentials: true
});

export default API;