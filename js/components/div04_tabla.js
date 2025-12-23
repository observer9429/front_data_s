import { crearGridCentros } from "../helpers/agGridCentros.js";
import { exportarTablaPDF } from "../helpers/exportadorPDF.js";

export function Tabla(data) {

    const div = document.createElement("div");
    div.id = "divTabla";
    //div.classList.add("resultado-box");


    const info = data.data_atendidos;
    const { total_establecimientos, meses_sin_atenciones, centros } = info;

    const meses = Object.keys(meses_sin_atenciones);

    //──────────────────────────────────────────────
    // 1) HEADER SUPERIOR (Total + Botón PDF)
    //──────────────────────────────────────────────
    const headerBar = `
        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:10px;
        ">
            <div style="font-weight:bold;">
                Total EESS: ${total_establecimientos}
            </div>

            <button id="btnExportPDF" style="
                background:#b71c1c;
                color:white;
                padding:8px 16px;
                border:none;
                border-radius:6px;
                cursor:pointer;
            ">
                Exportar PDF
            </button>
        </div>
    `;

    //──────────────────────────────────────────────
    // 2) TABLA DE EESS SIN USO
    //──────────────────────────────────────────────
    const tablaSinAtenciones = `
        <table id="tablaSinUso" border="1" cellpadding="6"
               style="margin-top:10px; border-collapse: collapse; width:100%;">
            <thead>
                <tr>
                    <th>Cantidad de EESS sin uso del SIHCE</th>
                    ${meses.map(m => `<th>${m}</th>`).join("")}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="font-weight:bold;">Cantidad</td>
                    ${meses.map(m => `<td>${meses_sin_atenciones[m]}</td>`).join("")}
                </tr>
            </tbody>
        </table>
    `;

    //──────────────────────────────────────────────
    // 3) ARMADO FINAL DEL COMPONENTE
    //──────────────────────────────────────────────
    div.innerHTML = `
        ${headerBar}
        ${tablaSinAtenciones}

        <h3 style="margin-top:20px;">Atenciones por Establecimiento</h3>
        <div id="gridContainer"></div>
    `;

    //──────────────────────────────────────────────
    // 4) INSERTAR AG-GRID
    //──────────────────────────────────────────────
    const grid = crearGridCentros(centros, meses);
    div.querySelector("#gridContainer").appendChild(grid);

    //──────────────────────────────────────────────
    // 5) ACTIVAR EXPORTAR PDF
    //──────────────────────────────────────────────
    setTimeout(() => {
        const btn = div.querySelector("#btnExportPDF");
        if (btn) btn.onclick = () => exportarTablaPDF(div);
    }, 200);

    return div;
}
