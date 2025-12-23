export function BarraHorizontal(opciones = []) {

    const div = document.createElement("div");
    div.id = "divBarraHorizontal";
    div.style.display = "flex";
    div.style.gap = "10px";

    opciones.forEach(op => {
        const btn = document.createElement("button");
        btn.textContent = op.label;
        btn.dataset.action = op.action;

        //🔥 Clase para estilizar los botones principales
        btn.classList.add("btn-main");

        div.appendChild(btn);
    });

    return div;
}
