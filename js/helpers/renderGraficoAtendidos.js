export function renderGraficoAtendidos(div, data) {

    div.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.style.maxHeight = "420px";
    div.appendChild(canvas);

    new Chart(canvas, {
        type: "bar",
        data: {
            labels: data.meses,
            datasets: [
                {
                    label: "Total Citados",
                    data: data.citados,
                    backgroundColor: "rgba(33,150,243,0.7)"
                    //yAxisID: "y"
                },
                {
                    label: "Total Atendidos",
                    data: data.atendidos,
                    backgroundColor: "rgba(198,40,40,0.7)"
                    //yAxisID: "y1"
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Citados vs Atendidos por Mes",
                    font: { size: 18 }
                },
                tooltip: {
                    enabled: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: "left",
                    title: {
                        display: true,
                        text: "Citados"
                    },
                    ticks: { precision: 0 }
                },
                y1: {
                    beginAtZero: true,
                    position: "right",
                    title: {
                        display: true,
                        text: "Atendidos"
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: { precision: 0 }
                }
            }
        }
    });
}
