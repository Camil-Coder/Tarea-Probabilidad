# 📊 Tarea de Probabilidad — Visor de Datos y Comparación de Ciudades

Este proyecto es una página web que permite cargar un archivo Excel con datos climáticos (ejemplo: `Datos.xlsx` del curso) y analizar variables como **temperatura** y **velocidad del viento** por municipio.  

La herramienta facilita la visualización de los datos y el cálculo de medidas básicas como **media, desviación estándar y coeficiente de variación (CV)**, además de generar **histogramas**, **tablas de frecuencias** y ahora también **diagramas de caja y bigotes (boxplots)** para comparar dos ciudades.

🔗 **Probar la página principal (histogramas):**  
👉 [Tarea de Probabilidad — Demo](https://camil-coder.github.io/Tarea-Probabilidad/)  

🔗 **Descargar dataset en Excel:**  
👉 [Datos.xlsx](AQUÍ-VA-EL-LINK-DEL-EXCEL) ← *(reemplaza con tu enlace público o el archivo en tu repo)*

---

## 🚀 Cómo usar la página

### Parte 1 — Histograma y estadísticas
1. **Abrir la página principal**  
   [Index](https://camil-coder.github.io/Tarea-Probabilidad/) o abre `index.html` localmente.  

2. **Cargar el archivo Excel**  
   Haz clic en el botón **📂 Seleccionar archivo** y elige tu dataset (`.xlsx` o `.xls`).  
   - El programa detecta automáticamente las columnas.  
   - Es obligatorio que el archivo tenga una columna llamada `Municipio`.

3. **Seleccionar parámetros de análisis**  
   - Escoge un **municipio** de la lista.  
   - Escoge una **variable numérica** (ejemplo: `vel_viento (m/s)` o `T (°C)`).  
   - Indica el número de **bins** (intervalos) para el histograma.  

4. **Mostrar los datos**  
   Presiona el botón **Mostrar datos** para ver la tabla filtrada.  
   - La tabla muestra todas las filas correspondientes.  
   - Debajo aparece el número total de filas cargadas.

5. **Generar histograma y estadísticas**  
   Presiona el botón **Generar histograma** para:  
   - Ver un gráfico de barras con la distribución de la variable.  
   - Obtener la tabla de **estadísticos**:  
     - número de datos (n)  
     - media  
     - desviación estándar  
     - coeficiente de variación (CV %)  
   - Consultar la **tabla de frecuencias** con intervalos y frecuencias absolutas.

---

### Parte 2 — Comparación con boxplots
1. **Abrir la página de comparación**  
   [Part2](https://camil-coder.github.io/Tarea-Probabilidad/part2.html) o abre `part2.html` localmente.  

2. **Cargar el mismo archivo Excel**.  

3. **Seleccionar las ciudades a comparar** (ejemplo: Barranquilla vs Medellín).  

4. **Elegir la variable** (ejemplo: `vel_viento (m/s)` o `T (°C)`).  

5. **Generar el diagrama de caja y bigotes** con el botón.  
   - Verás un gráfico comparando las dos ciudades.  
   - Debajo se muestra una tabla con estadísticas básicas por ciudad:  
     - n, media, desviación estándar, mediana, cuartiles (Q1 y Q3) y CV.  

---

## 📦 Estructura del proyecto

- `index.html` → página principal con histogramas.  
- `app.js` → lógica de histogramas y frecuencias.  
- `part2.html` → página para comparación de ciudades con boxplots.  
- `part2.js` → lógica para leer datos, filtrar por 2 ciudades y generar boxplots + stats.  
- `style.css` → estilos generales (tema oscuro, botones estilizados, tablas con scroll).  

---

## ✨ Funcionalidades actuales

- [x] Cargar Excel y detectar columnas.  
- [x] Seleccionar municipio y variable.  
- [x] Mostrar tabla filtrada (con scroll y contador de filas).  
- [x] Generar histogramas con **bins configurables**.  
- [x] Calcular estadísticas básicas (media, sd, CV).  
- [x] Tabla de intervalos y frecuencias.  
- [x] Comparar dos ciudades con **diagramas de caja y bigotes**.  
- [x] Tabla de estadísticos por ciudad (mediana, Q1, Q3 incluidas).  

---

## 📌 Notas

- El dataset recomendado es el entregado en la guía del curso:contentReference[oaicite:0]{index=0}.  
- Esta herramienta es útil para la **Semana 3 (Actividad 1)**:  
  - Histogramas y cálculo de coeficiente de variación.  
  - Comparación entre dos ciudades mediante boxplots.  
- Los resultados se pueden exportar como imágenes (captura de pantalla) y subir al foro de contribuciones:contentReference[oaicite:1]{index=1}.  
