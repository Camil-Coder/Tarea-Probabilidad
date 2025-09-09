# 📊 Tarea de Probabilidad — Visualización y Comparación de Ciudades

Este proyecto es una herramienta web interactiva que permite **cargar un archivo Excel con datos climáticos** y analizar variables como **temperatura** y **velocidad del viento** en diferentes municipios.  

La página ayuda a generar:
- **Histogramas** con tablas de frecuencias y estadísticas básicas.  
- **Diagramas de caja y bigotes (boxplots)** para comparar dos ciudades lado a lado.  

🔗 **Acceso directo a la página (GitHub Pages):**  
👉 [Tarea de Probabilidad — Demo](https://camil-coder.github.io/Tarea-Probabilidad/)  

---

## 📂 Dataset

Los datos corresponden a variables climáticas de municipios de Colombia (fecha, temperatura, precipitaciones, dirección y velocidad del viento, presión y municipio).  

🔗 **Descargar dataset en Excel (Google Drive):**  
👉 [Datos.xlsx](https://docs.google.com/spreadsheets/d/1Pge_VHT3I6cX82JjEbzDE3XHw2WlN7Yy/edit?usp=sharing&ouid=114414469650664391493&rtpof=true&sd=true)  

---

## 🚀 Cómo usar la herramienta

### 1) Parte 1 — Histogramas y estadísticas
- **Paso 1:** Cargar el archivo Excel con el botón **📂 Seleccionar archivo**.  
- **Paso 2:** Seleccionar un **municipio** y una **variable numérica** (ej. `vel_viento (m/s)` o `T (°C)`).  
- **Paso 3:** Definir el número de **bins (intervalos)** para el histograma.  
- **Paso 4:** Usar los botones:
  - **Mostrar datos:** ver la tabla filtrada del municipio.  
  - **Generar histograma:** ver la distribución + estadísticas (n, media, sd, CV) + tabla de frecuencias.  

📸 **Ejemplo de histograma (Barranquilla, velocidad del viento):**  
![Histograma](https://drive.google.com/uc?export=view&id=1XLrYhJ7Fju87saY1Bar3MthNK4w_OKFO)

---

### 2) Parte 2 — Comparación de ciudades con boxplots
Desde la misma página de GitHub Pages puedes acceder a la **Parte 2 (part2.html)** para comparar dos ciudades.  

- **Paso 1:** Cargar el mismo archivo Excel.  
- **Paso 2:** Seleccionar dos municipios distintos (ej. Barranquilla vs Medellín).  
- **Paso 3:** Seleccionar la variable de interés.  
- **Paso 4:** Presionar **Generar boxplot** para ver la comparación.  
- Además del gráfico, se muestra una tabla con estadísticas básicas por ciudad:
  - n, media, desviación estándar, mediana, Q1, Q3, CV (%).  

📸 **Ejemplo de comparación (Boxplot Barranquilla vs Medellín):**  
![Boxplot](https://drive.google.com/uc?export=view&id=1PwEGSWp8PeYF9TtuSGPnFMxKsILHhQnZ)

---

## 📦 Estructura del proyecto

- `index.html` → página principal (histogramas).  
- `app.js` → lógica para cargar Excel, filtrar datos, generar histogramas y estadísticas.  
- `part2.html` → comparación de dos ciudades con boxplots.  
- `part2.js` → lógica de boxplots y estadísticas por ciudad.  
- `style.css` → estilos oscuros, botones estilizados, tablas con scroll.  

---

## ✨ Funcionalidades

- [x] Cargar archivo Excel y detectar columnas automáticamente.  
- [x] Seleccionar municipio y variable para generar histogramas.  
- [x] Calcular estadísticas básicas: media, desviación estándar, coeficiente de variación (CV).  
- [x] Mostrar tabla de frecuencias por intervalos (bins configurables).  
- [x] Comparar dos ciudades con **diagramas de caja y bigotes (boxplots)**.  
- [x] Mostrar tabla comparativa de estadísticas por ciudad (mediana, Q1, Q3 incluidas).  

---

## 📌 Notas

- El dataset recomendado es el entregado en la **guía de probabilidad**:contentReference[oaicite:0]{index=0}.  
- Esta herramienta facilita cumplir con la **Semana 3 (Actividad 1)** de la tarea:  
  - Histogramas de viento y temperatura.  
  - Cálculo del CV y análisis de variabilidad.  
  - Comparación entre ciudades con boxplots.  
- Los gráficos y tablas se pueden exportar como imágenes (captura de pantalla) para ser compartidos en el foro de contribuciones:contentReference[oaicite:1]{index=1}.  
