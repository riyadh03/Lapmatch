// services/adminApi.js
import { getAuth } from "firebase/auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const getToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return await user.getIdToken();
};

// === 1️⃣ Récupérer tous les utilisateurs ===
export const fetchAdminUsers = async () => {
  try {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = data?.detail || data?.error?.message;
      throw new Error(detail || `Erreur ${response.status}`);
    }

    const payload = data?.data ?? data;
    const users = payload?.users || [];
    return users.map((u) => ({
      uid: u.uid,
      email: u.email,
      name: u.full_name || u.name || u.email,
      role: u.user_type || u.role,
      joinDate: u.joinDate,
      totalSpent: u.total_spent ?? u.totalSpent,
    }));
  } catch (error) {
    console.error("Erreur fetchAdminUsers:", error);
    throw error;
  }
};

export const fetchAdminUsersSummary = async () => {
  const token = await getToken();
  const response = await fetch(`${BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data?.detail || data?.error?.message;
    throw new Error(detail || `Erreur ${response.status}`);
  }

  const payload = data?.data ?? data;
  const users = payload?.users || [];
  return {
    total_users: Number(payload?.count ?? users.length) || 0,
    total_admins: users.filter((u) => (u.user_type || u.role) === "Admin").length,
    total_regular_users: users.filter((u) => (u.user_type || u.role) === "User").length,
  };
};

// === 2️⃣ Créer un Admin ===
export const createAdminUser = async ({ uid, email, full_name }) => {
  try {
    const token = await getToken();

    const response = await fetch(`${BASE_URL}/admin/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid,
        email,
        full_name,
        user_type: "Admin",
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = data?.detail || data?.error?.message;
      throw new Error(detail || `Erreur ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Erreur createAdminUser:", error);
    throw error;
  }
};

// === 3️⃣ Supprimer un utilisateur ===
export const deleteUser = async (uid) => {
  try {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/admin/users/${uid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = data?.detail || data?.error?.message;
      throw new Error(detail || `Erreur ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Erreur deleteUser:", error);
    throw error;
  }
};
