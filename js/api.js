import { obtenerApiKey } from "./storage.js";

export async function revisarFraseConGrok(frase) {
  const apiKey = obtenerApiKey();
  if (!apiKey) {
    throw new Error("No hay API Key configurada. Por favor, guárdala primero.");
  }

  const prompt = `Actúa como un profesor de idiomas. El estudiante ha escrito: "${frase}".
    1) Corrige la frase si hay errores gramaticales o de naturalidad.
    2) Proporciona un ejemplo alternativo.
    Responde ÚNICAMENTE con un JSON válido con este formato exacto:
    {"es_coherente": true, "correccion": "texto corregido", "ejemplo_adicional": "texto de ejemplo"}`;

  // 1. URL de Groq
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // 2. Modelo gratuito de Groq
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Error al conectar con la API de Groq.");
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

export async function obtenerDefinicionPalabra(palabra) {
  const apiKey = obtenerApiKey();
  if (!apiKey) {
    throw new Error("No hay API Key configurada.");
  }

  const prompt = `Actúa como un diccionario conciso. Para la palabra "${palabra}":
    1) Da su traducción al inglés.
    2) Da una definición breve y clara en español.
    3) Da un ejemplo de uso breve en español con su traducción al inglés.
    Responde ÚNICAMENTE con un JSON válido con este formato:
    {
      "palabra": "${palabra}",
      "traduccion_en": "traducción al inglés",
      "significado": "definición corta en español",
      "ejemplo": "frase de ejemplo en español (traducción en inglés)"
    }`;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    },
  );

  if (!response.ok) {
    throw new Error("No se pudo obtener el significado.");
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
