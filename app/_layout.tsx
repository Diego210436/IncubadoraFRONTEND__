import { useEffect, useState } from "react";
import { Slot, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("userToken");
                console.log("📌 Token recuperado de AsyncStorage:", storedToken);

                if (!storedToken && isMounted) {
                    router.replace("/Login"); // ✅ Usa la ruta correcta
                }
            } catch (error) {
                console.error("❌ Error al recuperar el token:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        checkAuth();

        return () => {
            isMounted = false; // Evita que se actualice el estado si el componente se desmonta
        };
    }, []);

    if (isLoading) return null; // Evita parpadeos

    return <Slot />; // Renderiza la pantalla actual según el enrutamiento
}
