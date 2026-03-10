export function TablaDuplicaciones(data) {

    const wrapper = document.createElement("div");
    wrapper.style.marginTop = "20px";


    // =========================
    // TOOLBAR
    // =========================

    const toolbar = document.createElement("div");

    toolbar.style.display = "flex";
    toolbar.style.justifyContent = "flex-end";
    toolbar.style.gap = "10px";
    toolbar.style.marginBottom = "10px";

    const btnPDF = document.createElement("button");
    btnPDF.textContent = "Exportar PDF";

    const btnExcel = document.createElement("button");
    btnExcel.textContent = "Exportar Excel";

    toolbar.append(btnPDF, btnExcel);

    wrapper.appendChild(toolbar);


    // =========================
    // GRID
    // =========================

    const gridDiv = document.createElement("div");

    gridDiv.classList.add("ag-theme-alpine");

    gridDiv.style.height = "600px";
    gridDiv.style.width = "100%";
    gridDiv.style.overflowX = "auto";

    wrapper.appendChild(gridDiv);


    // =========================
    // COLUMNAS
    // =========================

    const columnDefs = [

        { headerName: "ID", field: "id" },

        { headerName: "EESS", field: "nombreEess" },

        { headerName: "Servicio", field: "descripcionDelServicio" },

        { headerName: "Fecha Cita", field: "fechaDeCita" },

        { headerName: "Estado", field: "estadoDeLaCita" },

        { headerName: "Fecha Creación", field: "fechaDeCreacion" },

        { headerName: "Documento", field: "numeroDeDocumento" },

        { headerName: "Nombres", field: "nombresDelPaciente" },

        { headerName: "Apellido", field: "apellidoPaternoDelPaciente" },

        { headerName: "Usuario CC", field: "usuarioCc" }

    ];


    // =========================
    // GRID OPTIONS
    // =========================

    const gridOptions = {

        columnDefs,
        rowData: data,

        rowHeight: 28,
        headerHeight: 32,

        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true
        },

        animateRows: true

    };


    // =========================
    // CREAR GRID
    // =========================

    new agGrid.Grid(gridDiv, gridOptions);


    // =========================
    // AUTO AJUSTAR COLUMNAS
    // 👇 AQUÍ VA EL setTimeout
    // =========================

    setTimeout(() => {

        const allCols = gridOptions.columnApi
            .getAllDisplayedColumns()
            .map(col => col.getColId());

        gridOptions.columnApi.autoSizeColumns(allCols);

    }, 200);



    // =========================
    // EXPORTAR PDF
    // =========================

    btnPDF.onclick = () => {

        const rows = [];

        gridOptions.api.forEachNode(node => {
            rows.push(node.data);
        });

        const columnas = gridOptions.columnApi
            .getAllDisplayedColumns()
            .map(col => col.getColId());

        const headers = columnas.map(c => c.toUpperCase());

        const body = rows.map(row =>
            columnas.map(c => row[c])
        );

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF("l", "pt", "a4");

        doc.autoTable({
            head: [headers],
            body: body,
            styles: { fontSize: 7 }
        });

        doc.save("citas_duplicadas.pdf");

    };


    // =========================
    // EXPORTAR EXCEL (BACKEND)
    // =========================

    btnExcel.onclick = () => {

        const mes = document.getElementById("mesDuplicados").value;

        //const url = `http://localhost:9091/duplications/excel/${mes}`;
        const url = `https://resumen-2025-sihce.onrender.com/duplications/excel/${mes}`;

        const link = document.createElement("a");

        link.href = url;

        link.download = "duplicados.xlsx";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    };


    return wrapper;

}