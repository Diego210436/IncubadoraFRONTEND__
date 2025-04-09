import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const API_URL = "http://localhost:3001/users";

const EditarUsuario = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [usuario, setUsuario] = useState({
        nombre: "",
        apellidoP: "",
        apellidoM: "",
        email: "",
    });

    useEffect(() => {
        if (!id) return;

        const fetchUsuario = async () => {
            try {
                const response = await fetch(`${API_URL}/${id}`);
                if (!response.ok) throw new Error("Usuario no encontrado");
                const data = await response.json();
                console.log("Datos del usuario:", data);
                setUsuario(data);
            } catch (error) {
                Alert.alert("Error", "No se pudo cargar el usuario");
            }
        };

        fetchUsuario();
    }, [id]);

    const handleEditar = async () => {
        if (!usuario.nombre || !usuario.apellidoP || !usuario.email) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario),
            });

            if (!response.ok) throw new Error("Error al actualizar el usuario");

            Alert.alert("Éxito", "Usuario actualizado correctamente");
            router.push("/usuarios/listarUsuario");
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el usuario");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Usuario</Text>

            <TextInput
                style={styles.input}
                value={usuario.nombre}
                onChangeText={(text) => setUsuario({ ...usuario, nombre: text })}
                placeholder="Nombre"
                placeholderTextColor="#999"
            />

            <TextInput
                style={styles.input}
                value={usuario.apellidoP}
                onChangeText={(text) => setUsuario({ ...usuario, apellidoP: text })}
                placeholder="Apellido Paterno"
                placeholderTextColor="#999"
            />

            <TextInput
                style={styles.input}
                value={usuario.apellidoM}
                onChangeText={(text) => setUsuario({ ...usuario, apellidoM: text })}
                placeholder="Apellido Materno"
                placeholderTextColor="#999"
            />

            <TextInput
                style={styles.input}
                value={usuario.email}
                onChangeText={(text) => setUsuario({ ...usuario, email: text })}
                placeholder="Correo Electrónico"
                placeholderTextColor="#999"
                keyboardType="email-address"
            />

            <TouchableOpacity style={styles.button} onPress={handleEditar}>
                <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.push("/usuarios/listarUsuario")}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#222831",
        justifyContent: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#FFFFFF",
    },
    input: {
        borderWidth: 1,
        borderColor: "#8E44AD",
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: "#333",
        fontSize: 16,
        color: "#fff",
    },
    button: {
        backgroundColor: "#8E44AD",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    cancelButton: {
        marginTop: 10,
        padding: 12,
        alignItems: "center",
        backgroundColor: "#393E46",
        borderRadius: 8,
    },
    cancelButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
    },
});

export default EditarUsuario;
