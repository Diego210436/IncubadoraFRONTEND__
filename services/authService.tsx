import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://localhost:3001/api"; 

export const login = async (email: string, password: string) => {
    try {
        const response = await fetch(`${API_URL}/login`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("🔥 Respuesta del backend:", data); // 📌 Verifica qué devuelve el backend


        await AsyncStorage.setItem("userToken", data.token);
        const storedToken = await AsyncStorage.getItem("userToken");
        console.log("🔍 Token guardado en AsyncStorage:", storedToken);



        if (data.token) {
            return { success: true, token: data.token };
        } else {
            return { success: false, error: "Credenciales incorrectas" };
        }
    } catch (error) {
        console.error("❌ Error en login:", error);
        return { success: false, error: "Error de conexión" };
    }
};
