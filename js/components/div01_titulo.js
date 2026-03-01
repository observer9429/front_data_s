export function Titulo(onLogout) {
    const div = document.createElement("div");
    div.id = "divTitulo";

    div.innerHTML = `
        <h1>DIRIS LIMA ESTE</h1>
        <button id="btnLogout" title="Cerrar sesión">Salir</button>
    `;

    const btn = div.querySelector("#btnLogout");

    if (typeof onLogout === "function") {
        btn.addEventListener("click", onLogout);
    }

    return div;
}