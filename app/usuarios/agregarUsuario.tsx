import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const API_URL = "http://localhost:3001/users";

const AgregarUsuario = () => {
    const [nombre, setNombre] = useState("");
    const [apellidoP, setApellidoP] = useState("");
    const [apellidoM, setApellidoM] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleAgregar = async () => {
        if (!nombre || !apellidoP || !email || !password) {
            Alert.alert("🚨 Error", "Todos los campos son obligatorios");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("📧 Error", "Correo electrónico no válido");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, apellidoP, apellidoM, email, password }),
            });

            if (!response.ok) throw new Error("Error al agregar el usuario");

            Alert.alert("✅ Éxito", "Usuario agregado correctamente");
            router.push({ pathname: "/usuarios/listarUsuario" });
        } catch (error) {
            Alert.alert("❌ Error", "No se pudo agregar el usuario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="person-add" size={64} color="#007BFF" style={styles.icon} />
                <TouchableOpacity style={styles.homeButton} onPress={() => router.push("/Home")}> 
                    <Ionicons name="home" size={32} color="#007BFF" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Agregar Usuario</Text>
            <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Nombre" />
            <TextInput style={styles.input} value={apellidoP} onChangeText={setApellidoP} placeholder="Apellido Paterno" />
            <TextInput style={styles.input} value={apellidoM} onChangeText={setApellidoM} placeholder="Apellido Materno" />
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Correo Electrónico" keyboardType="email-address" />
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Contraseña" secureTextEntry />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleAgregar}>
                    <Ionicons name="checkmark-circle" size={24} color="white" />
                    <Text style={styles.buttonText}>Agregar Usuario</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f0f4f8",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    icon: {
        marginBottom: 10,
    },
    homeButton: {
        padding: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
    },
    input: {
        width: "90%",
        borderWidth: 1,
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        borderColor: "#ccc",
        backgroundColor: "#fff",
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#007BFF",
        padding: 15,
        borderRadius: 8,
        width: "90%",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        marginLeft: 10,
    },
});

export default AgregarUsuario;
