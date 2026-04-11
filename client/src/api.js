// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", 
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;