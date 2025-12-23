// components/div03_formOpciones.js

export function crearFormOpciones(config) {
    const div = document.createElement("div");
    div.id = "divFormOpciones";

    switch (config.tipo) {

        // =================================================
        // ATENDIDOS SIHCE (SE MANTIENE IGUAL)
        // =================================================
        case "semestre": {
            const opciones = [
                {
                    label: "Primer Semestre (Enero - Junio)",
                    semestre: 1
                },
                {
                    label: "Segundo Semestre (Julio - Diciembre)",
                    semestre: 2
                }
            ];

            opciones.forEach(op => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = op.label;
                btn.classList.add("btn-semestre");
                btn.dataset.semestre = op.semestre;
                div.appendChild(btn);
            });
            break;
        }

        // =================================================
        // 🔥 GRAFICO (NUEVO CASE, NO REUTILIZA EL ANTERIOR)
        // =================================================
        case "grafico-semestre": {
            const opciones = [
                {
                    label: "Enero - Junio",
                    semestre: 1
                },
                {
                    label: "Julio - Diciembre",
                    semestre: 2
                }
            ];

            opciones.forEach(op => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = op.label;
                btn.classList.add("btn-semestre"); // reutilizamos clase visual
                btn.dataset.semestre = op.semestre;
                btn.dataset.grafico = "true";      // 🔥 marca explícita
                div.appendChild(btn);
            });
            break;
        }

        // =================================================
        // BUSCAR CENTRO (SIN CAMBIOS)
        // =================================================
        case "buscar-centro": {

            const dataCentros = config.dataCentros;

            const btnFiltro = document.createElement("button");
            btnFiltro.id = "btnFiltroCentros";
            btnFiltro.textContent = "Elegir establecimientos...";
            btnFiltro.classList.add("btn-main");
            btnFiltro.style.background = "#4caf50";
            btnFiltro.style.marginRight = "10px";
            div.appendChild(btnFiltro);

            const panel = document.createElement("div");
            panel.id = "panelCentros";
            panel.style.position = "absolute";
            panel.style.zIndex = "9999";
            panel.style.background = "white";
            panel.style.border = "1px solid #ccc";
            panel.style.padding = "10px";
            panel.style.width = "280px";
            panel.style.display = "none";
            panel.style.boxShadow = "0 0 8px rgba(0,0,0,0.2)";
            panel.style.borderRadius = "6px";

            const input = document.createElement("input");
            input.type = "text";
            input.id = "txtBuscarCentro";
            input.placeholder = "Buscar...";
            input.style.width = "100%";
            input.style.marginBottom = "8px";
            panel.appendChild(input);

            const chkAll = document.createElement("input");
            chkAll.type = "checkbox";
            chkAll.id = "chkSelectAll";

            const lblAll = document.createElement("label");
            lblAll.textContent = " Seleccionar todo";

            const divAll = document.createElement("div");
            divAll.appendChild(chkAll);
            divAll.appendChild(lblAll);
            panel.appendChild(divAll);

            const lista = document.createElement("div");
            lista.id = "listaCentros";
            lista.style.maxHeight = "200px";
            lista.style.overflowY = "auto";
            lista.style.border = "1px solid #ddd";
            lista.style.marginTop = "8px";

            Object.keys(dataCentros).forEach(nombreCentro => {
                const item = document.createElement("div");
                item.classList.add("item-centro");
                item.dataset.nombre = nombreCentro;

                item.style.display = "flex";
                item.style.alignItems = "center";
                item.style.cursor = "pointer";
                item.style.gap = "6px";
                item.style.padding = "4px 2px";

                const chk = document.createElement("input");
                chk.type = "checkbox";
                chk.classList.add("chk-centro");
                chk.value = nombreCentro;

                const label = document.createElement("span");
                label.textContent = nombreCentro;

                item.appendChild(chk);
                item.appendChild(label);
                lista.appendChild(item);

                item.addEventListener("click", (e) => {
                    if (e.target.tagName === "INPUT") return;
                    chk.checked = !chk.checked;
                });
            });

            panel.appendChild(lista);

            const btns = document.createElement("div");
            btns.style.marginTop = "10px";
            btns.style.textAlign = "right";

            const btnCancelar = document.createElement("button");
            btnCancelar.textContent = "Cancelar";
            btnCancelar.style.marginRight = "10px";

            const btnAceptar = document.createElement("button");
            btnAceptar.id = "btnAceptarCentros";
            btnAceptar.textContent = "Aceptar";

            btns.appendChild(btnCancelar);
            btns.appendChild(btnAceptar);
            panel.appendChild(btns);

            div.appendChild(panel);
            break;
        }
    }

    return div;
}
