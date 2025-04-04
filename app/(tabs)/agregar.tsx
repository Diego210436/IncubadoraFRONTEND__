import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

const API_URL = "http://localhost:3001/sensoresyactuadores";

const AgregarSensor = () => {
    const [tipo, setTipo] = useState("");
    const [nombre, setNombre] = useState("");
    const [valor, setValor] = useState("");
    const [unidad, setUnidad] = useState("");
    const router = useRouter();

    const handleAgregar = async () => {
        if (!tipo || !nombre || !valor || !unidad) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tipo,
                    nombre,
                    valor: parseFloat(valor), // Convertir a número
                    unidad,
                    fechaHora: new Date().toISOString(), // Fecha actual
                }),
            });

            if (!response.ok) throw new Error("Error al agregar el sensor");

            Alert.alert("Éxito", "Sensor agregado correctamente");
            router.push("/Sensores"); // Redirigir a la lista de sensores
        } catch (error) {
            Alert.alert("Error", "No se pudo agregar el sensor");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agregar Nuevo Sensor</Text>
            <TextInput style={styles.input} value={tipo} onChangeText={setTipo} placeholder="Tipo de sensor" />
            <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Nombre del sensor" />
            <TextInput style={styles.input} value={valor} onChangeText={setValor} placeholder="Valor" keyboardType="numeric" />
            <TextInput style={styles.input} value={unidad} onChangeText={setUnidad} placeholder="Unidad (°C, %, etc.)" />
            <Button title="Agregar Sensor" onPress={handleAgregar} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});

export default AgregarSensor;
