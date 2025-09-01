// If you deploy backend and frontend together, this is fine:
const socket = io(); // auto targets same origin

// If hosting frontend elsewhere, use the backend URL instead:
// const socket = io("https://your-backend.onrender.com", { transports: ["websocket", "polling"] });

const joinForm = document.getElementById("join-form");
const chat = document.getElementById("chat");
const roomLabel = document.getElementById("room-label");
const messages = document.getElementById("messages");
const typing = document.getElementById("typing");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

let state = { room: "general", username: "", typingTimer: null };

function addMessage({ username, text, id, ts }) {
  const li = document.createElement("li");
  if (id === socket.id) li.classList.add("me");
  const time = ts ? new Date(ts).toLocaleTimeString() : "";
  li.textContent = `[${time}] ${username}: ${text}`;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}

joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const room = document.getElementById("room").value.trim() || "general";
  state.username = username;
  state.room = room;

  socket.emit("join", { room, username });
  roomLabel.textContent = `Room: ${room}`;
  joinForm.classList.add("hidden");
  chat.classList.remove("hidden");
  messageInput.focus();
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;
  socket.emit("message", { room: state.room, text });
  messageInput.value = "";
});

messageInput.addEventListener("input", () => {
  socket.emit("typing", { room: state.room, isTyping: true });
  clearTimeout(state.typingTimer);
  state.typingTimer = setTimeout(() => {
    socket.emit("typing", { room: state.room, isTyping: false });
  }, 1200);
});

socket.on("message", (payload) => addMessage(payload));
socket.on("system", (text) => addMessage({ username: "system", text }));
socket.on("typing", ({ username, isTyping }) => {
  typing.textContent = isTyping ? `${username} is typing…` : "";
});
