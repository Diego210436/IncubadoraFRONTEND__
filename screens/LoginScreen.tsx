import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Input, Text, Button, Icon } from 'react-native-elements';
import { useRouter } from "expo-router";

interface LoginScreenProps {
    onLogin: (email: string, password: string) => Promise<string>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        try {
            const token = await onLogin(email, password);

            if (!token || token === "undefined") {
                setError("Token inválido. No se pudo iniciar sesión.");
                return;
            }

            // ✅ Ya se guarda el token en Login.tsx, así que aquí solo redirigimos
            router.push("/(tabs)/Home");
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
            <Text h3 style={styles.header}>Bienvenido</Text>
            <Text h4 style={styles.header}>Ingresa tus datos</Text>

            <Input
                placeholder="Ingresa tu correo"
                value={email}
                onChangeText={setEmail}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#8E44AD' }}
                autoCapitalize="none"
                placeholderTextColor="#aaa"
            />
            <Input
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                leftIcon={{ type: 'font-awesome', name: 'lock', color: '#8E44AD' }}
                placeholderTextColor="#aaa"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
                title="Iniciar sesión"
                onPress={handleSubmit}
                buttonStyle={styles.button}
                titleStyle={styles.buttonText}
                icon={<Icon name="sign-in" size={15} color="white" />}
            />

            <TouchableOpacity style={styles.link} onPress={() => router.push("/RecuperarContrasena")}>
                <Text style={styles.linkText}>Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => router.push("/usuarios/agregarUsuario")}>
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
        backgroundColor: "#222831",
    },
    header: {
        color: "#FFFFFF",
        marginBottom: 20,
        fontSize: 28,
        fontWeight: "bold",
        fontFamily: "Poppins_600SemiBold",
        textAlign: "center",
        letterSpacing: 1,
    },
    inputContainer: {
        marginBottom: 20,
        width: "100%",
        borderBottomWidth: 0,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#8E44AD",
        backgroundColor: "#333",
        paddingHorizontal: 10,
    },
    input: {
        color: "#FFFFFF",
        padding: 10,
    },
    errorText: {
        color: "red",
        marginBottom: 20,
        fontSize: 14,
    },
    button: {
        backgroundColor: "#8E44AD",
        borderRadius: 10,
        marginTop: 20,
        width: "100%",
        paddingVertical: 15,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 18,
    },
    link: {
        padding: 10,
    },
    linkText: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    icon: {
        width: 200,
        height: 200,
        marginBottom: 50,
    },
});

export default LoginScreen;
