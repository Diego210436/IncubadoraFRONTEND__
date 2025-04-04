const API_URL = "http://localhost:3001/sensoresyactuadores";

export const getSensorRecords = async (token: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();

    // Verifica si la respuesta tiene la estructura esperada
    if (responseData && Array.isArray(responseData.sensores)) {
      return responseData.sensores;
    } else {
      console.error("Respuesta de la API no tiene el formato esperado:", responseData);
      throw new Error("Respuesta de la API no tiene el formato esperado");
    }
  } catch (error) {
    console.error("Error obteniendo los datos:", error);
    throw error;
  }
};