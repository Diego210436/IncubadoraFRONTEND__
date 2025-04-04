import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';

const API_URL = "http://localhost:3001/sensoresyactuadores";

const EditarSensor = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [nombre, setNombre] = useState("");
    const [valor, setValor] = useState("");
    const [unidad, setUnidad] = useState("");

    useEffect(() => {
        const fetchSensor = async () => {
            try {
                const response = await fetch(`${API_URL}/${id}`);
                if (!response.ok) throw new Error("Error al obtener sensor");
                const data = await response.json();
                setNombre(data.nombre);
                setValor(data.valor.toString());
                setUnidad(data.unidad);
            } catch (error) {
                Alert.alert("Error", (error as Error).message);
            }
        };
        fetchSensor();
    }, [id]);

    const handleEditar = async () => {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, valor: parseFloat(valor), unidad }),
            });
            Alert.alert("Éxito", "Sensor actualizado correctamente");
            router.push("/Sensores"); 
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el sensor");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Sensor</Text>
            <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Nombre" />
            <TextInput style={styles.input} value={valor} onChangeText={setValor} keyboardType="numeric" placeholder="Valor" />
            <TextInput style={styles.input} value={unidad} onChangeText={setUnidad} placeholder="Unidad" />
            <TouchableOpacity style={styles.button} onPress={handleEditar}>
                <MaterialIcons name="save" size={24} color="white" />
                <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#222831" },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#FFFFFF" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5, width: "100%", backgroundColor: "white" },
    button: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 15, backgroundColor: "#9370DB", borderRadius: 5, width: "100%", marginTop: 20 },
    buttonText: { color: "white", fontWeight: "bold", marginLeft: 10 },
});

export default EditarSensor;