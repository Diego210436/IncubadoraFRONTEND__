import { useEffect } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView, Text, ActivityIndicator, Image, Animated } from "react-native";

export default function LoadingScreen() {
    const router = useRouter();
    const fadeAnim = new Animated.Value(0); // Animación de opacidad

    useEffect(() => {
        // Inicia la animación
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start();

        // Simula una carga antes de redirigir
        setTimeout(() => {
            router.replace("/Login"); // Redirige a HomeScreen
        }, 2000);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
            <Animated.Image 
                source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Egg_white.png" }} 
                style={{ width: 100, height: 100, opacity: fadeAnim }}
            />
            <Text style={{ fontSize: 40, marginTop: 20 }}>Bienvenido</Text>
            <Text style={{ fontSize: 20, marginTop: 10 }}>Cargando...</Text>
            <ActivityIndicator size="large" color="#6200ea" style={{ marginTop: 20 }} />
        </SafeAreaView>
    );
}
