import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, FlatList, View, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const API_URL = "http://localhost:3001/users";

const ListarUsuarios = () => {
    interface Usuario {
        _id: string;
        nombre: string;
        apellidoP: string;
        apellidoM: string;
        email: string;
    }

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                setUsuarios(data);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsuarios();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => router.push("/usuarios/agregarUsuario")}>
                <Text style={styles.addButton}>+ Agregar Usuario</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Lista de Usuarios</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#1E88E5" />
            ) : (
                <FlatList
                    data={usuarios}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.nombre}>{item.nombre} {item.apellidoP} {item.apellidoM}</Text>
                            <Text style={styles.email}>{item.email}</Text>
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => router.push({ pathname: "/usuarios/editarUsuario", params: { id: item._id } })}>
                                    <Text style={styles.editButton}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => router.push({ pathname: "/usuarios/eliminarUsuario", params: { id: item._id } })}>
                                    <Text style={styles.deleteButton}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    card: { backgroundColor: "#fff", padding: 20, marginBottom: 10, borderRadius: 10 },
    nombre: { fontSize: 18, fontWeight: "bold" },
    email: { fontSize: 14, color: "#666" },
    actions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
    editButton: { color: "blue" },
    deleteButton: { color: "red" },
    addButton: { backgroundColor: "#1E88E5", color: "#fff", padding: 10, textAlign: "center", borderRadius: 5 },
});

export default ListarUsuarios;
