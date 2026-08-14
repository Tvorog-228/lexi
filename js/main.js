import {
  inicializarJuego,
  obtenerPalabrasAleatorias,
  procesarFrase,
  obtenerEstadisticas,
} from "./game.js";
import { revisarFraseConGrok, obtenerDefinicionPalabra } from "./api.js";
import { guardarApiKey, obtenerApiKey } from "./storage.js";

// Elementos del DOM
const ui = {
  wordContainer: document.getElementById("word-container"),
  userInput: document.getElementById("user-input"),
  btnEnviar: document.getElementById("btn-enviar"),
  stats: document.getElementById("stats"),
  feedbackArea: document.getElementById("feedback-area"),
  palabrasCazadas: document.getElementById("palabras-cazadas"),
  iaFeedback: document.getElementById("ia-feedback"),
  apiKeyInput: document.getElementById("api-key-input"),
  btnGuardarKey: document.getElementById("btn-guardar-key"),
  // Modal
  modal: document.getElementById("modal-significado"),
  modalPalabra: document.getElementById("modal-palabra"),
  modalTraduccion: document.getElementById("modal-traduccion"),
  modalDefinicion: document.getElementById("modal-definicion"),
  modalEjemplo: document.getElementById("modal-ejemplo"),
  btnCerrarModal: document.getElementById("btn-cerrar-modal"),
};

// Carga inicial
document.addEventListener("DOMContentLoaded", async () => {
  if (obtenerApiKey()) {
    ui.apiKeyInput.value = obtenerApiKey();
  }

  await inicializarJuego();
  actualizarInterfaz();
});

// Guardar API Key
ui.btnGuardarKey.addEventListener("click", () => {
  const key = ui.apiKeyInput.value.trim();
  if (key) {
    guardarApiKey(key);
    alert("API Key guardada localmente.");
  }
});

// Cerrar Modal
ui.btnCerrarModal.addEventListener("click", () => {
  ui.modal.classList.add("oculto");
});

// Cerrar modal al hacer clic fuera del recuadro blanco
window.addEventListener("click", (e) => {
  if (e.target === ui.modal) {
    ui.modal.classList.add("oculto");
  }
});

// Enviar frase
ui.btnEnviar.addEventListener("click", async () => {
  const frase = ui.userInput.value.trim();
  if (!frase) return;

  ui.btnEnviar.disabled = true;
  ui.btnEnviar.textContent = "Revisando...";

  try {
    const encontradas = procesarFrase(frase);
    const feedback = await revisarFraseConGrok(frase);

    mostrarResultados(encontradas, feedback);
    ui.userInput.value = "";
    actualizarInterfaz();
  } catch (error) {
    alert(error.message);
  } finally {
    ui.btnEnviar.disabled = false;
    ui.btnEnviar.textContent = "Revisar Frase";
  }
});

function actualizarInterfaz() {
  const palabrasSugeridas = obtenerPalabrasAleatorias(15);
  ui.wordContainer.innerHTML = "";

  palabrasSugeridas.forEach((palabra) => {
    const span = document.createElement("span");
    span.className = "word-chip";
    span.textContent = palabra;
    span.title = "Haz clic para ver significado y traducción";

    // Evento de clic para consultar significado
    span.addEventListener("click", () => mostrarSignificado(palabra));

    ui.wordContainer.appendChild(span);
  });

  const stats = obtenerEstadisticas();
  ui.stats.textContent = `Progreso: ${stats.usadas} / ${stats.total} palabras (${stats.pendientes} restantes)`;
}

async function mostrarSignificado(palabra) {
  // Abrir modal con estado de carga
  ui.modalPalabra.textContent = palabra;
  ui.modalTraduccion.textContent = "Cargando...";
  ui.modalDefinicion.textContent = "Consultando...";
  ui.modalEjemplo.textContent = "...";
  ui.modal.classList.remove("oculto");

  try {
    const data = await obtenerDefinicionPalabra(palabra);
    ui.modalTraduccion.textContent = data.traduccion_en;
    ui.modalDefinicion.textContent = data.significado;
    ui.modalEjemplo.textContent = data.ejemplo;
  } catch (err) {
    ui.modalDefinicion.textContent = `Error: ${err.message}`;
    ui.modalTraduccion.textContent = "-";
    ui.modalEjemplo.textContent = "-";
  }
}

function mostrarResultados(encontradas, feedback) {
  ui.feedbackArea.classList.remove("oculto");

  ui.palabrasCazadas.textContent =
    encontradas.length > 0
      ? encontradas.join(", ")
      : "Ninguna palabra nueva en esta ronda.";

  ui.iaFeedback.innerHTML = `
        <p><strong>Corrección de IA:</strong> ${feedback.correccion}</p>
        <p><strong>Ejemplo alternativo:</strong> ${feedback.ejemplo_adicional}</p>
    `;
}
