// helpers/fetchGraficoAtendidos.js
/*
export async function fetchGraficoAtendidos(semestre) {

    // semestre = 1 o 2 (INT)
    const url = `http://localhost:9091/api/grafico/semestre/${semestre}`;

    //const url = `https://resumen-2025-sihce.onrender.com/api/grafico/semestre/${semestre}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Error al obtener datos del gráfico");
    }

    return await res.json();
}
*/

import { getToken } from "./auth.js";

export async function fetchGraficoAtendidos(semestre) {
    const token = getToken();

    //const url = `http://localhost:9091/api/grafico/semestre/${semestre}`;

    const url = `https://resumen-2025-sihce.onrender.com/api/grafico/semestre/${semestre}`;

    const res = await fetch(
        url,
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
        throw new Error("Error al obtener gráfico");
    }

    return await res.json();
}
