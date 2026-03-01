// ================= IMPORTS =================
import { Login } from "./components/login.js";

import { Titulo } from "./components/div01_titulo.js";
import { BarraHorizontal } from "./components/div02_barraHorizontal.js";
import { crearFormOpciones } from "./components/div03_formOpciones.js";
import { Tabla } from "./components/div04_tabla.js";

import { fetchLogin } from "./helpers/fetchLogin.js";
import { fetchAtendidos } from "./helpers/fetchAtendidos.js";
import { fetchAtencionesCentro } from "./helpers/fetchAtencionesCentro.js";
import { fetchGraficoAtendidos } from "./helpers/fetchGraficoAtendidos.js";

import { renderAtencionesCentro } from "./helpers/renderAtencionesCentro.js";
import { renderGraficoAtendidos } from "./helpers/renderGraficoAtendidos.js";
import { LoaderCentros } from "./helpers/loader.js";

import { setToken, getToken, clearToken } from "./helpers/auth.js";


// ================= ESTADO GLOBAL =================
let modoActual = null;
let _dataCentrosAtenciones = null;


// ================= APP ROOT =================
const app = document.getElementById("app");


// =====================================================
// SISTEMA PRINCIPAL
// =====================================================
function renderSistema() {

    app.innerHTML = "";

    // 🔴 TÍTULO + LOGOUT (AQUÍ ESTABA EL PROBLEMA)
    const div1 = Titulo(() => {
        clearToken();   // 🔥 mata el JWT
        startApp();     // 🔥 vuelve al login
    });

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
    // EVENTO BARRA HORIZONTAL
    // =====================================================
    div2.addEventListener("click", async (e) => {

        const action = e.target.dataset.action;
        if (!action) return;

        modoActual = action;
        div3.innerHTML = "";
        div4.innerHTML = "";

        if (action === "atendidos") {
            div3.appendChild(crearFormOpciones({ tipo: "semestre" }));
            return;
        }

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
    // BOTONES SEMESTRE
    // =====================================================
    document.addEventListener("click", async (e) => {

        if (!e.target.classList.contains("btn-semestre")) return;

        e.preventDefault();

        const semestre = Number(e.target.dataset.semestre);
        div4.innerHTML = LoaderCentros();

        try {

            if (modoActual === "grafico") {
                const dataGrafico = await fetchGraficoAtendidos(semestre);
                renderGraficoAtendidos(div4, dataGrafico);
                return;
            }

            if (modoActual === "atendidos") {
                const data = await fetchAtendidos(semestre);
                div4.innerHTML = "";
                div4.appendChild(Tabla(data));
            }

        } catch (err) {
            div4.innerHTML = `<p style="color:red;">${err.message}</p>`;
        }
    });

    // =====================================================
    // BUSCADOR DE CENTROS
    // =====================================================
    div3.addEventListener("click", (e) => {
        if (e.target.id === "btnFiltroCentros") {
            const panel = div3.querySelector("#panelCentros");
            panel.style.display = panel.style.display === "none" ? "block" : "none";
        }
    });

    document.addEventListener("click", (e) => {
        const panel = div3.querySelector("#panelCentros");
        const btn = div3.querySelector("#btnFiltroCentros");
        if (!panel || !btn) return;

        if (!panel.contains(e.target) && e.target !== btn) {
            panel.style.display = "none";
        }
    });

    div3.addEventListener("input", (e) => {
        if (e.target.id !== "txtBuscarCentro") return;

        const filtro = e.target.value.toLowerCase();
        div3.querySelectorAll(".item-centro").forEach(item => {
            item.style.display = item.dataset.nombre.toLowerCase().includes(filtro)
                ? ""
                : "none";
        });
    });

    div3.addEventListener("change", (e) => {
        if (e.target.id !== "chkSelectAll") return;

        div3.querySelectorAll(".chk-centro")
            .forEach(chk => chk.checked = e.target.checked);
    });

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
}


// =====================================================
// LOGIN
// =====================================================
function renderLogin() {

    app.innerHTML = "";

    const login = Login();
    app.appendChild(login.element);

    login.onSubmit(async (e) => {
        e.preventDefault();
        login.setError("");

        const username = login.getUsername();
        const password = login.getPassword();

        if (!username || !password) {
            login.setError("Usuario y contraseña obligatorios");
            return;
        }

        try {
            const data = await fetchLogin(username, password);
            setToken(data.token);
            startApp(); // 🔥 entra al sistema
        } catch (err) {
            login.setError(err.message);
        }
    });
}


// =====================================================
// ARRANQUE GENERAL
// =====================================================
function startApp() {
    const token = getToken();

    if (!token) {
        renderLogin();
    } else {
        renderSistema();
    }
}

startApp();