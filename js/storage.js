export function obtenerProgreso() {
    return JSON.parse(localStorage.getItem('palabrasUsadas')) || [];
}

export function guardarProgreso(palabras) {
    localStorage.setItem('palabrasUsadas', JSON.stringify(palabras));
}

export function guardarApiKey(key) {
    localStorage.setItem('grokApiKey', key);
}

export function obtenerApiKey() {
    return localStorage.getItem('grokApiKey');
}
