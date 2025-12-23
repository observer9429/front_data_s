// helpers/fetchGraficoAtendidos.js
export async function fetchGraficoAtendidos(semestre) {

    // semestre = 1 o 2 (INT)
    //const url = `http://localhost:9091/api/grafico/semestre/${semestre}`;

    const url = `https://resumen-2025-sihce.onrender.com/api/grafico/semestre/${semestre}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Error al obtener datos del gráfico");
    }

    return await res.json();
}
