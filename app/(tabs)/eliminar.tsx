import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Modal, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';

const API_URL = "http://localhost:3001/sensoresyactuadores";

const EliminarSensor = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);

    const handleEliminar = async () => {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            Alert.alert("Eliminado", "Sensor eliminado correctamente");
            router.push("/Sensores");
        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el sensor");
        }
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>¿Eliminar este sensor?</Text>
                        <TouchableOpacity style={[styles.button, styles.buttonEliminar]} onPress={handleEliminar}>
                            <MaterialIcons name="delete" size={24} color="white" />
                            <Text style={styles.buttonText}>Eliminar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonCancelar]} onPress={() => setModalVisible(false)}>
                            <MaterialIcons name="cancel" size={24} color="white" />
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity style={styles.openButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.openButtonText}>Eliminar Sensor</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalView: { width: 300, backgroundColor: "white", borderRadius: 10, padding: 20, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
    button: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10, borderRadius: 10, marginTop: 10, width: "80%" },
    buttonText: { color: "white", fontWeight: "bold", marginLeft: 10 },
    buttonEliminar: { backgroundColor: "red" },
    buttonCancelar: { backgroundColor: "gray" },
    openButton: { padding: 15, backgroundColor: "black", borderRadius: 10 },
    openButtonText: { color: "white", fontWeight: "bold" },
});

export default EliminarSensor;