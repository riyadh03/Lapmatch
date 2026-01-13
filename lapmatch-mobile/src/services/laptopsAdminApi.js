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
  const res = await fetch(`${BASE_URL}/admin/laptops/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data?.detail || data?.error?.message;
    throw new Error(detail || `Erreur ${res.status}`);
  }
  return data?.data ?? data;
};

export const fetchAdminLaptops = async () => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/admin/laptops`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data?.detail || data?.error?.message;
    throw new Error(detail || `Erreur ${res.status}`);
  }
  const payload = data?.data ?? data;
  return payload?.laptops ?? [];
};

export const deleteAdminLaptop = async (laptopId) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/admin/laptops/${laptopId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data?.detail || data?.error?.message;
    throw new Error(detail || `Erreur ${res.status}`);
  }
  return data;
};

export const updateAdminLaptop = async (laptopId, updates) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/admin/laptops/${laptopId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data?.detail || data?.error?.message;
    throw new Error(detail || `Erreur ${res.status}`);
  }
  return data?.data ?? data;
};
