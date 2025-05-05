import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function Interactuar() {
    const router = useRouter();
    const [mensajeJSON, setMensajeJSON] = useState<string | null>(null);
    const [focoEncendido, setFocoEncendido] = useState(false);
    const [servoAbierto, setServoAbierto] = useState(false);
    const [historial, setHistorial] = useState<Record<string, { foco: number; servo: number }>>({});

    const obtenerFecha = () => {
        const ahora = new Date();
        return ahora.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }); // "02/05"
    };

    const obtenerFechaHoraActual = () => {
        return new Date().toLocaleString();
    };

    const enviarSenal = (dispositivo: "foco" | "servomotor") => {
        const fecha = obtenerFecha();
        const hoy = historial[fecha] || { foco: 0, servo: 0 };

        let accion = "";

        if (dispositivo === "foco") {
            accion = focoEncendido ? "apagar_foco" : "encender_foco";
            setFocoEncendido(!focoEncendido);
            hoy.foco += 1;
        } else {
            accion = servoAbierto ? "cerrar_servomotor" : "abrir_servomotor";
            setServoAbierto(!servoAbierto);
            hoy.servo += 1;
        }

        setHistorial({ ...historial, [fecha]: hoy });

        const jsonSimulado = {
            mensaje: "Envío al backend http://localhost:3001/",
            accion,
            fechaHora: obtenerFechaHoraActual(),
        };

        setMensajeJSON(JSON.stringify(jsonSimulado, null, 2));
    };

    // Obtener todas las fechas para mostrar
    const fechas = Object.keys(historial);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>🎮 Panel de Interacción</Text>

            <TouchableOpacity style={styles.button} onPress={() => enviarSenal("foco")}>
                <Text style={styles.buttonText}>
                    💡 {focoEncendido ? "Apagar Foco" : "Encender Foco"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => enviarSenal("servomotor")}>
                <Text style={styles.buttonText}>
                    ⚙️ {servoAbierto ? "Cerrar Servomotor" : "Abrir Servomotor"}
                </Text>
            </TouchableOpacity>

            <Text style={styles.graphTitle}>📊 Interacciones por Día</Text>
            {fechas.map((fecha) => {
                const { foco, servo } = historial[fecha];
                const max = Math.max(foco, servo, 1);
                return (
                    <View key={fecha} style={styles.dayContainer}>
                        <Text style={styles.dateLabel}>🗓 {fecha}</Text>
                        <View style={styles.barContainer}>
                            <Text style={styles.barLabel}>Foco</Text>
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        width: `${(foco / max) * 100}%`,
                                        backgroundColor: "#8E44AD",
                                    },
                                ]}
                            />
                            <Text style={styles.barValue}>{foco}</Text>
                        </View>
                        <View style={styles.barContainer}>
                            <Text style={styles.barLabel}>Servo</Text>
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        width: `${(servo / max) * 100}%`,
                                        backgroundColor: "#3498DB",
                                    },
                                ]}
                            />
                            <Text style={styles.barValue}>{servo}</Text>
                        </View>
                    </View>
                );
            })}

            <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.push("/Home")}>
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
    graphTitle: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        marginTop: 30,
        marginBottom: 10,
    },
    dayContainer: {
        marginBottom: 15,
        width: "100%",
    },
    dateLabel: {
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 5,
    },
    barContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
        width: "90%",
    },
    barLabel: {
        color: "#fff",
        width: 60,
    },
    bar: {
        height: 20,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: "#ccc",
    },
    barValue: {
        color: "#fff",
        width: 30,
        textAlign: "right",
    },
});
