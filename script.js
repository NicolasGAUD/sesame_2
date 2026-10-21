// La caisse du premier exercice est corrigée dans le dossier register/ (pour partir sur de bonnes bases).
// Tu y touches seulement quand une étape te le demande.

// ============================================================
// L'IA du comptoir. Ton code, une section par étape.
// ============================================================

// Étape 1 · Parler à Qwen
const MODEL_NAME = "sesame";

// L'adresse d'Ollama sur ta machine : 11434 est le port où il écoute
const OLLAMA_URL = "http://localhost:11434/api/chat";

const messages = [];

const form = document.querySelector("#ai-order-form");
const input = document.querySelector("#ai-order-input");
const message = document.querySelector("#ai-order-message");

async function askModel(messages) {
    const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages: messages,
            think: false, // pas de brouillon « Thinking… » : la réponse directement
            stream: false, // la réponse en un seul bloc, quand elle est finie
        }),
    });

    const data = await response.json();

    // response.ok vaut false si Ollama a répondu par une erreur (modèle introuvable...)
    if (!response.ok) {
        throw new Error(data.error);
    }

    return data.message.content;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    messages.push({ role: "user", content: text });

    try {
        const reply = await askModel(messages);
        messages.push({ role: "assistant", content: reply });
        message.textContent = reply;
    } catch (err) {
        message.textContent = "Erreur : " + err.message;
    }
});

// Étape 2 · La carte dans le prompt système
const mappedMenu = menu.map((item) => [item.id, item.name]);

const SYSTEM_PROMPT = `Tu es le barista du café Sésame. Voici la carte :
${JSON.stringify(mappedMenu)}
Ne propose que des produits de cette carte.`;

messages.push({ role: "system", content: SYSTEM_PROMPT });

// Étape 3 · Une réponse en JSON


// Étape 4 · Le ticket se remplit


// Étape 5 · La caisse décide


// Étape 6 · Quand l'IA ne répond pas


// Étape 7 · Le prénom aussi


// Étape 8 · Le conseil du barista


// Bonus


// Premier affichage
renderMenu("all");
renderTicket();
