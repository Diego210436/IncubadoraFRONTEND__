import { useRouter } from "expo-router";
import { useEffect } from "react";

const API_URL = "http://127.0.0.1:3001/"; // URL del backend

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("✅ API respondió correctamente:", data);
                router.replace("/Home"); // 🔹 Si la API responde, va a Home
            } catch (error) {
                console.error("❌ Error al conectar con la API:", error);
                router.replace("/loading"); // 🔹 Si falla, va a Error
                console.log("Fallo papi");
            }
        };

        fetchData();
    }, []);

    return null;
}
