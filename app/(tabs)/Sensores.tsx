import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    Text,
    FlatList,
    View,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

const API_URL = "http://localhost:3001/sensoresyactuadores";

const SensorItem = ({ item }: { item: any }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const [menuVisible, setMenuVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (menuVisible) {
            const timer = setTimeout(() => setMenuVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [menuVisible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const gesture = Gesture.LongPress()
        .onStart(() => {
            scale.value = withSpring(1.05);
            opacity.value = withSpring(0.8);
        })
        .onEnd(() => {
            scale.value = withSpring(1);
            opacity.value = withSpring(1);
            setMenuVisible(true);
        });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.card, animatedStyle, { position: 'relative' }]}>
                <Text style={styles.tipo}>{item.tipo}</Text>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.valor}>{item.valor} {item.unidad}</Text>
                <Text style={styles.fecha}>{new Date(item.fechaHora).toLocaleString()}</Text>
                {menuVisible && (
                    <Animated.View style={[styles.menu, { opacity: withSpring(menuVisible ? 1 : 0) }]}>
                        <TouchableOpacity onPress={() => router.push({ pathname: "/(tabs)/editar", params: { id: item._id } })}>
                            <Text style={styles.menuItem}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push({ pathname: "/(tabs)/eliminar", params: { id: item._id } })}>
                            <Text style={styles.menuItem}>Eliminar</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </Animated.View>
        </GestureDetector>
    );
};

const Sensores = () => {
    interface Sensor {
        _id: string;
        tipo: string;
        nombre: string;
        valor: number;
        unidad: string;
        fechaHora: string;
    }

    const [sensores, setSensores] = useState<Sensor[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchSensores = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const data = await response.json();
            console.log("📡 Datos recibidos:", data);

            setSensores(Array.isArray(data) ? data : data.sensores || []);
        } catch (error) {
            console.error("❌ Error al obtener sensores:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSensores();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={() => router.push("/Home")}>
                    <Text style={styles.homeIcon}>🏠</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Registros de Sensores y Actuadores</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#1E88E5" />
                ) : sensores.length > 0 ? (
                    <FlatList
                        data={sensores}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <SensorItem item={item} />}
                    />
                ) : (
                    <Text style={styles.noData}>No hay sensores disponibles</Text>
                )}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222831",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#FFFFFF",
    },
    card: {
        backgroundColor: "rgba(255,255,255,0.05)",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        position: "relative", // 👈 para el menú flotante
    },
    
    tipo: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    nombre: {
        fontSize: 16,
        color: "#AAAAAA",
    },
    valor: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#8E44AD",
    },
    fecha: {
        fontSize: 12,
        color: "#AAAAAA",
        marginTop: 5,
    },
    menu: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -20 }],
        flexDirection: 'row',
        gap: 10,
    },       
    menuItem: {
        fontSize: 14,
        padding: 5,
        textAlign: "center",
        color: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#555",
    },
    homeIcon: {
        fontSize: 24,
        textAlign: "center",
        color: "#FFFFFF",
        marginBottom: 20,
    },
    noData: {
        fontSize: 16,
        textAlign: "center",
        color: "#AAAAAA",
        marginTop: 20,
    },
    iconButton: {
        padding: 8,
        backgroundColor: "#9C27B0", // morado vibrante
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        elevation: 2,
    },    
    cardContent: {
        flexDirection: "column",
        gap: 2,
    },  
});

export default Sensores;