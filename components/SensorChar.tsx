import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, View, Text, StyleSheet } from "react-native";

interface SensorChartProps {
    data: number[];
    labels: string[];
}

const SensorChart: React.FC<SensorChartProps> = ({ data, labels }) => {
    return (
        <View>
            <Text style={styles.title}>📊 Actividad de Sensores</Text>
            <LineChart
                data={{ labels: labels, datasets: [{ data: data }] }}
                width={Dimensions.get("window").width * 0.9}
                height={220}
                chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" }
                }}
                bezier
                style={styles.chart}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});

export default SensorChart;
