import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Input, Button, Text, Icon, ButtonGroup } from 'react-native-elements';
import { useRouter } from "expo-router";

const API_URL = "http://localhost:3001/sensoresyactuadores";

// Definir el enum para los tipos de dispositivo
enum Tipo {
    Sensor = "Sensor",
    Actuador = "Actuador",
}

interface Sensor {
    tipo: Tipo;
    nombre: string;
    valor: number;
    unidad: string;
    fechaHora: string;
}

const AgregarSensor: React.FC = () => {
    const [tipo, setTipo] = useState<Tipo | null>(null); // Empezar con null para que el usuario elija
    const [nombre, setNombre] = useState("");
    const [valor, setValor] = useState("");
    const [unidad, setUnidad] = useState("");
    const router = useRouter();

    // Manejar la selección del tipo
    const handleTipoChange = (selectedIndex: number) => {
        const selectedTipo = selectedIndex === 0 ? Tipo.Sensor : Tipo.Actuador;
        setTipo(selectedTipo);
    };

    const handleAgregar = async () => {
        if (!tipo || !nombre || !valor || !unidad) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        // Asegurarse de que el valor es válido
        if (tipo === Tipo.Actuador && !["0", "1"].includes(valor)) {
            Alert.alert("Error", "El valor para un Actuador debe ser 0 o 1");
            return;
        }

        const newSensor: Sensor = {
            tipo,
            nombre,
            valor: parseFloat(valor),
            unidad,
            fechaHora: new Date().toISOString(),
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSensor),
            });

            if (!response.ok) throw new Error("Error al agregar el sensor");

            Alert.alert("Éxito", "Sensor agregado correctamente");
            router.push("/Sensores");
        } catch (error) {
            Alert.alert("Error", "No se pudo agregar el sensor");
        }
    };

    return (
        <View style={styles.container}>
            <Text h3 style={styles.title}>
                {tipo ? (tipo === Tipo.Sensor ? "Agregar Nuevo Sensor" : "Agregar Nuevo Actuador") : "Selecciona un Tipo"}
            </Text>

            {/* Botón de selección de tipo */}
            <ButtonGroup
                buttons={["Sensor", "Actuador"]}
                selectedIndex={tipo === Tipo.Sensor ? 0 : tipo === Tipo.Actuador ? 1 : -1}
                onPress={handleTipoChange}
                containerStyle={styles.buttonGroup}
            />
            
            {tipo && (
                <>
                    <Input
                        placeholder="Nombre del dispositivo"
                        value={nombre}
                        onChangeText={setNombre}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        leftIcon={{ type: 'font-awesome', name: 'pencil', color: '#8E44AD' }}
                        placeholderTextColor="#aaa"
                    />
                    
                    <Input
                        placeholder={tipo === Tipo.Sensor ? "Valor" : "0 o 1"}
                        value={valor}
                        onChangeText={setValor}
                        keyboardType="numeric"
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        leftIcon={{ type: 'font-awesome', name: 'dollar', color: '#8E44AD' }}
                        placeholderTextColor="#aaa"
                    />
                    
                    <Input
                        placeholder="Unidad (°C, %, etc.)"
                        value={unidad}
                        onChangeText={setUnidad}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        leftIcon={{ type: 'font-awesome', name: 'exchange', color: '#8E44AD' }}
                        placeholderTextColor="#aaa"
                    />

                    <Button
                        title={tipo === Tipo.Sensor ? "Agregar Sensor" : "Agregar Actuador"}
                        onPress={handleAgregar}
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonText}
                        icon={<Icon name="plus" size={15} color="white" />}
                    />
                </>
            )}

            {/* Botón pequeño para volver al Home */}
            <Button
                title="Volver al Home"
                type="clear"
                titleStyle={{ color: "#8E44AD", fontSize: 14 }}
                onPress={() => router.push("/Home")}
                icon={{ name: "home", color: "#8E44AD", size: 16 }}
                containerStyle={{ marginTop: 10, alignSelf: "center" }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#222831",
        justifyContent: 'center',
    },
    title: {
        color: "#FFFFFF",
        marginBottom: 20,
        textAlign: "center",
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
    buttonGroup: {
        marginBottom: 20,
        width: "100%",
        borderWidth: 1,
        borderColor: "#8E44AD",
        borderRadius: 10,
    }
});

export default AgregarSensor;
