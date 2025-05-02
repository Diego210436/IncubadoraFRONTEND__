import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function Interactuar() {
    const router = useRouter();
    const [mensajeJSON, setMensajeJSON] = useState<string | null>(null);

    const enviarSenal = (accion: string) => {
        const jsonSimulado = {
            mensaje: `Envío al backend http://localhost:3001/`,
            accion: accion,
        };

        setMensajeJSON(JSON.stringify(jsonSimulado, null, 2)); 
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                <Text style={styles.buttonText}>⚙️ Abrir Servomotor</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() => router.push("/Home")}
            >
                <Text style={styles.buttonText}>🔙 Volver al Inicio</Text>
            </TouchableOpacity>

            {mensajeJSON && (
                <View style={styles.jsonBox}>
                    <Text style={styles.jsonText}>{mensajeJSON}</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#222831",
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
    jsonBox: {
        backgroundColor: "#111",
        padding: 15,
        marginTop: 30,
        width: "90%",
        borderRadius: 10,
        borderColor: "#00FF9F",
        borderWidth: 1,
    },
    jsonText: {
        color: "#00FF9F",
        fontFamily: "monospace",
        fontSize: 14,
    },
});
