const devices = [
  { name: "iPad Mini 5", gyro: "300 / 350 / 180 / 120", nongyro: "150 / 170 / 120 / 100" },
  { name: "iPhone 13", gyro: "320 / 400 / 200 / 150", nongyro: "180 / 200 / 150 / 120" },
  { name: "Redmi Note 12", gyro: "280 / 340 / 180 / 130", nongyro: "160 / 180 / 130 / 110" },
  { name: "POCO X3 Pro", gyro: "310 / 380 / 190 / 140", nongyro: "170 / 190 / 140 / 120" },
  { name: "Samsung S23", gyro: "350 / 420 / 210 / 160", nongyro: "190 / 210 / 160 / 130" },
];

const searchBox = document.getElementById("searchBox");
const suggestions = document.getElementById("suggestions");
const resultCard = document.getElementById("result");
const deviceName = document.getElementById("deviceName");
const gyro = document.getElementById("gyro");
const nongyro = document.getElementById("nongyro");

searchBox.addEventListener("input", () => {
  const query = searchBox.value.toLowerCase();
  suggestions.innerHTML = "";

  if (!query) return;

  const matches = devices.filter(d => d.name.toLowerCase().includes(query));
  matches.forEach(d => {
    const li = document.createElement("li");
    li.textContent = d.name;
    li.onclick = () => showDevice(d);
    suggestions.appendChild(li);
  });
});

function showDevice(device) {
  deviceName.textContent = device.name;
  gyro.textContent = device.gyro;
  nongyro.textContent = device.nongyro;
  resultCard.classList.remove("hidden");
  suggestions.innerHTML = "";
  searchBox.value = device.name;
}

// === ChatGPT Integration ===
const chatBox = document.getElementById("chat-box");
const userMessage = document.getElementById("userMessage");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
userMessage.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const message = userMessage.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userMessage.value = "";

  appendMessage("bot", "Thinking...");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "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"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert in PUBG Mobile sensitivity and device optimization. Always respond like a pro gamer assistant from Khan’s website." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;
    updateLastBotMessage(botReply);
  } catch (error) {
    updateLastBotMessage("⚠️ Error connecting to AI. Check your API key.");
  }
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateLastBotMessage(text) {
  const lastBot = document.querySelector(".message.bot:last-child");
  if (lastBot) lastBot.textContent = text;
}
