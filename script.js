const chatBox = document.getElementById("chat");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// Enviar mensaje
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  addMessage("user", text);
  userInput.value = "";

  // Respuesta del bot
  addMessage("bot", "Escribiendo...");
  const reply = await getBotResponse(text);
  replaceLastBotMessage(reply);
});

function addMessage(who, text) {
  const div = document.createElement("div");
  div.classList.add("message", who);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function replaceLastBotMessage(text) {
  const messages = chatBox.querySelectorAll(".bot");
  const last = messages[messages.length - 1];
  if (last) last.textContent = text;
}

// Llamada a OpenAI
async function getBotResponse(prompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: "Eres un asistente empático que da consejos psicológicos generales, pero NO sustituyes atención profesional." },
                   { role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return "Lo siento, hubo un error al procesar tu mensaje.";
  }
}

// Buscar centros cercanos en Google Maps
document.getElementById("find-centers").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Tu navegador no soporta geolocalización.");
    return;
  }

  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    const q = encodeURIComponent("centro ayuda psicológica");
    window.open(`https://www.google.com/maps/search/${q}/@${latitude},${longitude},14z`, "_blank");
  });
});
