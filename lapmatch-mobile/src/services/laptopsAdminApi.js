import axios from "axios";
import { getAuth } from "firebase/auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const getToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return await user.getIdToken();
};

export const fetchAdminLaptopSummary = async () => {
  const token = await getToken();
  const res = await axios.get(`${BASE_URL}/admin/laptops/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data?.data ?? res.data;
};

export const fetchAdminLaptops = async () => {
  const token = await getToken();
  const res = await axios.get(`${BASE_URL}/admin/laptops`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload = res.data?.data ?? res.data;
  return payload?.laptops ?? [];
};

export const deleteAdminLaptop = async (laptopId) => {
  const token = await getToken();
  const res = await axios.delete(`${BASE_URL}/admin/laptops/${laptopId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const updateAdminLaptop = async (laptopId, updates) => {
  const token = await getToken();
  const res = await axios.patch(`${BASE_URL}/admin/laptops/${laptopId}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data?.data ?? res.data;
};
