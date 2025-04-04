import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

const LoginScreen = ({ onLogin }: { onLogin: (email: string, password: string) => void }) => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        try {
            await onLogin(email, password);
            router.push("/(tabs)/Home"); // Redirige a Home después del login
        } catch (err) {
            setError("Error al iniciar sesión");
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../images/eggicon.png')}
                style={styles.icon}
                resizeMode="contain"
            />

            <Text style={styles.header}>Bienvenido</Text>
            <Text style={styles.header}>Ingresa tus datos</Text>
            <Text style={styles.label}>Correo electrónico:</Text>
            <TextInput 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none" 
                placeholder="Ingresa tu correo" 
            />
            <Text style={styles.label}>Contraseña:</Text>
            <TextInput 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
                placeholder="Ingresa tu contraseña" 
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.link} onPress={() => router.push("/RecuperarContrasena")}>
                <Text style={styles.linkText}>Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.link} onPress={() => router.push("./usuarios/agregarUsuario")}>
                <Text style={styles.linkText}>Registra un nuevo usuario</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "rgb(80, 112, 210)",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
        color: "#fefdfd",
    },
    label: {
        fontSize: 16,
        color: "#ffffff",
        alignSelf: "flex-start",
        marginBottom: 5,
    },
    input: {
        width: "100%",
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#ddd",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    errorText: {
        color: "red",
        marginBottom: 20,
        fontSize: 14,
    },
    button: {
        backgroundColor: "#17b100",
        padding: 15,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    link: {
        padding: 10,
    },
    linkText: {
        color: "#fff",
        fontSize: 16,
    },
    icon: {
        width: 200,
        height: 200,
        marginBottom: 50,
    },
});

export default LoginScreen;
