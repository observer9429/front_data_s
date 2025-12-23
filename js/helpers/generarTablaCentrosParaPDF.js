export function generarTablaCentrosParaPDF(api) {
    const rowData = [];
    api.forEachNode(node => rowData.push(node.data));

    const meses = Object.keys(rowData[0]).filter(x => x !== "EESS");

    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    table.style.marginTop = "20px";

    // HEADER
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    ["EESS", ...meses].forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        th.style.background = "#0d47a1";
        th.style.color = "white";
        th.style.padding = "6px";
        th.style.border = "1px solid #ccc";
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // BODY
    const tbody = document.createElement("tbody");

    rowData.forEach((row, idx) => {
        const tr = document.createElement("tr");
        tr.style.background = idx % 2 === 0 ? "#fafafa" : "white";

        ["EESS", ...meses].forEach(col => {
            const td = document.createElement("td");
            const value = row[col];

            td.textContent = value;
            td.style.padding = "6px";
            td.style.border = "1px solid #ccc";

            // 🔥 Pintar celdas con valor 0
            if (value === 0) {
                td.style.background = "#ffebee";
                td.style.color = "#c62828";
                td.style.fontWeight = "bold";
            }

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    return table;
}
