// js/components/login.js
export function Login() {

    const container = document.createElement("div");
    container.className = "login-container";

    container.innerHTML = `
        <div class="login-card">
            <h2>SIHCE</h2>
            <p class="login-sub">Ingreso al sistema</p>

            <form id="loginForm">
                <input type="text" id="username" placeholder="Usuario" />
                <input type="password" id="password" placeholder="Contraseña" />
                <button type="submit">Ingresar</button>
                <p id="loginError" class="login-error"></p>
            </form>
        </div>
    `;

    return {
        element: container,
        getUsername: () =>
            container.querySelector("#username").value.trim(),

        getPassword: () =>
            container.querySelector("#password").value.trim(),

        setError: (msg) =>
            container.querySelector("#loginError").textContent = msg,

        onSubmit: (handler) =>
            container.querySelector("#loginForm")
                     .addEventListener("submit", handler)
    };
}