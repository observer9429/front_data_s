// helpers/fetchAtendidos.js
export async function fetchAtendidos(semestre) {

    const url = `https://resumen-2025-sihce.onrender.com/api/atendidos/2025/resumen/semestre/${semestre}`;
    //const url = `http://localhost:9091/api/atendidos/2025/resumen/semestre/${semestre}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener datos del backend");

    return await res.json();
}
