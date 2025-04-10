import { useRouter } from "expo-router"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "../screens/LoginScreen"; // Importa la UI
import { login as loginService } from "../services/authService"; // Importa la función real de login

const Login = () => {
    const router = useRouter();

    const handleLogin = async (email: string, password: string): Promise<string> => {
        try {
            // 🔥 Llamamos al backend real
            const response = await loginService(email, password);
    
            if (response.success) {
                console.log("✅ Token recibido del backendDDD:", response.token);
                await AsyncStorage.setItem("userToken", response.token);
                
                // 🔄 Redirige correctamente
                router.replace("/(tabs)/Home");
                return response.token; // Return the token as a string
            } else {
                console.error("❌ Error en login:", response.error);
                throw new Error(response.error); // Throw an error if login fails
            }
        } catch (error) {
            console.error("❌ Error en autenticación:", error);
            throw error; // Re-throw the error to propagate it
        }
    };

    return <LoginScreen onLogin={handleLogin} />;
};



export default Login;
