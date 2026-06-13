import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "https://marketnest-backend-htxq.onrender.com/api",

  withCredentials: true
});

export default API;


// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://marketnest-backend-htxq.onrender.com/api",
//   withCredentials: true
// });

// export default API;


// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: true
// });

// export default API;