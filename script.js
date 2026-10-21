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
            format: ORDER_FORMAT,
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
        messages.push({ role: "assistant", content: JSON.parse(reply) });
        message.textContent = JSON.stringify(reply);
    } catch (err) {
        message.textContent = "Erreur : " + err.message;
    }
});

// Étape 2 · La carte dans le prompt système
const mappedMenu = menu.map((item) => [item.id, item.name]);

const SYSTEM_PROMPT = `Tu es le barista du café Sésame. Voici la carte :
${mappedMenu}
Tu transformes la commande du client en JSON :
- "lines" : les produits de la carte commandés, avec leur id et leur quantité.
- "unknown" : les produits demandés qui ne sont PAS sur la carte, tels que le client les a écrits.

Ne remplace jamais un produit absent par un produit qui lui ressemble.
Un produit indisponible ou absent de la carte va dans "unknown".

Exemple : « un latte et un moka » → {"lines":[{"id":6,"quantity":1}],"unknown":["moka"]}`;

messages.push({ role: "system", content: SYSTEM_PROMPT });

// Étape 3 · Une réponse en JSON
const ORDER_FORMAT = {
    type: "object",
    properties: {
        lines: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        enum: menu.filter((item) => item.available).map((item) => item.id),
                    },
                    quantity: { type: "integer", minimum: 1 },
                },
                required: ["id", "quantity"],
            },
        },
    },
    required: ["lines", "unknown"],
};

// Étape 4 · Le ticket se remplit


// Étape 5 · La caisse décide


// Étape 6 · Quand l'IA ne répond pas


// Étape 7 · Le prénom aussi


// Étape 8 · Le conseil du barista


// Bonus


// Premier affichage
renderMenu("all");
renderTicket();
