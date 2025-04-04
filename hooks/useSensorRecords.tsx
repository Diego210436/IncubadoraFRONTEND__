import { useEffect, useState } from "react";
import { getSensorRecords } from "../services/api"; // Asegúrate que esta ruta es correcta

export const useSensorRecords = (token: string | null) => {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null); // ✅ Se asegura que `error` sea string

    useEffect(() => {
        if (!token) {
            setError("Token no disponible");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const data = await getSensorRecords(token);
                setRecords(data);
            } catch (err: any) { // ✅ Captura errores correctamente
                setError(err.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    return { records, loading, error };
};
