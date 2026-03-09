export function UserForm(user = null, onSave, onCancel) {

    const isEdit = user !== null;

    const ALL_ROLES = [
        "ROLE_USER",
        "ROLE_ADMIN",
        "ROLE_MASTER"
    ];

    let currentRoles = isEdit ? [...user.roles] : [];

    const div = document.createElement("div");

    div.innerHTML = `
        <div style="
            max-width:600px;
            margin:20px auto;
            padding:20px;
            border:1px solid #ccc;
            border-radius:8px;
            background:#fafafa;
        ">

        <h3>${isEdit ? "Editar Usuario" : "Crear Usuario"}</h3>

        ${isEdit ? `
        <label>ID</label>
        <input value="${user.id}" disabled style="width:100%;margin-bottom:10px"/>
        ` : ""}

        <label>Username</label>
        <input id="editUsername"
            value="${isEdit ? user.username : ""}"
            style="width:100%;margin-bottom:10px"/>

        <label>Password ${isEdit ? "(opcional)" : ""}</label>
        <input id="editPassword" type="password"
            style="width:100%;margin-bottom:10px"/>

        <label>Email</label>
        <input id="editEmail"
            value="${isEdit ? user.email : ""}"
            style="width:100%;margin-bottom:15px"/>

        <label>ROLES:</label>

        <div id="rolesList" style="margin-bottom:10px"></div>

        <div style="margin-bottom:15px">
            <button id="btnAddRole">Añadir</button>
            <button id="btnRemoveRole">Quitar</button>
        </div>

        <div>

            <button id="btnGuardar" class="btn-main">
                Guardar
            </button>

            <button id="btnCancelar">
                Cancelar
            </button>

        </div>

    `;

    const rolesListDiv = div.querySelector("#rolesList");

    function renderRoles() {

        rolesListDiv.innerHTML = "";

        if (currentRoles.length === 0) {
            rolesListDiv.textContent = "Sin roles";
            return;
        }

        currentRoles.forEach(r => {

            const span = document.createElement("span");

            span.textContent = r;
            span.style.marginRight = "10px";
            span.style.padding = "4px 8px";
            span.style.background = "#e0e0e0";
            span.style.borderRadius = "4px";

            rolesListDiv.appendChild(span);

        });
    }

    renderRoles();

    function showRolesSelector(listaRoles, callback) {

        const modal = document.createElement("div");

        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.background = "rgba(0,0,0,0.3)";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";

        const box = document.createElement("div");

        box.style.background = "white";
        box.style.padding = "20px";
        box.style.borderRadius = "6px";

        const selected = [];

        listaRoles.forEach(role => {

            const label = document.createElement("label");

            const chk = document.createElement("input");

            chk.type = "checkbox";
            chk.value = role;

            label.append(chk, " ", role);

            box.appendChild(label);
            box.appendChild(document.createElement("br"));

        });

        const btnOk = document.createElement("button");
        btnOk.textContent = "Aceptar";

        const btnCancel = document.createElement("button");
        btnCancel.textContent = "Cancelar";

        btnOk.onclick = () => {

            box.querySelectorAll("input:checked")
                .forEach(c => selected.push(c.value));

            modal.remove();

            callback(selected);

        };

        btnCancel.onclick = () => modal.remove();

        box.append(btnOk, btnCancel);

        modal.appendChild(box);

        document.body.appendChild(modal);

    }

    div.querySelector("#btnAddRole").onclick = () => {

        const disponibles =
            ALL_ROLES.filter(r => !currentRoles.includes(r));

        if (disponibles.length === 0) {
            alert("No hay más roles disponibles");
            return;
        }

        showRolesSelector(disponibles, seleccionados => {

            currentRoles.push(...seleccionados);

            renderRoles();

        });

    };

    div.querySelector("#btnRemoveRole").onclick = () => {

        if (currentRoles.length === 0) {
            alert("El usuario no tiene roles");
            return;
        }

        showRolesSelector(currentRoles, seleccionados => {

            currentRoles =
                currentRoles.filter(r => !seleccionados.includes(r));

            renderRoles();

        });

    };

    div.querySelector("#btnGuardar").onclick = () => {

        const username =
            div.querySelector("#editUsername").value.trim();

        const password =
            div.querySelector("#editPassword").value.trim();

        const email =
            div.querySelector("#editEmail").value.trim();

        const data = {
            username,
            email,
            roles: currentRoles
        };

        if (password !== "") {
            data.password = password;
        }

        onSave(data);
    };

    div.querySelector("#btnCancelar").onclick = onCancel;

    return div;
}