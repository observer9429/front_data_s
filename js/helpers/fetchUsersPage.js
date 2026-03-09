import { getToken } from "./auth.js";

export async function fetchUsersPage(page = 0, size = 10) {

    const url = `https://resumen-2025-sihce.onrender.com/users/page?page=${page}&size=${size}`;
    //const url = `http://localhost:9091/users/page?page=${page}&size=${size}`;

    const res = await fetch(
        url,
        {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        }
    );

    if (!res.ok) {
        throw new Error("No se pudo obtener la lista de usuarios");
    }

    return await res.json(); // Page<UserResponseDto>
}