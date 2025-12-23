// helpers/renderAtencionesCentro.js
import { exportarTablaPDF } from "./exportadorPDF.js";

function calcularPorcentaje(atendidos, citados) {
    if (!citados || citados === 0) {
        return { valor: 0, texto: "0 %" };
    }
    const valor = (atendidos / citados) * 100;
    return {
        valor,
        texto: valor.toFixed(1) + " %"
    };
}

export function renderAtencionesCentro(divTablaContainer, dataCentros, centrosSeleccionados) {

    divTablaContainer.innerHTML = "";

    const cont = document.createElement("div");
    cont.id = "divTabla";

    // ================= HEADER =================
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.marginBottom = "10px";

    const info = document.createElement("div");
    info.textContent = `Centros seleccionados: ${centrosSeleccionados.length}`;
    info.classList.add("text-centros");

    const btnPdf = document.createElement("button");
    btnPdf.textContent = "Exportar PDF";
    btnPdf.style.background = "#b71c1c";
    btnPdf.style.color = "white";
    btnPdf.style.padding = "8px 16px";
    btnPdf.style.border = "none";
    btnPdf.style.borderRadius = "6px";
    btnPdf.style.cursor = "pointer";

    header.appendChild(info);
    header.appendChild(btnPdf);
    cont.appendChild(header);

    // ================= CENTROS =================
    centrosSeleccionados.forEach(nombreCentro => {

        const dataCentro = dataCentros[nombreCentro];
        if (!dataCentro) return;

        const titulo = document.createElement("h3");
        titulo.textContent =
            `${nombreCentro} (Total Citados: ${dataCentro.total_citados} | Total Atendidos: ${dataCentro.total_atendidos})`;
        titulo.style.marginTop = "20px";
        cont.appendChild(titulo);

        const tabla = document.createElement("table");
        tabla.style.borderCollapse = "collapse";
        tabla.style.width = "100%";
        tabla.style.marginTop = "5px";

        // ===== THEAD =====
        const thead = document.createElement("thead");
        const trHead = document.createElement("tr");

        ["Mes / Servicio", "Total Citados", "Total Atendidos", "% (aten./cit.)"]
            .forEach(txt => {
                const th = document.createElement("th");
                th.textContent = txt;
                th.style.background = "#0d47a1";
                th.style.color = "white";
                th.style.padding = "6px";
                th.style.border = "1px solid #ccc";
                trHead.appendChild(th);
            });

        thead.appendChild(trHead);
        tabla.appendChild(thead);

        const tbody = document.createElement("tbody");

        const meses = Object.keys(dataCentro).filter(
            k => !["total_citados", "total_atendidos"].includes(k)
        );

        meses.forEach(mes => {
            const infoMes = dataCentro[mes];

            const citMes = infoMes.total_citados ?? 0;
            const atenMes = infoMes.total_atendidos ?? 0;
            const pctMes = calcularPorcentaje(atenMes, citMes);

            // ===== FILA MES =====
            const trMes = document.createElement("tr");

            const tdMes = document.createElement("td");
            tdMes.textContent = mes;
            tdMes.style.fontWeight = "bold";
            tdMes.style.background = "#F0F8FF";
            tdMes.style.padding = "6px";
            tdMes.style.border = "1px solid #ccc";

            const tdCitMes = document.createElement("td");
            tdCitMes.textContent = citMes;
            tdCitMes.style.fontWeight = "bold";
            tdCitMes.style.background = "#F0F8FF";
            tdCitMes.style.padding = "6px";
            tdCitMes.style.border = "1px solid #ccc";

            const tdAtenMes = document.createElement("td");
            tdAtenMes.textContent = atenMes;
            tdAtenMes.style.fontWeight = "bold";
            tdAtenMes.style.background = "#F0F8FF";
            tdAtenMes.style.padding = "6px";
            tdAtenMes.style.border = "1px solid #ccc";

            const tdPctMes = document.createElement("td");
            tdPctMes.textContent = pctMes.texto;
            tdPctMes.style.fontWeight = "bold";
            tdPctMes.style.background = "#F0F8FF";
            tdPctMes.style.padding = "6px";
            tdPctMes.style.border = "1px solid #ccc";

            // 🔴 FUERZA VISUAL < 25%
            if (pctMes.valor < 25) {
                tdPctMes.style.cssText +=
                    "background-color:#ffebee !important; color:#c62828 !important;";
            }

            trMes.appendChild(tdMes);
            trMes.appendChild(tdCitMes);
            trMes.appendChild(tdAtenMes);
            trMes.appendChild(tdPctMes);
            tbody.appendChild(trMes);

            // ===== SERVICIOS =====
            Object.entries(infoMes)
                .filter(([k]) => !["total_citados", "total_atendidos"].includes(k))
                .forEach(([servicio, valores]) => {

                    const cit = valores.total_citados ?? 0;
                    const aten = valores.total_atendidos ?? 0;
                    const pct = calcularPorcentaje(aten, cit);

                    const trServ = document.createElement("tr");

                    const tdServ = document.createElement("td");
                    tdServ.textContent = servicio;
                    tdServ.style.padding = "6px";
                    tdServ.style.border = "1px solid #ccc";

                    const tdCit = document.createElement("td");
                    tdCit.textContent = cit;
                    tdCit.style.padding = "6px";
                    tdCit.style.border = "1px solid #ccc";

                    const tdAten = document.createElement("td");
                    tdAten.textContent = aten;
                    tdAten.style.padding = "6px";
                    tdAten.style.border = "1px solid #ccc";

                    const tdPct = document.createElement("td");
                    tdPct.textContent = pct.texto;
                    tdPct.style.padding = "6px";
                    tdPct.style.border = "1px solid #ccc";

                    if (pct.valor < 25) {
                        tdPct.style.cssText +=
                            "background-color:#ffebee !important; color:#c62828 !important; font-weight:bold;";
                    }

                    trServ.appendChild(tdServ);
                    trServ.appendChild(tdCit);
                    trServ.appendChild(tdAten);
                    trServ.appendChild(tdPct);
                    tbody.appendChild(trServ);
                });

            const trSep = document.createElement("tr");
            const tdSep = document.createElement("td");
            tdSep.colSpan = 4;
            tdSep.style.height = "6px";
            tdSep.style.border = "1px solid #ccc";
            trSep.appendChild(tdSep);
            tbody.appendChild(trSep);
        });

        tabla.appendChild(tbody);
        cont.appendChild(tabla);
    });

    divTablaContainer.appendChild(cont);
    btnPdf.onclick = () => exportarTablaPDF(cont);
}
