import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

export default function Interactuar() {
    const router = useRouter();

    const enviarSenal = async (accion: string) => {
        try {
            // Reemplazá esta URL con tu endpoint real
            const response = await axios.post("https://localhost:3001/api/control", {
                accion
            });
            Alert.alert("✅ Señal enviada", `Acción: ${accion}`);
        } catch (error) {
            console.error(error);
            Alert.alert("❌ Error", "No se pudo enviar la señal.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎮 Panel de Interacción</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => enviarSenal("prender_foco")}
            >
                <Text style={styles.buttonText}>💡 Prender Foco</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => enviarSenal("mover_servomotor")}
            >
                <Text style={styles.buttonText}>⚙️ Mover Servomotor</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() => router.push("/Home")}
            >
                <Text style={styles.buttonText}>🔙 Volver al Inicio</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222831",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#8E44AD",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
        width: "80%",
        alignItems: "center",
    },
    backButton: {
        backgroundColor: "#34495E",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
