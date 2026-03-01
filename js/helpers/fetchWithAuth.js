// js/helpers/fetchWithAuth.js
export async function fetchWithAuth(url, options = {}) {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No autenticado");
    }

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        "Authorization": `Bearer ${token}`
    };

    const res = await fetch(url, {
        ...options,
        headers
    });

    // Token inválido o vencido
    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
    }

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error en la solicitud");
    }

    // Si no hay body (204)
    if (res.status === 204) return null;

    return await res.json();
}