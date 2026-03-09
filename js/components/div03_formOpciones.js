// components/div03_formOpciones.js

export function crearFormOpciones(config) {
    const div = document.createElement("div");
    div.id = "divFormOpciones";

    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.gap = "10px";
    div.style.width = "100%";

    switch (config.tipo) {

        case "semestre": {
            const opciones = [
                { label: "Primer Semestre (Enero - Junio)", semestre: 1 },
                { label: "Segundo Semestre (Julio - Diciembre)", semestre: 2 }
            ];

            opciones.forEach(op => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = op.label;
                btn.classList.add("btn-semestre");
                btn.style.width = "100%";
                btn.dataset.semestre = op.semestre;
                div.appendChild(btn);
            });
            break;
        }

        case "grafico-semestre": {
            const opciones = [
                { label: "Enero - Junio", semestre: 1 },
                { label: "Julio - Diciembre", semestre: 2 }
            ];

            opciones.forEach(op => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = op.label;
                btn.classList.add("btn-semestre");
                btn.dataset.semestre = op.semestre;
                btn.dataset.grafico = "true";
                div.appendChild(btn);
            });
            break;
        }

        case "buscar-centro": {

            const dataCentros = config.dataCentros || {};

            const btnFiltro = document.createElement("button");
            btnFiltro.id = "btnFiltroCentros";
            btnFiltro.textContent = "Elegir establecimientos...";
            btnFiltro.classList.add("btn-main");

            div.appendChild(btnFiltro);

            const panel = document.createElement("div");
            panel.id = "panelCentros";

            panel.style.display = "none";
            panel.style.position = "absolute";
            panel.style.background = "white";
            panel.style.border = "1px solid #ccc";
            panel.style.padding = "10px";
            panel.style.width = "280px";
            panel.style.zIndex = "9999";
            panel.style.borderRadius = "6px";
            panel.style.boxShadow = "0 0 8px rgba(0,0,0,0.2)";

            const buscador = document.createElement("input");
            buscador.type = "text";
            buscador.id = "txtBuscarCentro";
            buscador.placeholder = "Buscar...";
            buscador.style.width = "100%";
            buscador.style.marginBottom = "8px";

            panel.appendChild(buscador);

            // CONTENEDOR SCROLL
            const lista = document.createElement("div");
            lista.style.maxHeight = "200px";
            lista.style.overflowY = "auto";
            lista.style.border = "1px solid #ddd";
            lista.style.padding = "5px";

            Object.keys(dataCentros).forEach(nombre => {

                const label = document.createElement("label");
                label.classList.add("item-centro");
                label.dataset.nombre = nombre;

                label.style.display = "flex";
                label.style.alignItems = "center";
                label.style.gap = "6px";

                const chk = document.createElement("input");
                chk.type = "checkbox";
                chk.classList.add("chk-centro");
                chk.value = nombre;

                label.appendChild(chk);
                label.appendChild(document.createTextNode(nombre));

                lista.appendChild(label);
            });

            panel.appendChild(lista);

            // BOTONES
            const botones = document.createElement("div");
            botones.style.marginTop = "10px";
            botones.style.display = "flex";
            botones.style.justifyContent = "space-between";

            const btnCancelar = document.createElement("button");
            btnCancelar.textContent = "Cancelar";

            btnCancelar.onclick = () => {
                panel.style.display = "none";
            };

            const btnAceptar = document.createElement("button");
            btnAceptar.id = "btnAceptarCentros";
            btnAceptar.textContent = "Aceptar";
            btnAceptar.classList.add("btn-main");

            botones.appendChild(btnCancelar);
            botones.appendChild(btnAceptar);

            panel.appendChild(botones);

            div.appendChild(panel);

            break;
        }

        case "user-management": {

            const container = document.createElement("div");
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.alignItems = "center";
            container.style.gap = "10px";

            // SELECT
            const select = document.createElement("select");
            select.id = "userSearchType";

            [
                { value: "username", label: "Username" },
                { value: "email", label: "Correo" },
                { value: "role", label: "Rol" },
                { value: "id", label: "ID" }
            ].forEach(op => {
                const opt = document.createElement("option");
                opt.value = op.value;
                opt.textContent = op.label;
                select.appendChild(opt);
            });

            // CONTENEDOR INPUT
            const inputWrapper = document.createElement("div");
            inputWrapper.style.position = "relative";

            const input = document.createElement("input");
            input.type = "text";
            input.id = "userSearchValue";
            input.placeholder = "Ingrese valor...";
            input.style.padding = "8px";
            input.style.width = "260px";

            // BOTON LIMPIAR
            const clearBtn = document.createElement("button");
            clearBtn.textContent = "✖";
            clearBtn.type = "button";

            clearBtn.style.position = "absolute";
            clearBtn.style.right = "5px";
            clearBtn.style.top = "50%";
            clearBtn.style.transform = "translateY(-50%)";
            clearBtn.style.border = "none";
            clearBtn.style.background = "transparent";
            clearBtn.style.cursor = "pointer";

            clearBtn.onclick = () => {
                input.value = "";
                input.focus();
            };

            inputWrapper.appendChild(input);
            inputWrapper.appendChild(clearBtn);

            // BOTON BUSCAR
            const btnBuscar = document.createElement("button");
            btnBuscar.textContent = "Buscar";
            btnBuscar.classList.add("btn-main");
            btnBuscar.dataset.action = "buscar-usuarios";

            // BOTON RESET
            const btnReset = document.createElement("button");
            btnReset.textContent = "Reset";
            btnReset.classList.add("btn-main");
            btnReset.dataset.action = "reset-usuarios";

            container.append(select, inputWrapper, btnBuscar, btnReset);

            div.appendChild(container);

            break;
        }
    }

    return div;
}