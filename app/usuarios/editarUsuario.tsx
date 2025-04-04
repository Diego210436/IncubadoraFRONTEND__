import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const API_URL = "http://localhost:3001/users";

const EditarUsuario = () => {
    const { id } = useLocalSearchParams();
    const [usuario, setUsuario] = useState({ nombre: "", apellidoP: "", apellidoM: "", email: "" });
    const router = useRouter();

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch(`${API_URL}/${id}`);
                const data = await response.json();
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: "#f4f4f4", 
        justifyContent: "center" 
    },
    title: { 
        fontSize: 26, 
        fontWeight: "bold", 
        textAlign: "center", 
        marginBottom: 20, 
        color: "#333" 
    },
    input: { 
        borderWidth: 1, 
        borderColor: "#ccc", 
        padding: 12, 
        marginBottom: 12, 
        borderRadius: 8, 
        backgroundColor: "#fff",
        fontSize: 16
    },
    button: { 
        backgroundColor: "#007bff", 
        padding: 15, 
        borderRadius: 8, 
        alignItems: "center",
        marginTop: 10
    },
    buttonText: { 
        color: "#fff", 
        fontSize: 18, 
        fontWeight: "bold" 
    }
});

export default EditarUsuario;
