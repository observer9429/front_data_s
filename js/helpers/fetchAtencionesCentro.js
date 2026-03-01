// helpers/fetchAtencionesCentro.js
/*
export async function fetchAtencionesCentro() {
    // 🔴 AJUSTA ESTA URL A TU ENDPOINT REAL
    //const url = "https://resumen-2025-sihce.onrender.com/api/resumen2025/anual";
    const url = "http://localhost:9091/api/resumen2025/anual";

    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener atenciones por centro");
    return await res.json();
}*/

import { getToken } from "./auth.js";

export async function fetchAtencionesCentro() {
    const token = getToken();

    const res = await fetch(
        "http://localhost:9091/api/resumen2025/anual",
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (res.status === 401 || res.status === 403) {
        throw new Error("No autorizado");
    }

    if (!res.ok) {
        throw new Error("Error al obtener atenciones por centro");
    }

    return await res.json();
}
