import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getMe } from "../services/authApi";

export default function useAdminGuard() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const me = await getMe();

        if (!me.is_admin) {
          navigation.replace("Home");
        }
      } catch (error) {
        navigation.replace("Login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  return loading;
}
