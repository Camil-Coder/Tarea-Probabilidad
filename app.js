// -----------------------
// Estado global
// -----------------------
let ROWS = [];            // todas las filas del Excel (Array<Object>)
let HEADERS = [];         // nombres de columna (Array<string>)
let COL_MUNICIPIO = null; // nombre exacto de la columna municipio
let COL_FECHA = null;     // nombre exacto de la columna fecha (si existe)
let NUMERIC_COLS = [];    // columnas que parecen numéricas (para histograma)

const el = (id) => document.getElementById(id);

// -----------------------
// Inicio: listeners UI
// -----------------------
window.addEventListener("DOMContentLoaded", () => {
    el("fileInput").addEventListener("change", handleFile);
    el("btnMostrar").addEventListener("click", handleMostrarDatos);
    el("btnHist").addEventListener("click", handleGenerarHistograma);
});

// -----------------------
// Lectura de Excel
// -----------------------
async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const sheet = wb.SheetNames[0];
        const ws = wb.Sheets[sheet];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: null });

        if (!rows.length) {
            setMsg("La hoja del Excel está vacía.", true);
            return;
        }

        ROWS = rows;
        HEADERS = Object.keys(rows[0]);

        // Detectar columnas clave
        COL_MUNICIPIO = detectHeader(["Municipio"]);
        COL_FECHA = detectHeader(["fecha", "Fecha"]);

        if (!COL_MUNICIPIO) {
            setMsg('No se encontró una columna de "Municipio". Renombra tu archivo para incluir una columna llamada "Municipio".', true);
            return;
        }

        // Columnas numéricas (para variable)
        NUMERIC_COLS = HEADERS
            .filter(h => h !== COL_MUNICIPIO)
            .filter(isProbablyNumericColumn);

        // Poblar selects
        fillMunicipios();
        fillVariables();

        // Info de archivo
        el("fileInfo").textContent = `Archivo: ${file.name} — Filas: ${ROWS.length} — Columnas: ${HEADERS.length}`;
        setMsg("Archivo cargado correctamente.", false);

        // Limpiar salidas previas
        clearTablesAndChart();
    } catch (err) {
        console.error(err);
        setMsg("Hubo un problema leyendo el archivo. Verifica que sea .xlsx o .xls válido.", true);
    }
}

// -----------------------
// Detectar cabecera (insensible a mayúsculas/acentos básicos)
// -----------------------
function detectHeader(candidates) {
    const norm = s => String(s).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
    const headersNorm = HEADERS.map(h => norm(h));

    for (const cand of candidates) {
        const k = norm(cand);
        const idx = headersNorm.indexOf(k);
        if (idx !== -1) return HEADERS[idx];
    }
    // Búsqueda flexible: exacto "municipio" si existe con variaciones
    if (candidates.includes("Municipio")) {
        const idx2 = headersNorm.findIndex(h => /municipio/.test(h));
        if (idx2 !== -1) return HEADERS[idx2];
    }
    return null;
}

// -----------------------
// Chequeo "probablemente numérica"
// -----------------------
function isProbablyNumericColumn(colName) {
    // Evitar fecha por defecto
    if (String(colName).toLowerCase().includes("fecha")) return false;

    let seen = 0, numeric = 0;
    for (const r of ROWS) {
        const v = r[colName];
        if (v === null || v === undefined || v === "") continue;
        seen++;
        const num = toNumber(v);
        if (Number.isFinite(num)) numeric++;
        // Muestra pequeña para no recorrer todo si es grande
        if (seen >= 200) break;
    }
    // Si >= 60% son numéricos en la muestra => aceptamos
    return seen > 0 && numeric / seen >= 0.6;
}

function toNumber(x) {
    if (typeof x === "number") return x;
    if (typeof x === "string") {
        const s = x.replace(",", ".").trim();
        const n = parseFloat(s);
        return Number.isFinite(n) ? n : NaN;
    }
    return NaN;
}

// -----------------------
// Poblar selects
// -----------------------
function fillMunicipios() {
    const select = el("selMunicipio");
    const set = new Set(ROWS.map(r => r[COL_MUNICIPIO]).filter(Boolean));
    const opts = Array.from(set).sort((a, b) => String(a).localeCompare(String(b), "es", { sensitivity: "base" }));

    select.innerHTML = opts.map(v => `<option value="${escapeHtml(String(v))}">${escapeHtml(String(v))}</option>`).join("");
    // Preselección útil
    const pref = opts.find(c => /barranquilla/i.test(c)) || opts.find(c => /medell[ií]n/i.test(c)) || opts[0];
    if (pref) select.value = pref;
}

function fillVariables() {
    const select = el("selVariable");

    // Si encontramos columnas numéricas, ofrecemos esas; si no, todas menos municipio
    const base = NUMERIC_COLS.length ? NUMERIC_COLS : HEADERS.filter(h => h !== COL_MUNICIPIO);

    select.innerHTML = base.map(h => `<option value="${escapeHtml(h)}">${escapeHtml(h)}</option>`).join("");

    // Preselección útil si existen
    const preferidas = ["vel_viento (m/s)", "T (°C)"];
    const found = preferidas.find(p => base.includes(p));
    if (found) select.value = found;
}

// -----------------------
// Mostrar datos en tabla (Municipio + Variable [+ fecha])
// -----------------------
// -----------------------
// Mostrar datos en tabla (Municipio + Variable [+ fecha])
// -----------------------
function handleMostrarDatos() {
    if (!ROWS.length) return setMsg("Primero carga el Excel.", true);

    const mun = el("selMunicipio").value;
    const varCol = el("selVariable").value;
    if (!mun || !varCol) return setMsg("Selecciona un municipio y una variable.", true);

    const subset = ROWS.filter(r => String(r[COL_MUNICIPIO]) === mun);

    // Preparar columnas a mostrar
    const cols = [];
    if (COL_FECHA) cols.push(COL_FECHA);
    cols.push(COL_MUNICIPIO);
    cols.push(varCol);

    // THEAD
    const theadHtml = `<tr>${cols.map(c => `<th>${escapeHtml(c)}</th>`).join("")}</tr>`;
    el("dataTable").querySelector("thead").innerHTML = theadHtml;

    // TBODY (mostrar TODAS las filas, el scroll lo maneja CSS .table-wrap)
    const bodyHtml = subset.map(r => {
        return `<tr>${cols.map(c => `<td>${escapeHtml(r[c])}</td>`).join("")}</tr>`;
    }).join("");
    el("dataTable").querySelector("tbody").innerHTML = bodyHtml;

    // Mostrar conteo de filas en la tabla (sin encabezado)
    el("rowCount").textContent = `Filas mostradas: ${subset.length} de ${subset.length}`;

    setMsg(`Mostrando ${subset.length} filas para "${mun}" y la variable "${varCol}".`, false);

    // limpiar salidas previas de histograma/frecuencias
    clearChartAndFreq();
}



// -----------------------
// Generar histograma + tabla de frecuencias + stats
// -----------------------
function handleGenerarHistograma() {
    if (!ROWS.length) return setMsg("Primero carga el Excel.", true);

    const mun = el("selMunicipio").value;
    const varCol = el("selVariable").value;
    const binsInput = parseInt(el("numBins").value, 10);
    const nbins = clamp(isFinite(binsInput) ? binsInput : 10, 5, 80);

    const subset = ROWS.filter(r => String(r[COL_MUNICIPIO]) === mun);
    const values = subset
        .map(r => toNumber(r[varCol]))
        .filter(v => Number.isFinite(v));

    if (!values.length) {
        setMsg(`No hay datos numéricos en la variable "${varCol}" para ${mun}.`, true);
        return;
    }

    // Stats
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(values.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1));
    const cv = (sd / mean) * 100;

    // Histograma con Plotly
    const trace = {
        type: "histogram",
        x: values,
        nbinsx: nbins,
        marker: {
            color: "#4a90e2",                 // color de relleno
            line: { color: "#ffffff", width: 1 } // borde blanco fino
        },
        opacity: 0.85,
        hovertemplate: "Valor: %{x}<br>Frecuencia: %{y}<extra></extra>"
    };

    const layout = {
        margin: { l: 60, r: 30, t: 30, b: 50 },
        paper_bgcolor: "rgba(0,0,0,0)",   // fondo transparente (combina con tu CSS oscuro)
        plot_bgcolor: "#0e1627",          // fondo del área del gráfico
        font: { color: "#e8eefc", size: 14 },
        xaxis: {
            title: varCol,
            gridcolor: "#1c2a49",
            zeroline: false
        },
        yaxis: {
            title: "Frecuencia",
            gridcolor: "#1c2a49",
            zeroline: false
        },
        bargap: 0.05,
        bargroupgap: 0.02
    };

    Plotly.newPlot("histogram", [trace], layout, {
        displayModeBar: true,
        responsive: true
    });


    // Tabla de stats
    const statsBody = `<tr>
    <td>${n}</td>
    <td>${round(mean, 4)}</td>
    <td>${round(sd, 4)}</td>
    <td>${round(cv, 2)}</td>
  </tr>`;
    el("statsTable").querySelector("tbody").innerHTML = statsBody;

    // Tabla de frecuencias
    buildFrequencyTable(values, nbins);

    setMsg(`Histograma generado para "${mun}" y "${varCol}" con ${nbins} bins.`, false);
}

// -----------------------
// Tabla de frecuencias
// -----------------------
function buildFrequencyTable(values, nbins) {
    if (!values.length) return;

    const min = Math.min(...values);
    const max = Math.max(...values);

    if (min === max) {
        el("freqTable").querySelector("tbody").innerHTML =
            `<tr><td>[${round(min, 4)}, ${round(max, 4)}]</td><td>${values.length}</td></tr>`;
        return;
    }

    const width = (max - min) / nbins;
    const edges = Array.from({ length: nbins + 1 }, (_, i) => min + i * width);
    const counts = Array(nbins).fill(0);

    for (const v of values) {
        let idx = Math.floor((v - min) / width);
        if (idx >= nbins) idx = nbins - 1; // incluir el valor máximo en el último bin
        if (idx < 0) idx = 0;
        counts[idx]++;
    }

    const bodyHtml = counts.map((count, i) => {
        const a = edges[i];
        const b = edges[i + 1];
        const label = (i === counts.length - 1)
            ? `[${round(a, 4)}, ${round(b, 4)}]`
            : `[${round(a, 4)}, ${round(b, 4)})`;
        return `<tr><td>${label}</td><td>${count}</td></tr>`;
    }).join("");

    el("freqTable").querySelector("tbody").innerHTML = bodyHtml;
}

// -----------------------
// Helpers UI
// -----------------------
function setMsg(text, isError = false) {
    const m = el("msg");
    m.textContent = text || "";
    m.className = isError ? "error" : "ok";
}

function clearTablesAndChart() {
    // Limpia tabla de datos
    el("dataTable").querySelector("thead").innerHTML = "";
    el("dataTable").querySelector("tbody").innerHTML = "";
    clearChartAndFreq();
}

function clearChartAndFreq() {
    // Limpia histograma, stats, frecuencias
    el("histogram").innerHTML = "";
    el("statsTable").querySelector("tbody").innerHTML = "";
    el("freqTable").querySelector("tbody").innerHTML = "";
}

function clamp(x, lo, hi) {
    return Math.max(lo, Math.min(hi, x));
}

function round(x, k) {
    const f = Math.pow(10, k);
    return Math.round(x * f) / f;
}

function escapeHtml(v) {
    if (v === null || v === undefined) return "";
    return String(v).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m]));
}
