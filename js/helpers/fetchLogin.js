// helpers/fetchLogin.js
export async function fetchLogin(username, password) {
    //const res = await fetch("http://localhost:9091/auth/login", {
    const res = await fetch("https://resumen-2025-sihce.onrender.com/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
        throw new Error("Usuario o contraseña incorrectos");
    }

    return await res.json(); // { token: "..." }
}