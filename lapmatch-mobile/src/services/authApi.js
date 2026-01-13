import { getAuth } from "firebase/auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const getMe = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();

  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data?.detail || data?.error?.message;
    throw new Error(detail || `Erreur ${response.status}`);
  }

  return data?.data ?? data;
};
