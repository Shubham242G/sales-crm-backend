import { getAuth } from "@/utils/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

 const axiosAuth = axios.create();

const handleLogout = (navigate:any) => {
  localStorage.removeItem("token");
  navigate("/");
};

axiosAuth.interceptors.request.use(
  async function (config) {
    const decodedToken = await getAuth();
    console.log(decodedToken,"ffffffffffffffffffffffffffffffffffffffffffffffff")
    if (decodedToken?.token) {
      config.headers["Authorization"] = `Bearer ${decodedToken?.token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const navigate = useNavigate();
      handleLogout(navigate);
    }
    return Promise.reject(error);
  }
);

export default axiosAuth;
