# Lexi

Lexi es una aplicación web para aprender y repasar vocabulario construyendo frases. Las palabras utilizadas se eliminan de la lista principal hasta completar todo el vocabulario disponible, con correcciones gramaticales automáticas mediante la API de Groq.

## Características

- Repaso activo mediante creación de oraciones.
- Sugerencia de 15 palabras aleatorias por ronda.
- Corrección de texto y sugerencias con IA (Llama 3.3 en Groq).
- Consulta de definición y traducción al inglés al hacer clic en cada palabra.
- Guardado local en el navegador (localStorage) para la API key y el progreso.
- Compatible con GitHub Pages (sin servidor backend).

## Estructura de Archivos

lexi/
├── index.html           Interfaz de usuario
├── css/style.css        Estilos visuales
├── data/vocabulario.json Lista de palabras
├── js/
│   ├── main.js          Controlador principal
│   ├── game.js          Lógica de palabras y progreso
│   ├── api.js           Llamadas a la API de Groq
│   └── storage.js       Persistencia en localStorage
└── README.md            Documentación


