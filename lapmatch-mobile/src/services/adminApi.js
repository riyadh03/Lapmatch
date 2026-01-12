// services/adminApi.js
import axios from "axios";
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
    const response = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = response.data?.data?.users || response.data?.users || [];
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

// === 2️⃣ Créer un Admin ===
export const createAdminUser = async ({ uid, email, full_name }) => {
  try {
    const token = await getToken();

    await axios.post(
      `${BASE_URL}/admin/users`,
      {
        uid,
        email,
        full_name,
        user_type: "Admin",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

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
    await axios.delete(`${BASE_URL}/admin/users/${uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error("Erreur deleteUser:", error);
    throw error;
  }
};
