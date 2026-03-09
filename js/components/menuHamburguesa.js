export function MenuHamburguesa(opciones = []) {

    const modal = document.createElement("div");
    modal.id = "menuModal";

    opciones.forEach(op => {

        const btn = document.createElement("button");

        btn.textContent = op.label;
        btn.dataset.action = op.action;

        modal.appendChild(btn);

    });

    document.body.appendChild(modal);

    return modal;
}