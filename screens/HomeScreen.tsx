import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, ScrollView, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LineChart, PieChart, BarChart, ProgressChart } from "react-native-chart-kit"; // Import additional charts
import { getSensorRecords } from "../services/api";

export default function HomeScreen() {
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);
    const [chartData, setChartData] = useState({ datasets: [{ data: [] }], labels: [] });
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState<string[]>([]);

    const logoutUser = async () => {
        await AsyncStorage.removeItem("userToken");
        console.log("🚪 Sesión cerrada. Token eliminado.");
        router.replace("/Login");
    };

    const loadChartData = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                throw new Error("No se encontró el token de usuario.");
            }
            const data = await getSensorRecords(token);
            const labels = data.map((item: any) => item.nombre);
            const sensorData = data.map((item: any) => item.valor);
            setChartData({ datasets: [{ data: sensorData }], labels });
        } catch (error) {
            console.error("Error al obtener datos de la API:", error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    useEffect(() => {
        loadChartData();
    }, []);

    const openModal = (content: string) => {
        setModalContent(content.split(' '));
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(!menuVisible)}>
                <Text style={styles.menuButtonText}>☰ Menú</Text>
            </TouchableOpacity>

            {menuVisible && (
                <View style={styles.menu}>
                    <TouchableOpacity onPress={() => router.push("/Home")}>
                        <Text style={styles.menuItem}>🏠 Inicio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/(tabs)/Sensores")}>
                        <Text style={styles.menuItem}>📡 Sensores</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/usuarios/listarUsuario")}>
                        <Text style={styles.menuItem}>👥 Usuarios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logoutUser}>
                        <Text style={styles.menuItem}>🚪 Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Text style={styles.title}>🏠 Bienvenido a la Incubadora</Text>
            <Text style={styles.subtitle}>Aquí puedes ver información general y navegar a otras secciones.</Text>
            <View style={styles.card}>
                <TouchableOpacity onPress={() => router.push("/agregar")}>
                    <Text style={styles.addButton}>+ Agregar Sensor</Text>
                </TouchableOpacity>

                <Text style={styles.cardText}>📡 Sensores Activos: 2</Text>
                <Text style={styles.cardText}>👥 Usuarios Registrados: --</Text>
                <Text style={styles.cardText}>📊 Última Actualización: 10 minutos</Text>
            </View>

            <Text style={styles.chartTitle}>📊 Actividad de Sensores</Text>
            <TouchableOpacity onPress={() => openModal('Datos de la actividad de los sensores')}>
                <LineChart
                    data={chartData}
                    width={Dimensions.get("window").width * 0.9}
                    height={220}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    style={styles.chart}
                />
            </TouchableOpacity>

            <Text style={styles.chartTitle}>📊 Gráfico de Barras de Sensores</Text>
            <TouchableOpacity onPress={() => openModal('Distribución de datos de los sensores')}>
                <BarChart
                    data={chartData}
                    width={Dimensions.get("window").width * 0.9}
                    height={220}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                    }}
                    style={styles.chart}
                />
            </TouchableOpacity>

            <Text style={styles.chartTitle}>📊 Gráfico de Pastel de Sensores</Text>
            <TouchableOpacity onPress={() => openModal('Distribución de datos de los sensores:')}>
                <PieChart
                    data={chartData.datasets[0].data.map((value, index) => ({
                        name: chartData.labels[index],
                        population: value,
                        color: `rgba(150, 180, 234, ${index / chartData.labels.length})`,
                        legendFontColor: "#7F7F7F",
                        legendFontSize: 10
                    }))}
                    width={Dimensions.get("window").width * 0.9}
                    height={220}
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    style={styles.chart}
                />
            </TouchableOpacity>

            <Text style={styles.chartTitle}>📊 Progreso de Tareas</Text>
            <TouchableOpacity onPress={() => openModal('Progreso de las tareas')}>
                <ProgressChart
                    data={{
                        labels: ["Tarea 1", "Tarea 2", "Tarea 3"],
                        data: [0.4, 0.6, 0.8]
                    }}
                    width={Dimensions.get("window").width * 0.9}
                    height={220}
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                    }}
                    style={styles.chart}
                />
            </TouchableOpacity>

            <View style={styles.profileCard}>
                <Image source={{ uri: 'https://example.com/profile.jpg' }} style={styles.profileImage} />
                <Text style={styles.profileTitle}>👤 Perfil de Usuario</Text>
                <Text style={styles.profileText}>Nombre: Diego</Text>
                <Text style={styles.profileText}>Correo: diego@example.com</Text>
                <Text style={styles.profileText}>Último inicio de sesión: Hace 2 horas</Text>
            </View>

            <View style={styles.notificationsCard}>
                <Text style={styles.notificationsTitle}>🔔 Notificaciones</Text>
                <View style={styles.notificationItem}>
                    <Text style={styles.notificationText}>🔧 Mantenimiento programado para mañana.</Text>
                </View>
                <View style={styles.notificationItem}>
                    <Text style={styles.notificationText}>📊 Nuevo informe de sensores disponible.</Text>
                </View>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {modalContent.map((word, index) => (
                            <Text key={index}>{word}</Text>
                        ))}
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        padding: 20,
    },
    menuButton: {
        position: "absolute",
        top: 40,
        left: 20,
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
    },
    menuButtonText: {
        color: "#fff",
        fontSize: 18,
    },
    menu: {
        position: "absolute",
        top: 80,
        left: 20,
        backgroundColor: "white",
        padding: 15,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    menuItem: {
        fontSize: 16,
        paddingVertical: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "gray",
        textAlign: "center",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 20,
        width: "80%",
    },
    cardText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    addButton: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#007AFF",
        textAlign: "center",
        marginVertical: 10,
    },
    errorText: {
        color: "red",
        fontSize: 18,
        marginTop: 20,
    },
    profileCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 20,
        width: "80%",
        alignItems: "center",
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    profileTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    profileText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    notificationsCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 20,
        width: "80%",
    },
    notificationsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    notificationItem: {
        backgroundColor: "#f9f9f9",
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    notificationText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        width: "50%",
    },
    closeButton: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: "center",
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
    }
});