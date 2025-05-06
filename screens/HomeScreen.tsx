import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Modal, StyleSheet } from "react-native";
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
  const [modalType, setModalType] = useState("day");
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
    setMensajeJSON(JSON.stringify({ accion: nuevoEstado ? "Encender foco" : "Apagar foco", fecha: new Date().toLocaleString() }, null, 2));
  };

  const handleServo = () => {
    const nuevoEstado = !servoAbierto;
    setServoAbierto(nuevoEstado);
    setContadorServo((prev) => prev + 1);
    setMensajeJSON(JSON.stringify({ accion: nuevoEstado ? "Abrir servomotor" : "Cerrar servomotor", fecha: new Date().toLocaleString() }, null, 2));
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

  const semanas = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const fechaInicio = sensorData[0]?.fecha || "";
  const fechaFin = sensorData[sensorData.length - 1]?.fecha || "";

  const renderModalContent = () => {
    let items = [];
    if (modalType === "day") {
      items = sensorData.map((item) => (
        <TouchableOpacity key={item.fecha} onPress={() => { setSelectedDate(item.fecha); setModalVisible(false); }}>
          <Text style={styles.modalItem}>{item.fecha}</Text>
        </TouchableOpacity>
      ));
    } else if (modalType === "week") {
      items = semanas.map((semana, index) => (
        <TouchableOpacity key={index} onPress={() => { setSelectedDate(semana); setModalVisible(false); }}>
          <Text style={styles.modalItem}>{semana}</Text>
        </TouchableOpacity>
      ));
    } else {
      items = meses.map((mes, index) => (
        <TouchableOpacity key={index} onPress={() => { setSelectedDate(mes); setModalVisible(false); }}>
          <Text style={styles.modalItem}>{mes}</Text>
        </TouchableOpacity>
      ));
    }
    return <ScrollView>{items}</ScrollView>;
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
          <ProgressChart data={humidityProgress} width={200} height={200} strokeWidth={16} radius={48} chartConfig={styles.chartConfig} hideLegend />
          <Text style={styles.progressLabel}>💧 {currentSensor?.humedad ?? "--"}%</Text>
          <Text style={styles.updatedText}>Actualizado hace 2 horas</Text>
        </View>
        <View>
          <ProgressChart data={temperatureProgress} width={200} height={200} strokeWidth={16} radius={48} chartConfig={styles.chartConfig} hideLegend />
          <Text style={styles.progressLabel}>🔥 {currentSensor?.temperatura ?? "--"} °C</Text>
          <Text style={styles.updatedText}>Actualizado hace 2 horas</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controlItem}>
          <TouchableOpacity style={[styles.controlButton, focoEncendido && styles.controlButtonActive]} onPress={handleFoco}>
            <Text style={styles.controlText}>{focoEncendido ? "Apagar Foco" : "Encender Foco"}</Text>
          </TouchableOpacity>
          <Icon name="lightbulb" type="font-awesome-5" color={focoEncendido ? "#FFD700" : "#ccc"} size={30} />
        </View>

        <View style={styles.controlItem}>
          <TouchableOpacity style={[styles.controlButton, servoAbierto && styles.controlButtonActive]} onPress={handleServo}>
            <Text style={styles.controlText}>{servoAbierto ? "Cerrar Servo" : "Abrir Servo"}</Text>
          </TouchableOpacity>
          <Icon name="cogs" type="font-awesome-5" color={servoAbierto ? "green" : "#ccc"} size={30} />
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

<View style={styles.dateSelectorContainer}>
        <TouchableOpacity style={styles.dateSelectorButton} onPress={() => { setModalType("day"); setModalVisible(true); }}>
          <Text style={styles.dateSelectorText}>📅 Día</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateSelectorButton} onPress={() => { setModalType("week"); setModalVisible(true); }}>
          <Text style={styles.dateSelectorText}>📅 Semana</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateSelectorButton} onPress={() => { setModalType("month"); setModalVisible(true); }}>
          <Text style={styles.dateSelectorText}>📅 Mes</Text>
        </TouchableOpacity>
      </View>   

     <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={modalType === "day" ? styles.modalContainerDay : modalType === "week" ? styles.modalContainerWeek : styles.modalContainerMonth}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Selecciona una opción:</Text>
            {renderModalContent()}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>


      {/* TEMP CHART */}
      <Text style={styles.chartTitle}>📈 Temperatura (°C)</Text>
     
      <Text style={{ color: "#fff", fontWeight: "600", alignSelf: "flex-start", marginBottom: 5 }}>
        📅 Del {fechaInicio} al {fechaFin}
      </Text>
      <LineChart
        data={tempChart}
        width={Dimensions.get("window").width * 0.9}
        height={180}
        chartConfig={styles.chartConfig}
        bezier
        style={styles.chart}
      />

      {/* HUM CHART */}
      <Text style={styles.chartTitle}>💧 Humedad (%)</Text>
      <Text style={{ color: "#fff", fontWeight: "600", alignSelf: "flex-start", marginBottom: 5 }}>
        📅 Del {fechaInicio} al {fechaFin}
      </Text>
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
    backgroundColor: "#222831",
    padding: 20,
    paddingBottom: 40,
  },
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: "#6A0DAD",
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
    backgroundColor: "#6A0DAD", // 🔁 ahora morado en vez de naranja
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
    fontSize: 20, // 🔼 antes 18
    marginBottom: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 32, // 🔼 antes 28
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 80,
    marginBottom: 10,
  },
  description: {
    fontSize: 18, // 🔼 antes 16
    color: "#ccc",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "400",
  },
  controlsContainer: {
    marginVertical: 20,
    width: "100%",
    flexDirection: 'row',  // Aseguramos que los botones estén en fila
    justifyContent: 'center',  // Alineamos los botones al centro
    alignItems: 'center',  // Alineamos los elementos verticalmente
  },
  controlItem: {
    flexDirection: 'column',  // Los botones van en columna
    alignItems: 'center',  // Centrado de los botones
    justifyContent: 'center',
    marginHorizontal: 15,  // Espacio horizontal entre botones
  },
  controlButton: {
    backgroundColor: "#444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: 200,  // Aseguramos que los botones tengan un tamaño consistente
  },
  controlButtonActive: {
    backgroundColor: "#FFD700",
  },
  controlText: {
    color: "#fff",
    fontSize: 16,
    textAlign: 'center',  // Alineamos el texto al centro
  },
  jsonBox: {
    backgroundColor: "#2C2F3F",
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
    fontSize: 22, // 🔼 antes 20
    color: "#3EFF15",
  },
  chartTitle: {
    fontSize: 27, // 🔼 antes 25
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
    color: "#FFFFFF",
  },
  chart: {
    borderRadius: 15,
    marginBottom: 30,
    backgroundColor: "#222831",
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
    backgroundGradientFrom: "#222831",
    backgroundGradientTo: "#222831",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(106, 13, 173, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#F97F51",
    },
  },
  dateSelectorButton: {
    backgroundColor: "#6A0DAD",
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
    fontWeight: "600",
    fontSize: 18, // 🔼 nuevo
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 30,
  },
  modalContent: {
    backgroundColor: "#2C2F3F",
    borderRadius: 15,
    padding: 25,
  },
  modalTitle: {
    fontSize: 22, // 🔼 antes 20
    fontWeight: "700",
    marginBottom: 20,
    color: "#fff",
  },
  modalItem: {
    fontSize: 20, // 🔼 antes 18
    paddingVertical: 10,
    color: "#F97F51",
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
    fontWeight: "900",
    color: "#FFFFFF",
    fontSize: 20, // 🔼 nuevo
  },
  dateSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  dateSelectorButton: {
    backgroundColor: '#4a148c',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 4, // espaciado entre botones
    flex: 1, // que todos ocupen el mismo ancho
    alignItems: 'center',
  },  
});
