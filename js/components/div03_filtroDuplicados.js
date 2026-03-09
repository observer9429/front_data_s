export function FiltroDuplicados() {

    const div = document.createElement("div");

    div.innerHTML = `

        <div style="
            display:flex;
            gap:10px;
            justify-content:center;
            margin:20px;
        ">

            <select id="mesDuplicados">
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
            </select>

            <input
                type="text"
                value="2025"
                disabled
                style="width:80px"
            />

            <button
                id="btnBuscarDuplicados"
                class="btn-main"
            >
                Buscar
            </button>

        </div>

    `;

    return div;
}