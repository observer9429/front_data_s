// ================= IMPORTS =================
import { Login } from "./components/login.js";

import { Titulo } from "./components/div01_titulo.js";
import { BarraHorizontal } from "./components/div02_barraHorizontal.js";
import { crearFormOpciones } from "./components/div03_formOpciones.js";
import { Tabla } from "./components/div04_tabla.js";
import { TablaUsuarios } from "./components/div04_tablaUsuarios.js";
import { UserForm } from "./components/div05_userForm.js";

import { fetchLogin } from "./helpers/fetchLogin.js";
import { fetchAtendidos } from "./helpers/fetchAtendidos.js";
import { fetchAtencionesCentro } from "./helpers/fetchAtencionesCentro.js";
import { fetchGraficoAtendidos } from "./helpers/fetchGraficoAtendidos.js";
import { fetchUsersPage } from "./helpers/fetchUsersPage.js";

import { renderAtencionesCentro } from "./helpers/renderAtencionesCentro.js";
import { renderGraficoAtendidos } from "./helpers/renderGraficoAtendidos.js";
import { LoaderCentros } from "./helpers/loader.js";

import { setToken, getToken, clearToken } from "./helpers/auth.js";
import { fetchWithAuth } from "./helpers/fetchWithAuth.js";

import { fetchDuplications } from "./helpers/fetchDuplications.js";
import { TablaDuplicaciones } from "./components/div04_tablaDuplicaciones.js";
import { FiltroDuplicados } from "./components/div03_filtroDuplicados.js";


// ================= OPCIONES MENU =================
const menuOpciones = [
    { label: "Atendidos SIHCE", action: "atendidos", roles:["ROLE_USER","ROLE_ADMIN","ROLE_MASTER"] },
    { label: "Buscar Atenciones Centro", action: "atenciones-centro", roles:["ROLE_USER","ROLE_ADMIN","ROLE_MASTER"] },
    { label: "Grafico", action: "grafico", roles:["ROLE_USER","ROLE_ADMIN","ROLE_MASTER"] },
    { label: "Citas Falsas", action: "citas-falsas", roles:["ROLE_ADMIN","ROLE_MASTER"] },
    { label: "User Management", action: "user-management", roles:["ROLE_MASTER"] }
];


// ================= ESTADO GLOBAL =================
let modoActual = null;
let _dataCentrosAtenciones = null;

let currentUsers = [];

let currentPage = 0;
let pageSize = 10;

let div3 = null;
let div4 = null;


// ================= APP ROOT =================
const app = document.getElementById("app");


// =====================================================
// SISTEMA PRINCIPAL
// =====================================================
function renderSistema() {

    app.innerHTML = "";

    const div1 = Titulo(() => {
        clearToken();
        startApp();
    });

    const roles = JSON.parse(localStorage.getItem("roles") || "[]");

    const menuFiltrado = menuOpciones.filter(op =>
        op.roles.some(r => roles.includes(r))
    );

    const div2 = BarraHorizontal(menuFiltrado);

    div3 = document.createElement("div");
    div3.id = "divFormOpcionesCont";

    div4 = document.createElement("div");
    div4.id = "divTablaContainer";

    app.append(div1, div2, div3, div4);


    // ================= MENU HAMBURGUESA =================

    const oldMenu = document.getElementById("menuModal");
    if (oldMenu) oldMenu.remove();

    const menuModal = document.createElement("div");
    menuModal.id = "menuModal";

    const menuTitulo = document.createElement("div");
    menuTitulo.id = "menuTitulo";
    menuTitulo.textContent = "Reportes";

    const menuContenido = document.createElement("div");
    menuContenido.id = "menuContenido";

    menuFiltrado.forEach(op => {

        const btn = document.createElement("button");
        btn.textContent = op.label;
        btn.dataset.action = op.action;
        btn.classList.add("btn-main");

        menuContenido.appendChild(btn);

    });

    menuModal.appendChild(menuTitulo);
    menuModal.appendChild(menuContenido);

    document.body.appendChild(menuModal);


    document.getElementById("btnHamburguesa").onclick = () => {

        menuModal.style.display = "flex";
        document.body.style.overflow = "hidden";

    };


    // 🔥 FIX IMPORTANTE
    menuModal.addEventListener("click", (e) => {

        const btn = e.target.closest("button");
        if (!btn) return;

        const action = btn.dataset.action;

        menuModal.style.display = "none";
        document.body.style.overflow = "auto";

        manejarAccionMenu({
            target: { dataset: { action } }
        });

    });


    div2.addEventListener("click", manejarAccionMenu);



    // =====================================================
    // EVENTOS LOCALES CENTROS
    // =====================================================

    div3.addEventListener("click", (e) => {

        if (modoActual !== "atenciones-centro") return;

        if (e.target.id === "btnFiltroCentros") {

            const panel = div3.querySelector("#panelCentros");

            if (panel) {
                panel.style.display =
                    panel.style.display === "none"
                        ? "block"
                        : "none";
            }
        }

        if (e.target.id === "btnAceptarCentros") {

            const panel = div3.querySelector("#panelCentros");

            if (panel) panel.style.display = "none";

            const seleccionados = Array.from(
                div3.querySelectorAll(".chk-centro:checked")
            ).map(chk => chk.value);

            // 🔴 SI NO HAY CENTROS → LIMPIAR TABLA
            if (seleccionados.length === 0) {

                div4.innerHTML = `
                    <p style="text-align:center;font-style:italic;">
                        No hay centros seleccionados.
                    </p>
                `;

                return;
            }

            renderAtencionesCentro(
                div4,
                _dataCentrosAtenciones,
                seleccionados
            );
        }

    });


    div3.addEventListener("input", (e) => {

        if (modoActual !== "atenciones-centro") return;
        if (e.target.id !== "txtBuscarCentro") return;

        const filtro = e.target.value.toLowerCase();

        div3.querySelectorAll(".item-centro")
            .forEach(item => {

                item.style.display =
                    item.dataset.nombre
                        .toLowerCase()
                        .includes(filtro)
                            ? ""
                            : "none";
            });

    });


    div3.addEventListener("change", (e) => {

        if (modoActual !== "atenciones-centro") return;
        if (e.target.id !== "chkSelectAll") return;

        div3.querySelectorAll(".chk-centro")
            .forEach(chk => chk.checked = e.target.checked);

    });
}


// =====================================================
// MANEJO CENTRAL DEL MENÚ
// =====================================================
async function manejarAccionMenu(e) {

    const action = e.target?.dataset?.action;
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
        return;
    }


    if (action === "grafico") {

        div3.appendChild(
            crearFormOpciones({ tipo: "grafico-semestre" })
        );

        div4.innerHTML =
            `<p style="text-align:center;">Seleccione un semestre</p>`;

        return;
    }


    if (action === "citas-falsas") {

        div3.appendChild(FiltroDuplicados());
        return;
    }


    if (action === "user-management") {

        currentPage = 0;

        div3.appendChild(
            crearFormOpciones({ tipo: "user-management" })
        );

        div4.innerHTML = LoaderCentros();

        const pageData =
            await fetchUsersPage(currentPage, pageSize);

        currentUsers = pageData.content;

        div4.innerHTML = "";
        div4.appendChild(TablaUsuarios(pageData));
    }

}


// =====================================================
// EVENTOS GLOBALES
// =====================================================
document.addEventListener("click", async (e) => {

    // ================= SEMESTRES =================
    if (e.target.classList.contains("btn-semestre")) {

        const semestre = Number(e.target.dataset.semestre);

        div4.innerHTML = LoaderCentros();

        if (modoActual === "grafico") {

            const dataGrafico =
                await fetchGraficoAtendidos(semestre);

            renderGraficoAtendidos(div4, dataGrafico);
        }

        if (modoActual === "atendidos") {

            const data =
                await fetchAtendidos(semestre);

            div4.innerHTML = "";
            div4.appendChild(Tabla(data));
        }

        return;
    }

    // ================= EDITAR USUARIO =================
    const btnEdit = e.target.closest("[data-edit]");

    if (modoActual === "user-management" && btnEdit) {

        const id = btnEdit.dataset.edit;

        const user =
            currentUsers.find(u => u.id == id);

        if (!user) return;

        div4.innerHTML = "";

        div4.appendChild(
            UserForm(
                user,

                async (data) => {

                    await fetchWithAuth(
                        `http://localhost:9091/users/${id}`,
                        {
                            method: "PUT",
                            body: JSON.stringify(data)
                        }
                    );

                    const pageData =
                        await fetchUsersPage(currentPage, pageSize);

                    currentUsers = pageData.content;

                    div4.innerHTML = "";
                    div4.appendChild(TablaUsuarios(pageData));
                },

                async () => {

                    const pageData =
                        await fetchUsersPage(currentPage, pageSize);

                    currentUsers = pageData.content;

                    div4.innerHTML = "";
                    div4.appendChild(TablaUsuarios(pageData));
                }
            )
        );

        return;
    }

    // ================= ELIMINAR USUARIO =================
    const btnDelete = e.target.closest("[data-delete]");

    if (modoActual === "user-management" && btnDelete) {

        const id = btnDelete.dataset.delete;

        if (!confirm("¿Eliminar usuario?")) return;

        await fetchWithAuth(
            `http://localhost:9091/users/${id}`,
            { method: "DELETE" }
        );

        const pageData =
            await fetchUsersPage(currentPage, pageSize);

        currentUsers = pageData.content;

        div4.innerHTML = "";
        div4.appendChild(TablaUsuarios(pageData));

        return;
    }

    // ================= RESET USUARIOS =================
    const btnReset = e.target.closest('[data-action="reset-usuarios"]');

    if (modoActual === "user-management" && btnReset) {

        currentPage = 0;

        div4.innerHTML = LoaderCentros();

        const pageData =
            await fetchUsersPage(currentPage, pageSize);

        currentUsers = pageData.content;

        div4.innerHTML = "";
        div4.appendChild(TablaUsuarios(pageData));

        document.getElementById("userSearchValue").value = "";

        return;
    }

    // ================= BUSCAR USUARIOS =================
    const btnBuscarUsers = e.target.closest('[data-action="buscar-usuarios"]');

    if (modoActual === "user-management" && btnBuscarUsers) {

        const tipo =
            document.getElementById("userSearchType").value;

        const valor =
            document.getElementById("userSearchValue").value.trim();

        if (!valor) {
            alert("Ingrese un valor para buscar");
            return;
        }

        div4.innerHTML = LoaderCentros();

        const params = new URLSearchParams();
        params.append(tipo, valor);

        const data = await fetchWithAuth(
            `http://localhost:9091/users/search?${params.toString()}`
        );

        currentUsers = data;

        const fakePage = {
            content: data,
            number: 0,
            totalPages: 1
        };

        div4.innerHTML = "";
        div4.appendChild(TablaUsuarios(fakePage));

        return;
    }


    // ================= PAGINACION USERS =================
    const btnPage = e.target.closest("[data-page]");

    if (modoActual === "user-management" && btnPage) {

        const dir = btnPage.dataset.page;

        if (dir === "next") currentPage++;
        if (dir === "prev" && currentPage > 0) currentPage--;

        div4.innerHTML = LoaderCentros();

        const pageData =
            await fetchUsersPage(currentPage, pageSize);

        currentUsers = pageData.content;

        div4.innerHTML = "";
        div4.appendChild(TablaUsuarios(pageData));

        return;
    }


    // ================= DUPLICADOS =================
    if (e.target.id === "btnBuscarDuplicados") {

        const mes = document.getElementById("mesDuplicados").value;

        div4.innerHTML = LoaderCentros();

        const data = await fetchDuplications(mes);

        div4.innerHTML = "";
        div4.appendChild(
            TablaDuplicaciones(data)
        );

        return;
    }

});

// =====================================================
// LOGIN
// =====================================================
function renderLogin() {

    app.innerHTML = "";

    const login = Login();

    app.appendChild(login.element);

    login.onSubmit(async (e) => {

        e.preventDefault();

        const username = login.getUsername();
        const password = login.getPassword();

        const data = await fetchLogin(username, password);

        setToken(data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("roles", JSON.stringify(data.roles));

        startApp();

    });
}


// =====================================================
// ARRANQUE
// =====================================================
function startApp() {

    const token = getToken();

    token
        ? renderSistema()
        : renderLogin();
}

startApp();