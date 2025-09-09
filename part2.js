// -----------------------
// Estado global
// -----------------------
let ROWS2 = [];
let HEADERS2 = [];
let COL_MUNICIPIO2 = null;
let NUMERIC_COLS2 = [];

const el2 = (id) => document.getElementById(id);

// -----------------------
// Inicio
// -----------------------
window.addEventListener("DOMContentLoaded", () => {
  el2("fileInput2").addEventListener("change", handleFile2);
  el2("btnBox").addEventListener("click", handleBoxplot);
});

// -----------------------
// Leer Excel
// -----------------------
async function handleFile2(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheet = wb.SheetNames[0];
    const ws = wb.Sheets[sheet];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: null });

    if (!rows.length) {
      setMsg2("El archivo está vacío.", true);
      return;
    }

    ROWS2 = rows;
    HEADERS2 = Object.keys(rows[0]);

    // Detectar columna de Municipio
    COL_MUNICIPIO2 = HEADERS2.find(h => h.toLowerCase().includes("municipio"));
    if (!COL_MUNICIPIO2) {
      setMsg2("No se encontró una columna llamada 'Municipio'.", true);
      return;
    }

    // Detectar columnas numéricas
    NUMERIC_COLS2 = HEADERS2.filter(h => h !== COL_MUNICIPIO2 && isNumericCol2(h));

    fillCitySelects2();
    fillVariableSelect2();

    el2("fileInfo2").textContent = `Archivo: ${file.name} — Filas: ${ROWS2.length}`;
    setMsg2("Archivo cargado correctamente.", false);

    // Limpiar gráfico y stats
    el2("boxplot").innerHTML = "";
    el2("stats2").querySelector("tbody").innerHTML = "";
  } catch (err) {
    console.error(err);
    setMsg2("Error al leer el archivo.", true);
  }
}

function isNumericCol2(col) {
  let count = 0, numeric = 0;
  for (const r of ROWS2) {
    const v = r[col];
    if (v === null || v === undefined || v === "") continue;
    count++;
    if (Number.isFinite(toNumber2(v))) numeric++;
    if (count >= 200) break;
  }
  return count > 0 && numeric / count >= 0.6;
}

function toNumber2(v) {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

// -----------------------
// Poblar selects
// -----------------------
function fillCitySelects2() {
  const cities = [...new Set(ROWS2.map(r => r[COL_MUNICIPIO2]).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), "es", { sensitivity: "base" }));

  const opts = cities.map(c => `<option value="${escapeHtml2(c)}">${escapeHtml2(c)}</option>`).join("");

  el2("selCityA").innerHTML = opts;
  el2("selCityB").innerHTML = opts;

  // Preselección
  if (cities.includes("Barranquilla")) el2("selCityA").value = "Barranquilla";
  if (cities.includes("Medellín")) el2("selCityB").value = "Medellín";
}

function fillVariableSelect2() {
  const opts = NUMERIC_COLS2.map(c => `<option value="${escapeHtml2(c)}">${escapeHtml2(c)}</option>`).join("");
  el2("selVar").innerHTML = opts;

  // Preselección útil
  if (NUMERIC_COLS2.includes("vel_viento (m/s)")) {
    el2("selVar").value = "vel_viento (m/s)";
  }
}

// -----------------------
// Boxplot
// -----------------------
function handleBoxplot() {
  if (!ROWS2.length) return setMsg2("Primero carga el Excel.", true);

  const cityA = el2("selCityA").value;
  const cityB = el2("selCityB").value;
  const variable = el2("selVar").value;

  if (!cityA || !cityB || !variable) {
    setMsg2("Selecciona dos municipios y una variable.", true);
    return;
  }
  if (cityA === cityB) {
    setMsg2("Debes seleccionar dos municipios distintos.", true);
    return;
  }

  const valsA = ROWS2.map(r => r[COL_MUNICIPIO2] === cityA ? toNumber2(r[variable]) : NaN).filter(Number.isFinite);
  const valsB = ROWS2.map(r => r[COL_MUNICIPIO2] === cityB ? toNumber2(r[variable]) : NaN).filter(Number.isFinite);

  if (!valsA.length || !valsB.length) {
    setMsg2("No hay datos numéricos suficientes para esa variable en ambas ciudades.", true);
    return;
  }

  const traceA = {
    y: valsA,
    type: "box",
    name: cityA,
    boxpoints: "outliers",
    marker: { color: "#5ab0ff" }
  };
  const traceB = {
    y: valsB,
    type: "box",
    name: cityB,
    boxpoints: "outliers",
    marker: { color: "#7a7aff" }
  };

  Plotly.newPlot("boxplot", [traceA, traceB], {
    yaxis: { title: variable },
    boxmode: "group",
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "#0e1627",
    font: { color: "#e8eefc" }
  });

  // Stats
  const statsA = calcStats2(valsA);
  const statsB = calcStats2(valsB);

  const bodyHtml = `
    <tr>
      <td>${cityA}</td>
      <td>${statsA.n}</td>
      <td>${statsA.mean}</td>
      <td>${statsA.sd}</td>
      <td>${statsA.median}</td>
      <td>${statsA.q1}</td>
      <td>${statsA.q3}</td>
      <td>${statsA.cv}</td>
    </tr>
    <tr>
      <td>${cityB}</td>
      <td>${statsB.n}</td>
      <td>${statsB.mean}</td>
      <td>${statsB.sd}</td>
      <td>${statsB.median}</td>
      <td>${statsB.q1}</td>
      <td>${statsB.q3}</td>
      <td>${statsB.cv}</td>
    </tr>`;
  el2("stats2").querySelector("tbody").innerHTML = bodyHtml;

  setMsg2(`Boxplot generado para ${cityA} y ${cityB}.`, false);
}

// -----------------------
// Calcular stats
// -----------------------
function calcStats2(arr) {
  const n = arr.length;
  const mean = arr.reduce((a,b)=>a+b,0) / n;
  const sd = Math.sqrt(arr.reduce((s,x)=> s+(x-mean)**2,0)/(n-1));
  const sorted = [...arr].sort((a,b)=>a-b);
  const median = quantile2(sorted,0.5);
  const q1 = quantile2(sorted,0.25);
  const q3 = quantile2(sorted,0.75);
  const cv = (sd/mean)*100;

  return {
    n,
    mean: round2(mean,3),
    sd: round2(sd,3),
    median: round2(median,3),
    q1: round2(q1,3),
    q3: round2(q3,3),
    cv: round2(cv,2)
  };
}

function quantile2(sorted,q){
  const pos = (sorted.length-1)*q;
  const base = Math.floor(pos);
  const rest = pos-base;
  if(sorted[base+1]!==undefined){
    return sorted[base]+rest*(sorted[base+1]-sorted[base]);
  } else {
    return sorted[base];
  }
}

// -----------------------
// Helpers
// -----------------------
function setMsg2(text,isError=false){
  const m = el2("msg2");
  m.textContent = text||"";
  m.className = isError? "error":"ok";
}

function escapeHtml2(v){
  if(v===null||v===undefined) return "";
  return String(v).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
}

function round2(x,k){
  const f = Math.pow(10,k);
  return Math.round(x*f)/f;
}
