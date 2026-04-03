import { getUsername } from "../helpers/auth.js";

export function Titulo(onLogout) {

    const username = getUsername() || "";

    const div = document.createElement("div");
    div.id = "divTitulo";

    div.style.display = "grid";
    div.style.gridTemplateColumns = "auto 1fr auto";
    div.style.alignItems = "center";
    div.style.padding = "15px 20px";
    div.style.borderBottom = "1px solid #ccc";
    div.style.background = "#d9e1df";

    div.innerHTML = `
        <button id="btnHamburguesa"
            style="font-size:20px;background:none;border:none;cursor:pointer;">
            ☰
        </button>

        <h1 id="tituloCentral" style="
            text-align:center;
            margin:0;
            font-size:26px;
        ">
            Sistema de Citas Médicas (SIHCE) - Simulación con Spring Boot
        </h1>

        <div id="userBox" style="
            display:flex;
            flex-direction:column;
            align-items:flex-end;
            gap:4px;
        ">
            <span style="font-size:13px;font-weight:bold;">
                👤 ${username}
            </span>

            <button id="btnLogout" title="Cerrar sesión">
                Salir
            </button>
        </div>
    `;

    const btn = div.querySelector("#btnLogout");

    // 🔧 evita que el CSS viejo lo saque del grid
    btn.style.position = "static";
    btn.style.transform = "none";

    if (typeof onLogout === "function") {
        btn.addEventListener("click", onLogout);
    }

    return div;
}