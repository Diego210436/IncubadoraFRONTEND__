import React, { useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { Input, Text, Button, Icon } from 'react-native-elements';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const API_URL = "http://localhost:3001/users";

const AgregarUsuario: React.FC = () => {
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
                <TouchableOpacity style={styles.homeButton} onPress={() => router.push("/")}>
                    <Ionicons name="home" size={32} color="#9370DB" />
                </TouchableOpacity>
            </View>
            <Text h3 style={styles.title}>Agregar Usuario</Text>
            <Input
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                leftIcon={{ type: 'font-awesome', name: 'user', color: '#8E44AD' }}
                placeholderTextColor="#aaa"
            />
            <Input
                placeholder="Apellido Paterno"
                value={apellidoP}
                onChangeText={setApellidoP}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                leftIcon={{ type: 'font-awesome', name: 'user', color: '#8E44AD' }}
                placeholderTextColor="#aaa"
            />
            <Input
                placeholder="Apellido Materno"
                value={apellidoM}
                onChangeText={setApellidoM}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                leftIcon={{ type: 'font-awesome', name: 'user', color: '#8E44AD' }}
                placeholderTextColor="#aaa"
            />
            <Input
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#8E44AD' }}
                keyboardType="email-address"
                placeholderTextColor="#aaa"
            />
            <Input
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                leftIcon={{ type: 'font-awesome', name: 'lock', color: '#8E44AD' }}
                placeholderTextColor="#aaa"
            />
            {loading ? (
                <ActivityIndicator size="large" color="#8E44AD" />
            ) : (
                <Button
                    title="Agregar Usuario"
                    onPress={handleAgregar}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    icon={<Icon name="checkmark-circle" size={24} color="white" />}
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
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    homeButton: {
        padding: 10,
    },
    title: {
        color: "#FFFFFF",
        marginBottom: 20,
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

export default AgregarUsuario;