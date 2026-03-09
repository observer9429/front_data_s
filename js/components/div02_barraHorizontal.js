export function BarraHorizontal(opciones = []) {

    const div = document.createElement("div");
    div.id = "divBarraHorizontal";

    div.style.display = "flex";
    div.style.gap = "10px";

    // 🔧 FIX RESPONSIVE
    div.style.flexWrap = "wrap";
    div.style.width = "100%";

    opciones.forEach(op => {
        const btn = document.createElement("button");
        btn.textContent = op.label;
        btn.dataset.action = op.action;

        btn.classList.add("btn-main");

        div.appendChild(btn);
    });

    return div;
}