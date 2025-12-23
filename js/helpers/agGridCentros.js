export function crearGridCentros(centros, meses) {

    // Contenedor principal
  // Contenedor principal
  const wrapper = document.createElement("div");
  wrapper.id = "tablaCentrosWrapper";   // 👈 ID único para dar estilo solo a esta tabla
  wrapper.style.marginTop = "20px";
  wrapper.style.padding = "0";                 // FULL WIDTH
  wrapper.style.background = "transparent";    // FULL WIDTH
  wrapper.style.borderRadius = "0";            // FULL WIDTH
  wrapper.style.boxShadow = "none";            // FULL WIDTH



    // ============================
    // 1. Barra de herramientas
    // ============================
    const toolbar = document.createElement("div");
    toolbar.style.display = "flex";
    toolbar.style.justifyContent = "space-between";
    toolbar.style.marginBottom = "10px";

    // Buscador
    const inputSearch = document.createElement("input");
    inputSearch.type = "text";
    inputSearch.placeholder = "Buscar en la tabla...";
    inputSearch.style.padding = "6px";
    inputSearch.style.width = "250px";
    inputSearch.style.border = "1px solid #aaa";
    inputSearch.style.borderRadius = "5px";

    // Botón exportar CSV
    const btnExport = document.createElement("button");
    btnExport.textContent = "Exportar CSV";
    btnExport.style.padding = "6px 12px";
    btnExport.style.border = "none";
    btnExport.style.background = "#1b5e20";
    btnExport.style.color = "white";
    btnExport.style.borderRadius = "5px";
    btnExport.style.cursor = "pointer";

    toolbar.appendChild(inputSearch);
    toolbar.appendChild(btnExport);

    // ============================
    // 2. Contenedor del grid
    // ============================
    const gridDiv = document.createElement("div");
    gridDiv.classList.add("ag-theme-alpine");
    gridDiv.style.height = "550px";
    gridDiv.style.width = "100%";

    wrapper.appendChild(toolbar);
    wrapper.appendChild(gridDiv);

    // ============================
    // 3. Columnas dinámicas
    // ============================
    const columnDefs = [
        {
            headerName: "EESS",
            field: "EESS",
            pinned: "left",
            filter: "agTextColumnFilter",
            sortable: true,
            resizable: true,
            width: 220
        }
    ];

    meses.forEach(m => {
        columnDefs.push({
            headerName: m,
            field: m,
            filter: "agNumberColumnFilter",
            sortable: true,
            resizable: true,

            // 🔥 Pintar las celdas con valor 0
            cellStyle: params => {
                if (params.value === 0) {
                    return {
                        backgroundColor: "#ffebee",
                        color: "#c62828",
                        fontWeight: "bold"
                    };
                }
                return null;
            }
        });
    });


    // ============================
    // 4. Filas dinámicas
    // ============================
    const rowData = Object.entries(centros).map(([nombre, valores]) => {
        const row = { EESS: nombre };
        meses.forEach(m => row[m] = valores[m]);
        return row;
    });

    // ============================
    // 5. Opciones del grid
    // ============================
    const gridOptions = {
        columnDefs,
        rowData,
        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true
        },
        animateRows: true,
        suppressHorizontalScroll: false,


        domLayout: "normal"
    };

    // ============================
    // 6. Crear el grid
    // ============================
    new agGrid.Grid(gridDiv, gridOptions);
    //exponemosla api para pdoer exportar pdf
    window._globalGridApi = gridOptions.api;
    window._globalColumnApi = gridOptions.columnApi;


    // ============================
    // 7. Auto-ajustar columnas
    // ============================
    function autoSizeAll() {
        const allCols = gridOptions.columnApi
            .getAllDisplayedColumns()
            .map(col => col.getColId());

        gridOptions.columnApi.autoSizeColumns(allCols);
    }

    // Ajuste inicial (dar tiempo al DOM)
    setTimeout(autoSizeAll, 200);

    // Ajustar al cambiar el tamaño de pantalla
    window.addEventListener("resize", autoSizeAll);

    // ============================
    // 8. Buscador global
    // ============================
    inputSearch.addEventListener("input", () => {
        gridOptions.api.setQuickFilter(inputSearch.value);
    });

    // ============================
    // 9. Exportar CSV
    // ============================
    btnExport.addEventListener("click", () => {
        gridOptions.api.exportDataAsCsv({
            fileName: "atendidos_por_centro.csv"
        });
    });

    return wrapper;
}
