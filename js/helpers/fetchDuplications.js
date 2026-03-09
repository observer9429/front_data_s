import { getToken } from "./auth.js";

export async function fetchDuplications(mes) {



       const url = `https://resumen-2025-sihce.onrender.com/duplications/mes/${mes}`;
       //const url = `http://localhost:9091/duplications/mes/${mes}`;

    const token = getToken();

    const res = await fetch(
        url,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!res.ok) {
        throw new Error("Error al obtener citas duplicadas");
    }

    return await res.json();
}