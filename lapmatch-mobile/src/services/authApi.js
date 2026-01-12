import { getAuth } from "firebase/auth";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const getMe = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();

  const response = await axios.get(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data?.data ?? response.data;
};
