// helpers/fetchAtendidos.js
/*
export async function fetchAtendidos(semestre) {

    //const url = `https://resumen-2025-sihce.onrender.com/api/atendidos/2025/resumen/semestre/${semestre}`;
    const url = `http://localhost:9091/api/atendidos/2025/resumen/semestre/${semestre}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener datos del backend");

    return await res.json();
}*/

import { getToken } from "./auth.js";

export async function fetchAtendidos(semestre) {
    const token = getToken();

    const res = await fetch(
        `http://localhost:9091/api/atendidos/2025/resumen/semestre/${semestre}`,
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
        throw new Error("Error al obtener atendidos");
    }

    return await res.json();
}