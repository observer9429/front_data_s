import { generarTablaCentrosParaPDF } from "./generarTablaCentrosParaPDF.js";

export function exportarTablaPDF(contenedorOriginal) {

    const temp = document.createElement("div");
    temp.style.position = "fixed";
    temp.style.left = "-9999px";
    temp.style.top = "0";
    temp.style.background = "white";
    temp.style.width = "1100px";          // 🔥 más estrecho para que NO se pegue al borde
    temp.style.padding = "30px";          // 🔥 padding interno elegante
    temp.style.boxSizing = "border-box";

    document.body.appendChild(temp);

    const clone = contenedorOriginal.cloneNode(true);

    clone.style.padding = "20px";         // 🔥 padding extra para que nada toque los bordes
    clone.style.background = "white";

    // Reemplazar AG-Grid por tabla HTML
    const gridContainer = clone.querySelector("#gridContainer");
    if (gridContainer) {
        const tablaHTML = generarTablaCentrosParaPDF(window._globalGridApi);
        gridContainer.innerHTML = "";
        gridContainer.appendChild(tablaHTML);
    }

    temp.appendChild(clone);

    window.html2canvas(clone, {
        scale: 1.2,
        useCORS: true
    }).then(canvas => {

        const { jsPDF } = window.jspdf;

        // 🔥 MÁRGENES PDF
        const margin = 25;

        const pdf = new jsPDF("l", "pt", "a4");

        const imgData = canvas.toDataURL("image/jpeg", 0.85);
        const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
        const pdfHeight = pdf.internal.pageSize.getHeight() - margin * 2;

        const imgWidth = pdfWidth;
        const imgHeight = canvas.height * (pdfWidth / canvas.width);

        let heightLeft = imgHeight;
        let position = margin;

        // Página 1
        pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Más páginas si es necesario
        while (heightLeft > 0) {
            pdf.addPage();
            position = margin - (imgHeight - heightLeft);
            pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save("reporte_sihce.pdf");
        document.body.removeChild(temp);
    });
}
