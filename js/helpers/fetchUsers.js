// helpers/fetchUsers.js
import { getToken } from "./auth.js";

export async function fetchUsers({ page = 0, size = 10 } = {}) {

    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);

    //const url = `http://localhost:9091/users?${params.toString()}`;
    const url = `https://resumen-2025-sihce.onrender.com/users?${params.toString()}`;

    const res = await fetch(
        url,
        {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        }
    );

    if (!res.ok) {
        throw new Error("Error al obtener usuarios");
    }

    return await res.json(); // Page<UserResponseDto>
}