import React, { useState, useEffect } from "react";
import {View,Text,ScrollView,TouchableOpacity,Dimensions,Modal,StyleSheet} from "react-native";
import { LineChart, BarChart, ProgressChart } from "react-native-chart-kit";
import { Icon } from "react-native-elements";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const generateFakeSensorData = () => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 10; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    data.push({
      fecha: date.toISOString().split("T")[0],
      temperatura: Math.floor(Math.random() * 10 + 20),
      humedad: Math.floor(Math.random() * 20 + 40),
    });
  }
  return data.reverse();
};

export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [sensorData, setSensorData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [focoEncendido, setFocoEncendido] = useState(false);
  const [servoAbierto, setServoAbierto] = useState(false);
  const [contadorFoco, setContadorFoco] = useState(0);
  const [contadorServo, setContadorServo] = useState(0);
  const [mensajeJSON, setMensajeJSON] = useState(null);

  const logoutUser = async () => {
    await AsyncStorage.removeItem("userToken");
    router.replace("/Login");
  };

  const handleFoco = () => {
    const nuevoEstado = !focoEncendido;
    setFocoEncendido(nuevoEstado);
    setContadorFoco((prev) => prev + 1);
    setMensajeJSON(
      JSON.stringify(
        {
          accion: nuevoEstado ? "Encender foco" : "Apagar foco",
          fecha: new Date().toLocaleString(),
        },
        null,
        2
      )
    );
  };

  const handleServo = () => {
    const nuevoEstado = !servoAbierto;
    setServoAbierto(nuevoEstado);
    setContadorServo((prev) => prev + 1);
    setMensajeJSON(
      JSON.stringify(
        {
          accion: nuevoEstado ? "Abrir servomotor" : "Cerrar servomotor",
          fecha: new Date().toLocaleString(),
        },
        null,
        2
      )
    );
  };

  useEffect(() => {
    setSensorData(generateFakeSensorData());
  }, []);

  const chartClickData = {
    labels: ["Foco", "Servo"],
    datasets: [{ data: [contadorFoco, contadorServo] }],
  };

  const currentSensor = selectedDate
    ? sensorData.find((item) => item.fecha === selectedDate)
    : sensorData[sensorData.length - 1];

  const tempChart = {
    labels: sensorData.map((d) => d.fecha.slice(5)),
    datasets: [{ data: sensorData.map((d) => d.temperatura) }],
  };

  const humChart = {
    labels: sensorData.map((d) => d.fecha.slice(5)),
    datasets: [{ data: sensorData.map((d) => d.humedad) }],
  };

  const humidityProgress = {
    data: [currentSensor?.humedad ? currentSensor.humedad / 100 : 0],
  };

  const temperatureProgress = {
    data: [currentSensor?.temperatura ? currentSensor.temperatura / 100 : 0],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(!menuVisible)}>
        <Icon name="bars" type="font-awesome" size={30} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>🏠 Bienvenido a la Incubadora Automatizada</Text>
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
      
      <View style={styles.progressContainer}>
        <View>
        <ProgressChart
        data={humidityProgress}
        width={200}
        height={200}
        strokeWidth={16}
        radius={48}
        chartConfig={styles.chartConfig}
        hideLegend
      />

          <Text style={styles.progressLabel}>💧 {currentSensor?.humedad ?? "--"}%</Text>
        </View>
        <View>
        <ProgressChart
        data={temperatureProgress}
        width={200}
        height={200}
        strokeWidth={16}
        radius={48}
        chartConfig={styles.chartConfig}
        hideLegend
      />

          <Text style={styles.progressLabel}>🔥 {currentSensor?.temperatura ?? "--"} °C</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controlItem}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              focoEncendido && styles.controlButtonActive,
            ]}
            onPress={handleFoco}
          >
            <Text style={styles.controlText}>
              {focoEncendido ? "Apagar Foco" : "Encender Foco"}
            </Text>
          </TouchableOpacity>
          <Icon
            name="lightbulb"
            type="font-awesome-5"
            color={focoEncendido ? "#FFD700" : "#ccc"}
            size={30}
          />
        </View>

        <View style={styles.controlItem}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              servoAbierto && styles.controlButtonActive,
            ]}
            onPress={handleServo}
          >
            <Text style={styles.controlText}>
              {servoAbierto ? "Cerrar Servo" : "Abrir Servo"}
            </Text>
          </TouchableOpacity>
          <Icon
            name="cogs"
            type="font-awesome-5"
            color={servoAbierto ? "green" : "#ccc"}
            size={30}
          />
        </View>
      </View>

      {mensajeJSON && (
        <View style={styles.jsonBox}>
          <Text style={styles.jsonText}>{mensajeJSON}</Text>
        </View>
      )}

      <Text style={styles.chartTitle}>🧮 Contador de Interacciones</Text>
      <BarChart
        data={chartClickData}
        width={Dimensions.get("window").width * 0.8}
        height={160}
        chartConfig={styles.chartConfig}
        fromZero
        style={styles.chartSmall}
        showBarTops
      />

      <TouchableOpacity
        style={styles.dateSelectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dateSelectorText}>📅 Seleccionar Día</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona un día:</Text>
            {sensorData.map((item) => (
              <TouchableOpacity
                key={item.fecha}
                onPress={() => {
                  setSelectedDate(item.fecha);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalItem}>{item.fecha}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Text style={styles.chartTitle}>📈 Temperatura (°C)</Text>
      <LineChart
        data={tempChart}
        width={Dimensions.get("window").width * 0.9}
        height={180}
        chartConfig={styles.chartConfig}
        bezier
        style={styles.chart}
      />

      <Text style={styles.chartTitle}>💧 Humedad (%)</Text>
      <LineChart
        data={humChart}
        width={Dimensions.get("window").width * 0.9}
        height={180}
        chartConfig={styles.chartConfig}
        bezier
        style={styles.chart}
      />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#222831", // Fondo oscuro
    padding: 20,
    paddingBottom: 40, // Espacio adicional para los gráficos y botones
  },
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: "#6A0DAD", // Morado para el botón del menú
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  menu: {
    position: "absolute",
    top: 90,
    left: 20,
    backgroundColor: "#F97F51", // Naranja para el menú
    padding: 15,
    borderRadius: 10,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "600", // Peso de letra más elegante
  },
  title: {
    fontSize: 28,
    fontWeight: "700", // Negrita para un efecto más marcado
    color: "#FFFFFF", // Morado para los títulos
    marginTop: 80,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#ccc", // Gris claro para los textos de descripción
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "400",
  },
  controlsContainer: {
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  controlItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 280,
    marginVertical: 15,
    backgroundColor: "#BE00FE", // Gris suave para los controles
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  controlButton: {
    backgroundColor: "#F97F51", // Naranja
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  controlButtonActive: {
    backgroundColor: "#6A0DAD", // Morado cuando está activo
  },
  controlText: {
    color: "#fff",
    fontWeight: "600", // Texto en negrita
  },
  jsonBox: {
    backgroundColor: "#2C2F3F", // Fondo oscuro y elegante
    padding: 12,
    borderRadius: 12,
    marginVertical: 15,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  jsonText: {
    fontFamily: "monospace",
    fontSize: 20,
    color: "#3EFF15", // Verde claro para mostrar datos JSON
  },
  chartTitle: {
    fontSize: 25,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
    color: "#FFFFFF", // Morado
  },
  chart: {
    borderRadius: 15,
    marginBottom: 30,
    backgroundColor: "#222831", // Fondo oscuro de las gráficas
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  chartSmall: {
    borderRadius: 15,
    marginVertical: 15,
  },
  chartConfig: {
    backgroundGradientFrom: "#222831", // Fondo oscuro
    backgroundGradientTo: "#222831", // Fondo oscuro
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(106, 13, 173, ${opacity})`, // Morado
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Blanco para las etiquetas
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#F97F51", // Naranja para los puntos
    },
  },
  dateSelectorButton: {
    backgroundColor: "#6A0DAD", // Morado
    padding: 14,
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 5,
  },
  dateSelectorText: {
    color: "#fff",
    fontWeight: "600", // Negrita para resaltar el texto
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)", // Fondo oscuro transparente
    padding: 30,
  },
  modalContent: {
    backgroundColor: "#2C2F3F", // Fondo elegante y oscuro para el modal
    borderRadius: 15,
    padding: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700", // Título en negrita
    marginBottom: 20,
    color: "#fff", // Blanco
  },
  modalItem: {
    fontSize: 18,
    paddingVertical: 10,
    color: "#F97F51", // Naranja
    fontWeight: "500",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  progressLabel: {
    textAlign: "center",
    marginTop: -15,
    fontWeight: "900", // grosor de texto
    color: "#FFFFFF", // Blanco para los textos de las gráficas circulares
  },
});
