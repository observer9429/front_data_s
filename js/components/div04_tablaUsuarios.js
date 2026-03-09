export function TablaUsuarios(pageData) {

    const wrapper = document.createElement("div");
    wrapper.style.marginTop = "20px";

    const gridDiv = document.createElement("div");
    gridDiv.classList.add("ag-theme-alpine");
    gridDiv.style.height = "420px";
    gridDiv.style.width = "100%";

    wrapper.appendChild(gridDiv);

    const columnDefs = [

        { headerName: "ID", field: "id", width: 60 },

            { headerName: "Username", field: "username", width: 120 },

            { headerName: "Email", field: "email", width: 180 },

        {
            headerName: "Roles",
            field: "roles",
            minWidth: 160,
            valueGetter: p => p.data.roles.join(", ")
        },

        {
            headerName: "Acciones",
            field: "id",
            width: 140,

            cellRenderer: params => {

                const div = document.createElement("div");

                div.innerHTML = `
                    <button data-edit="${params.value}">✏️</button>
                    <button data-delete="${params.value}">❌</button>
                `;

                return div;
            }
        }
    ];

    const gridOptions = {
        columnDefs,
        rowData: pageData.content,

        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true
        }
    };

    new agGrid.Grid(gridDiv, gridOptions);


    // ================= PAGINACION =================

    const pag = document.createElement("div");
    pag.style.display = "flex";
    pag.style.justifyContent = "center";
    pag.style.gap = "10px";
    pag.style.marginTop = "12px";

    const btnPrev = document.createElement("button");
    btnPrev.textContent = "← Anterior";
    btnPrev.dataset.page = "prev";

    const info = document.createElement("span");
    info.textContent = `Página ${pageData.number + 1} de ${pageData.totalPages}`;

    const btnNext = document.createElement("button");
    btnNext.textContent = "Siguiente →";
    btnNext.dataset.page = "next";

    if (pageData.number === 0) btnPrev.disabled = true;
    if (pageData.number + 1 === pageData.totalPages) btnNext.disabled = true;

    pag.append(btnPrev, info, btnNext);
    wrapper.appendChild(pag);

    return wrapper;
}