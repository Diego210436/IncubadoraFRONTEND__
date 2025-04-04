import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const API_URL = "http://localhost:3001/users";

const EliminarUsuario = () => {
    const { id } = useLocalSearchParams();
    interface Usuario {
        nombre: string;
        apellidoP: string;
        apellidoM: string;
    }

    const [usuario, setUsuario] = useState<Usuario | null>(null);
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

    const handleEliminar = async () => {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

            if (!response.ok) throw new Error("Error al eliminar el usuario");

            Alert.alert("Éxito", "Usuario eliminado correctamente");
            router.push({ pathname: "/usuarios/listarUsuario" });
        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el usuario");
        }
    };

    if (!usuario) return <Text>Cargando...</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿Eliminar Usuario?</Text>
            <Text style={styles.usuario}>{usuario.nombre} {usuario.apellidoP} {usuario.apellidoM}</Text>
            <Button title="Eliminar" onPress={handleEliminar} color="red" />
            <Button title="Cancelar" onPress={() => router.back()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: "center", justifyContent: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    usuario: { fontSize: 18, marginBottom: 20 },
});

export default EliminarUsuario;
