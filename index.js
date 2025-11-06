const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBody = document.getElementById("chat-body");

function addMessage(message, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = message;
  messageDiv.appendChild(bubble);
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function handleSend() {
  const input = userInput.value.trim();
  if (input === "") return;
  addMessage(input, "user");
  userInput.value = "";

  // Loading message
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("message", "bot");
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = "Qubi is typing...";
  loadingDiv.appendChild(bubble);
  chatBody.appendChild(loadingDiv);

  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();

    loadingDiv.remove();
    addMessage(data.reply, "bot");
  } catch (err) {
    loadingDiv.remove();
    addMessage("⚠️ Error: Could not connect to server.", "bot");
    console.error(err);
  }
}

sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});
