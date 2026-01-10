import { registerUser } from "./authService";

export default function App() {

  const testAuth = async () => {
    try {
      await registerUser("testexpo@gmail.com", "123456");
      console.log("Utilisateur créé avec succès");
    } catch (e) {
      console.log(e.message);
    }
  };

  testAuth();

  return null;
}
