import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAdminInfo = async () => {
  const token = localStorage.getItem("token");
  return await axios.get(`${API_BASE_URL}/admin/info`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
