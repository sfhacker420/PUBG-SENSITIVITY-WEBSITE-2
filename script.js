// ====================
// PUBG Sensitivity Finder - BR MASOOM
// ====================

// === Devices database (starter) ===
const devices = [
  { name: "iPad Mini 5", gyro: "300 / 350 / 180 / 120", nongyro: "150 / 170 / 120 / 100" },
  { name: "iPhone 13", gyro: "320 / 400 / 200 / 150", nongyro: "180 / 200 / 150 / 120" },
  { name: "Redmi Note 12", gyro: "280 / 340 / 180 / 130", nongyro: "160 / 180 / 130 / 110" },
  { name: "POCO X3 Pro", gyro: "310 / 380 / 190 / 140", nongyro: "170 / 190 / 140 / 120" },
  { name: "Samsung S23", gyro: "350 / 420 / 210 / 160", nongyro: "190 / 210 / 160 / 130" },
];

// === DOM refs ===
const searchBox = document.getElementById('searchBox');
const suggestions = document.getElementById('suggestions');
const resultCard = document.getElementById('result');
const deviceName = document.getElementById('deviceName');
const gyro = document.getElementById('gyro');
const nongyro = document.getElementById('nongyro');
const copyBtn = document.getElementById('copyBtn');

// Chat refs
const chatBox = document.getElementById('chat-box');
const userMessage = document.getElementById('userMessage');
const sendBtn = document.getElementById('sendBtn');

// === Search behavior ===
searchBox.addEventListener('input', () => {
  const q = searchBox.value.trim().toLowerCase();
  suggestions.innerHTML = '';
  if (!q) return;
  const matches = devices.filter(d => d.name.toLowerCase().includes(q));
  matches.forEach(d => {
    const li = document.createElement('li');
    li.textContent = d.name;
    li.onclick = () => showDevice(d);
    suggestions.appendChild(li);
  });
});

function showDevice(d){
  deviceName.textContent = d.name;
  gyro.textContent = d.gyro;
  nongyro.textContent = d.nongyro;
  resultCard.classList.remove('hidden');
  suggestions.innerHTML = '';
  searchBox.value = d.name;
}

// copy
copyBtn && copyBtn.addEventListener('click', ()=> {
  const text = `Device: ${deviceName.textContent}\nGyro: ${gyro.textContent}\nNon-Gyro: ${nongyro.textContent}`;
  navigator.clipboard.writeText(text).then(()=> {
    copyBtn.textContent = 'Copied!';
    setTimeout(()=> copyBtn.textContent = 'Copy Settings',1500);
  });
});

// === ChatGPT integration ===
// WARNING: Using an API key client-side exposes it publicly. For production, create a server/proxy.
// Set your OpenAI key here BEFORE deploying (replace the placeholder).
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE";

// Basic system prompt tailored to BR MASOOM brand
const SYSTEM_PROMPT = "You are BR MASOOM's PUBG Sensitivity Assistant. Provide concise, expert sensitivity settings, explain gyroscope vs non-gyro differences briefly, and give practical tips. When possible, reference device-specific suggestions.";

// UI helpers
function appendMessage(sender, text){
  const div = document.createElement('div');
  div.className = 'message ' + (sender === 'user' ? 'user' : 'bot');
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateLastBotMessage(text){
  const last = [...chatBox.querySelectorAll('.message.bot')].pop();
  if (last) last.textContent = text;
}

// handle send
sendBtn.addEventListener('click', sendMessage);
userMessage.addEventListener('keypress', (e)=> { if(e.key==='Enter') sendMessage(); });

async function sendMessage(){
  const msg = userMessage.value.trim();
  if(!msg) return;
  appendMessage('user', msg);
  userMessage.value = '';
  appendMessage('bot', 'Thinking...');
  // If API key not set, provide helpful fallback using local DB
  if(!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY_HERE"){
    // Simple local fallback: try to find device and respond
    const q = msg.toLowerCase();
    const found = devices.find(d => q.includes(d.name.toLowerCase()));
    if(found){
      const reply = `Here's a suggested setup for ${found.name}:\nGyro: ${found.gyro}\nNon-Gyro: ${found.nongyro}\nTip: Try small increments and test in training mode.`;
      updateLastBotMessage(reply);
      return;
    } else {
      updateLastBotMessage("AI is not enabled (no API key). I couldn't find a matching device in the local database. Add your OpenAI API key in script.js to enable full AI replies.");
      return;
    }
  }

  try{
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method:'POST',
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages:[
          {role:"system", content: SYSTEM_PROMPT},
          {role:"user", content: msg}
        ],
        temperature: 0.2,
        max_tokens: 500
      })
    });
    if(!res.ok){
      const text = await res.text();
      updateLastBotMessage("Error from OpenAI: " + res.status + " — " + text);
      return;
    }
    const data = await res.json();
    const botReply = data.choices?.[0]?.message?.content || "No reply from AI.";
    updateLastBotMessage(botReply);
  }catch(err){
    updateLastBotMessage("Network or fetch error: " + err.message);
  }
}
