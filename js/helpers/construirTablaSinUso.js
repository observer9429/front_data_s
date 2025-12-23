// helpers/construirTablaSinUso.js
export function construirTablaSinUso(meses_sin_atenciones) {
    const meses = Object.keys(meses_sin_atenciones);

    const fila = { titulo: "Cantidad de EESS sin uso del SIHCE" };

    meses.forEach(m => {
        fila[m] = meses_sin_atenciones[m];
    });

    return { meses, fila };
}
