// helpers/auth.js
export function getToken() {
    return localStorage.getItem("token");
}

export function setToken(token) {
    localStorage.setItem("token", token);
}

export function clearToken() {
    localStorage.removeItem("token");
}

export function isAuthenticated() {
    return !!getToken();
}

export function getRoles() {
    return JSON.parse(localStorage.getItem("roles") || "[]");
}

export function setRoles(roles) {
    localStorage.setItem("roles", JSON.stringify(roles));
}

export function clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
}

export function getUsername() {
    return localStorage.getItem("username");
}