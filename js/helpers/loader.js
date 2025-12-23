// helpers/loader.js

export function LoaderCentros() {
    return `
    <div style="
        position: relative;
        width: 100%;
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    ">
        <span style="
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            font-size: 18px;
        ">
            Cargando...
        </span>

        <svg fill="hsl(228, 97%, 42%)" width="60" height="60" viewBox="0 0 24 24">
            <circle cx="12" cy="3" r="0">
                <animate id="spinner_318l" begin="0;spinner_cvkU.end-0.5s"
                    attributeName="r" dur="0.6s" values="0;2;0"
                    keyTimes="0;.2;1" calcMode="spline"
                    keySplines="0,1,0,1;.53,0,.61,.73" fill="freeze"/>
            </circle>

            <circle cx="16.50" cy="4.21" r="0">
                <animate id="spinner_g5Gj" begin="spinner_318l.begin+0.1s"
                    attributeName="r" dur="0.6s" values="0;2;0"
                    keyTimes="0;.2;1" calcMode="spline"
                    keySplines="0,1,0,1;.53,0,.61,.73" fill="freeze"/>
            </circle>

            <circle cx="7.50" cy="4.21" r="0">
                <animate id="spinner_cvkU" begin="spinner_Uuk0.begin+0.1s"
                    attributeName="r" dur="0.6s" values="0;2;0"
                    keyTimes="0;.2;1" calcMode="spline"
                    keySplines="0,1,0,1;.53,0,.61,.73" fill="freeze"/>
            </circle>
        </svg>
    </div>
    `;
}
