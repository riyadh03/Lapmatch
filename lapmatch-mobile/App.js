import { useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 700);
    return () => clearTimeout(t);
  }, []);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#12122C",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("./assets/Lapmatch_Icone.jpg")}
          style={{ width: 150, height: 150, borderRadius: 28, marginBottom: 24 }}
          resizeMode="cover"
        />
        <ActivityIndicator size="small" color="#4953DD" />
      </View>
    );
  }

  return <AppNavigator />;
}
