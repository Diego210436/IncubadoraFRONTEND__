import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, FlatList, View, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
            <TouchableOpacity style={styles.addButtonContainer} onPress={() => router.push("/usuarios/agregarUsuario")}>
                <Text style={styles.addButton}>+ Agregar Usuario</Text>
            </TouchableOpacity>
            <View style={styles.header}>
                <TouchableOpacity style={styles.homeButton} onPress={() => router.push("/Home")}>
                    <Ionicons name="home" size={32} color="#9370DB" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Lista de Usuarios</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#8E44AD" />
            ) : (
                <FlatList
                    data={usuarios}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.nombre}>{item.nombre} {item.apellidoP} {item.apellidoM}</Text>
                            <Text style={styles.email}>{item.email}</Text>
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => router.push(`/usuarios/editarUsuario?id=${item._id}`)}>
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
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#222831",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#FFFFFF",
    },
    card: {
        backgroundColor: "#333",
        padding: 20,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 3,
    },
    nombre: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    email: {
        fontSize: 14,
        color: "#AAAAAA",
        marginTop: 5,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    editButton: {
        color: "#8E44AD",
        fontWeight: "bold",
    },
    deleteButton: {
        color: "#E64A19",
        fontWeight: "bold",
    },
    addButtonContainer: {
        backgroundColor: "#8E44AD",
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        alignSelf: "center",
    },
    addButton: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
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
});

export default ListarUsuarios;
