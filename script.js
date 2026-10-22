// La caisse du premier exercice est corrigée dans le dossier register/ (pour partir sur de bonnes bases).
// Tu y touches seulement quand une étape te le demande.

// ============================================================
// L'IA du comptoir. Ton code, une section par étape.
// ============================================================

// Étape 1 · Parler à Qwen
const MODEL_NAME = "sesame";

// L'adresse d'Ollama sur ta machine : 11434 est le port où il écoute
const OLLAMA_URL = "http://localhost:11434/api/chat";

const form = document.querySelector("#ai-order-form");
const input = document.querySelector("#ai-order-input");
const message = document.querySelector("#ai-order-message");

const orderMessages = [];

function setMessageContent(textContent) {
    orderMessages.push(textContent);
}

async function askModel(messages) {
    const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
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

    // Nouveau client : on repart d'une liste de messages vide
    orderMessages.length = 0;
    const messages = [{role: "system", content: orderPrompt},
        { role: "user", content: text }];

    try {
        // ANCIEN : setMessageContent("Qwen prend la commande…");
        // Ce message doit se voir PENDANT l'attente : on l'écrit directement
        message.textContent = "Qwen prend la commande…";
        setSubmitDisabled(true);

        const reply = await askModel(messages);
        const qwenOrder = JSON.parse(reply);

        if (qwenOrder.lines.length > 0) {
            const addedCount = addTicketLines(qwenOrder.lines);
            if (addedCount > 0) {
                setMessageContent("Qwen a pris la commande.");
            }
        } else {
            setMessageContent("Qwen n'a trouvé aucun article de la carte.");
        }
    } catch (err) {
        setMessageContent("Erreur : " + err.message);
    } finally {
        input.value = "";
        setSubmitDisabled(false);
        // Un seul endroit pour afficher, quel que soit le chemin suivi
        displayOrderMessages(orderMessages);
    }
});

function setSubmitDisabled(isDisabled) {
    const btnSubmit = form.querySelector('[type="submit"]');
    btnSubmit.disabled = isDisabled;
}

// Étape 2 · La carte dans le prompt système
const promptMenu = menu.map((item) => ({id: item.id, name: item.name}));

const orderPrompt = `Tu prends les commandes au comptoir du café Sésame.
Voici la carte : ${JSON.stringify(promptMenu)}

Pour chaque produit commandé, renvoie son id et sa quantité dans "lines".
Ne remplace jamais un produit absent de la carte par un produit qui lui ressemble : ignore-le simplement.`;

// Étape 3 · Une réponse en JSON
const ORDER_FORMAT = {
    type: "object",
    properties: {
        lines: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: {type: "integer"},
                    quantity: {type: "integer"},
                    customer: {type: "string"},
                },
                required: ["id", "quantity"],
            },
        },
    },
    required: ["lines"],
};

// Étape 4 · Le ticket se remplit
function addTicketLines(lines) {
    let addedCount = 0;
    for (const line of lines) {
        const item = menu.find((tmpItem) => tmpItem.id === line.id);
        if (!item) {
            setMessageContent(`L'article n°${line.id} n'existe pas.`);
        } else if (!item.available) {
            setMessageContent(`${item.name} est épuisé.`);
        } else if (line.quantity <= 0 || line.quantity > 10 || !Number.isInteger(line.quantity)) {
            setMessageContent(`${item.name} : quantité invalide (${line.quantity}), entre 1 et 10.`);
        } else {
            for (let i = 0; i < line.quantity; i++) {
                order.add(item);
            }
            addedCount++;
        }
    }
    renderTicket();
    return addedCount;
}

// Étape 5 · La caisse décide
function displayOrderMessages(orderMessages) {
    // ANCIEN :
    // for (const orderMessage of orderMessages) {
    //     this.message.textContent += "\n" + orderMessage.textContent;
    // }
    message.textContent = orderMessages.join("\n");
}

// Étape 6 · Quand l'IA ne répond pas


// Étape 7 · Le prénom aussi


// Étape 8 · Le conseil du barista


// Bonus


// Premier affichage
renderMenu("all");
renderTicket();
