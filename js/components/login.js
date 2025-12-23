export function Login(onLoginSuccess) {

    const div = document.createElement("div");
    div.id = "loginContainer";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.maxWidth = "330px";
    div.style.margin = "80px auto";
    div.style.padding = "20px";
    div.style.border = "1px solid #ccc";
    div.style.borderRadius = "8px";
    div.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
    div.style.background = "white";

    div.innerHTML = `
        <h2 style="text-align:center; margin-bottom:20px;">Inicio de Sesión</h2>

        <label>Usuario</label>
        <input id="loginUser" type="text" class="login-input">

        <label>Contraseña</label>
        <input id="loginPass" type="password" class="login-input">

        <button id="btnLogin" class="btn-login">Ingresar</button>

        <p id="loginError" style="color:red; margin-top:10px; text-align:center; display:none;">
            Usuario o contraseña incorrectos
        </p>
    `;

    // estilos mínimos
    const css = document.createElement("style");
    css.textContent = `
        .login-input {
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            margin-bottom: 15px;
            border: 1px solid #bbb;
            border-radius: 5px;
        }

        .btn-login {
            width: 100%;
            padding: 10px;
            background: #1565c0;
            border: none;
            color: white;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
        }

        .btn-login:hover {
            background: #0d47a1;
        }
    `;
    div.appendChild(css);

    // Acción del botón
    div.querySelector("#btnLogin").addEventListener("click", async () => {

        const user = div.querySelector("#loginUser").value.trim();
        const pass = div.querySelector("#loginPass").value.trim();

        if (!user || !pass) {
            alert("Ingresa usuario y contraseña");
            return;
        }

        try {
            const res = await fetch("http://localhost:9091/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario: user, clave: pass })
            });

            if (!res.ok) {
                div.querySelector("#loginError").style.display = "block";
                return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);

            onLoginSuccess(); // ← avisamos al sistema que ya inició sesión

        } catch (err) {
            console.error(err);
            alert("Error de conexión");
        }

    });

    return div;
}
