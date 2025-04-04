import React, { useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Input, Text, Button, Icon } from 'react-native-elements';

const API_URL = "https://localhost:3001/password-reset"; // URL correcta

const RecuperarContrasena: React.FC = () => {
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
            <Text h3 style={styles.title}>Recuperar Contraseña</Text>
            <Text h4 style={styles.subtitle}>Ingresa tu correo para recibir instrucciones</Text>
            <Input
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#8E44AD' }}
                keyboardType="email-address"
                placeholderTextColor="#aaa"
            />
            {loading ? (
                <ActivityIndicator size="large" color="#8E44AD" />
            ) : (
                <Button
                    title="Enviar enlace"
                    onPress={handleEnviar}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    icon={<Icon name="paper-plane" size={15} color="white" />}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222831",
        padding: 20,
    },
    title: {
        color: "#FFFFFF",
        marginBottom: 10,
    },
    subtitle: {
        color: "#FFFFFF",
        marginBottom: 20,
        textAlign: "center",
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
});

export default RecuperarContrasena;