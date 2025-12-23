// helpers/construirTablaCentros.js
export function construirTablaCentros(centros, meses) {

    return Object.entries(centros).map(([nombre, valoresMes]) => {
        const row = { EESS: nombre };

        meses.forEach(m => {
            row[m] = valoresMes[m];
        });

        return row;
    });
}
