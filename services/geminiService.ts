import { GoogleGenAI } from "@google/genai";

// Helper to get the API Key safely
const getApiKey = (): string => {
  // 1. Intento directo con sintaxis estándar de Vite
  try {
    // @ts-ignore
    const viteKey = import.meta.env.VITE_API_KEY;
    if (viteKey && viteKey.length > 10) return viteKey;
  } catch (e) {
    // Ignorar
  }

  // 2. Fallbacks de entorno (process.env)
  if (typeof process !== 'undefined' && process.env) {
    const envKey = process.env.VITE_API_KEY || process.env.REACT_APP_API_KEY || process.env.API_KEY;
    if (envKey && envKey.length > 10) return envKey;
  }

  // 3. FALLBACK DE EMERGENCIA (Clave proporcionada manualmente)
  return 'AIzaSyD_RUlrw7gaL4zuuSXx8-t1xYat2DatiQ4';
};

export const chatWithTutor = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  const apiKey = getApiKey().trim();

  if (!apiKey) {
    return "⚠️ Error crítico: No hay API Key configurada.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Lista de modelos a probar en orden de preferencia
  // El sistema pide gemini-3, pero si falla, usamos el 2.0-flash-exp que es muy estable
  const modelsToTry = ['gemini-3-flash-preview', 'gemini-2.0-flash-exp'];

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`🤖 Intentando conectar con modelo: ${model}...`);
      
      const chat = ai.chats.create({
        model: model,
        history: history,
        config: {
          systemInstruction: `Eres un experto profesor de farmacología cardiovascular. 
          Objetivo: Enseñar insuficiencia cardíaca, inotrópicos, diuréticos, antiarrítmicos.
          Estilo: Amigable, usa analogías, responde en español de forma concisa (máximo 3 párrafos).
          Si te preguntan algo fuera de medicina, responde cortésmente que solo hablas de farmacología.`,
        }
      });

      const result = await chat.sendMessage({ message });
      console.log(`✅ Éxito con ${model}`);
      return result.text;
      
    } catch (error: any) {
      console.warn(`⚠️ Falló el modelo ${model}:`, error.message);
      lastError = error;
      // Si es el último modelo y falló, no hacemos nada, el loop terminará
      // y manejaremos el error abajo.
    }
  }

  // Si llegamos aquí, todos los modelos fallaron
  console.error("❌ Todos los intentos fallaron. Último error:", lastError);
  
  if (lastError?.message?.includes('404') || lastError?.toString().includes('Not Found')) {
     return "⚠️ Error 404: Los modelos de IA no están disponibles para esta clave o región actualmente. Intenta más tarde.";
  }
  if (lastError?.message?.includes('429')) {
     return "⏳ Sistema saturado (Error 429). Por favor espera 30 segundos e intenta de nuevo.";
  }
  if (lastError?.message?.includes('403') || lastError?.message?.includes('API key')) {
     return "⛔ Error de Clave: La API Key no es válida o tiene restricciones. Verifica en Google AI Studio.";
  }

  return `😵 Error técnico: ${lastError?.message || 'Desconocido'}.`;
};

export const generateQuizExplanation = async (question: string, answer: string) => {
    const apiKey = getApiKey().trim();
    if (!apiKey) return "Error: API Key faltante.";

    const ai = new GoogleGenAI({ apiKey });
    // Para tareas simples, intentamos el modelo más rápido directamente
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp', // Usamos 2.0 para quiz por velocidad y estabilidad
            contents: `Explica en una sola frase por qué "${answer}" es relevante para: "${question}" (Farmacología).`,
        });
        return response.text;
    } catch (error) {
        // Si falla, intentamos el 3-flash
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Explica en una sola frase por qué "${answer}" es relevante para: "${question}" (Farmacología).`,
            });
            return response.text;
        } catch (e) {
            console.error("Error generating explanation:", e);
            return "";
        }
    }
}