
import BASE_URL from "../../services/urls.service";
import axios from "axios";

export const generateFilePath = (fileName:string) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${fileName}`;
};
export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
