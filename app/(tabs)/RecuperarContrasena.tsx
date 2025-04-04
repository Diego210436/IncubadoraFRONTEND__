import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";

const API_URL = "https://localhost:3001/password-reset"; // URL correcta

const RecuperarContrasena = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEnviar = async () => {
        if (!email) {
            Alert.alert("Error", "Por favor, ingresa tu correo electrónico");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) throw new Error("Error al enviar el correo de recuperación");

            Alert.alert("Éxito", "Se ha enviado un enlace de recuperación a tu correo electrónico");
        } catch (error) {
            Alert.alert("Error", "No se pudo enviar el correo de recuperación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <Text style={styles.subtitle}>Ingresa tu correo para recibir instrucciones</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#00796B" />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleEnviar}>
                    <Text style={styles.buttonText}>Enviar enlace</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E0F7FA",
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#00796B",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#004D40",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#80CBC4",
        backgroundColor: "#fff",
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    button: {
        backgroundColor: "#00796B",
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
});

export default RecuperarContrasena;