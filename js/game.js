import { obtenerProgreso, guardarProgreso } from './storage.js';

let vocabularioTotal = [];
let palabrasUsadas = obtenerProgreso();
let vocabularioPendiente = new Set();

export async function inicializarJuego() {
    const respuesta = await fetch('data/vocabulario.json');
    vocabularioTotal = await respuesta.json();

    // Filtramos las palabras que ya se han usado usando el Set para mayor velocidad
    const usadasSet = new Set(palabrasUsadas);
    vocabularioPendiente = new Set(vocabularioTotal.filter(p => !usadasSet.has(p)));
}

export function obtenerPalabrasAleatorias(cantidad = 15) {
    const pendientesArray = Array.from(vocabularioPendiente);
    // Mezcla aleatoria
    const mezcladas = pendientesArray.sort(() => 0.5 - Math.random());
    return mezcladas.slice(0, Math.min(cantidad, mezcladas.length));
}

export function procesarFrase(frase) {
    // Convierte a minúsculas y extrae solo letras (soporta tildes y ñ)
    const palabrasLimpias = frase.toLowerCase().match(/[\wáéíóúñü]+/g) || [];
    const nuevasEncontradas = [];

    palabrasLimpias.forEach(palabra => {
        if (vocabularioPendiente.has(palabra)) {
            nuevasEncontradas.push(palabra);
            vocabularioPendiente.delete(palabra); // La sacamos de pendientes
            palabrasUsadas.push(palabra);         // La guardamos en el progreso
        }
    });

    if (nuevasEncontradas.length > 0) {
        guardarProgreso(palabrasUsadas);
    }

    return nuevasEncontradas;
}

export function obtenerEstadisticas() {
    return {
        total: vocabularioTotal.length,
        usadas: palabrasUsadas.length,
        pendientes: vocabularioPendiente.size
    };
}
