// ================= IMPORTS =================
import { Titulo } from "./components/div01_titulo.js";
import { BarraHorizontal } from "./components/div02_barraHorizontal.js";
import { crearFormOpciones } from "./components/div03_formOpciones.js";
import { Tabla } from "./components/div04_tabla.js";

import { fetchAtendidos } from "./helpers/fetchAtendidos.js";
import { fetchAtencionesCentro } from "./helpers/fetchAtencionesCentro.js";
import { fetchGraficoAtendidos } from "./helpers/fetchGraficoAtendidos.js";

import { renderAtencionesCentro } from "./helpers/renderAtencionesCentro.js";
import { renderGraficoAtendidos } from "./helpers/renderGraficoAtendidos.js";
import { LoaderCentros } from "./helpers/loader.js";


// ================= ESTADO GLOBAL =================
let modoActual = null;                 // "atendidos" | "atenciones-centro" | "grafico"
let _dataCentrosAtenciones = null;     // cache SOLO para buscar centro


// ================= ELEMENTOS BASE =================
const app = document.getElementById("app");

const div1 = Titulo();

const div2 = BarraHorizontal([
    { label: "Atendidos SIHCE", action: "atendidos" },
    { label: "Buscar Atenciones Centro", action: "atenciones-centro" },
    { label: "Grafico", action: "grafico" }
]);

const div3 = document.createElement("div");
div3.id = "divFormOpcionesCont";

const div4 = document.createElement("div");
div4.id = "divTablaContainer";

app.appendChild(div1);
app.appendChild(div2);
app.appendChild(div3);
app.appendChild(div4);


// =====================================================
// 1) EVENTO BARRA HORIZONTAL
// =====================================================
div2.addEventListener("click", async (e) => {

    const action = e.target.dataset.action;
    if (!action) return;

    modoActual = action;
    div3.innerHTML = "";
    div4.innerHTML = "";

    // ==========================
    // A) ATENDIDOS SIHCE
    // ==========================
    if (action === "atendidos") {
        div3.appendChild(crearFormOpciones({ tipo: "semestre" }));
        return;
    }

    // ==========================
    // B) BUSCAR ATENCIONES CENTRO
    // ==========================
    if (action === "atenciones-centro") {

        div4.innerHTML = LoaderCentros();

        try {
            if (!_dataCentrosAtenciones) {
                _dataCentrosAtenciones = await fetchAtencionesCentro();
            }

            div3.appendChild(
                crearFormOpciones({
                    tipo: "buscar-centro",
                    dataCentros: _dataCentrosAtenciones
                })
            );

            div4.innerHTML = "";
        } catch (err) {
            div4.innerHTML = `<p style="color:red;">${err.message}</p>`;
        }
        return;
    }

    // ==========================
    // C) GRAFICO
    // ==========================
    if (action === "grafico") {
        div3.appendChild(crearFormOpciones({ tipo: "grafico-semestre" }));
        div4.innerHTML = `
            <p style="text-align:center; font-style:italic;">
                Selecciona un rango de meses para ver el gráfico
            </p>
        `;
    }
});


// =====================================================
// 2) EVENTO BOTONES DE SEMESTRE (ATENDIDOS / GRAFICO)
// =====================================================
document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("btn-semestre")) return;

    e.preventDefault();

    const semestre = Number(e.target.dataset.semestre);
    div4.innerHTML = LoaderCentros();

    try {

        // ==========================
        // GRAFICO
        // ==========================
        if (modoActual === "grafico") {
            const dataGrafico = await fetchGraficoAtendidos(semestre);
            renderGraficoAtendidos(div4, dataGrafico);
            return;
        }

        // ==========================
        // ATENDIDOS SIHCE
        // ==========================
        if (modoActual === "atendidos") {
            const data = await fetchAtendidos(semestre);
            div4.innerHTML = "";
            div4.appendChild(Tabla(data));
            return;
        }

    } catch (err) {
        div4.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
});


// =====================================================
// 3) EVENTOS BUSCADOR DE CENTROS (SIN CAMBIOS)
// =====================================================

// Abrir / cerrar popup
div3.addEventListener("click", (e) => {
    if (e.target.id === "btnFiltroCentros") {
        const panel = div3.querySelector("#panelCentros");
        panel.style.display = panel.style.display === "none" ? "block" : "none";
    }
});

// Cerrar popup al hacer clic fuera
document.addEventListener("click", (e) => {
    const panel = div3.querySelector("#panelCentros");
    const btn = div3.querySelector("#btnFiltroCentros");
    if (!panel || !btn) return;

    if (!panel.contains(e.target) && e.target !== btn) {
        panel.style.display = "none";
    }
});

// Filtro de búsqueda
div3.addEventListener("input", (e) => {
    if (e.target.id !== "txtBuscarCentro") return;

    const filtro = e.target.value.toLowerCase();
    div3.querySelectorAll(".item-centro").forEach(item => {
        item.style.display = item.dataset.nombre.toLowerCase().includes(filtro)
            ? ""
            : "none";
    });
});

// Seleccionar todo
div3.addEventListener("change", (e) => {
    if (e.target.id !== "chkSelectAll") return;

    div3.querySelectorAll(".chk-centro")
        .forEach(chk => chk.checked = e.target.checked);
});

// Aceptar selección
div3.addEventListener("click", (e) => {
    if (e.target.id !== "btnAceptarCentros") return;

    const panel = div3.querySelector("#panelCentros");
    if (panel) panel.style.display = "none";

    const seleccionados = Array.from(
        div3.querySelectorAll(".chk-centro:checked")
    ).map(chk => chk.value);

    if (seleccionados.length === 0) {
        div4.innerHTML = `
            <p style="text-align:center; font-style:italic;">
                No hay centros seleccionados.
            </p>
        `;
        return;
    }

    renderAtencionesCentro(div4, _dataCentrosAtenciones, seleccionados);
});

// Cancelar
div3.addEventListener("click", (e) => {
    if (e.target.textContent === "Cancelar") {
        const panel = div3.querySelector("#panelCentros");
        if (panel) panel.style.display = "none";
    }
});
