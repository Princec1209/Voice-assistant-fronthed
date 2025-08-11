const BACKEND_URL = "https://voice-ai-backend-m1y1.onrender.com";

const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const responseEl = document.getElementById("response");

startBtn.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.start();
    statusEl.textContent = "Listening... 🎤";

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        statusEl.textContent = `You said: "${transcript}"`;
        responseEl.textContent = "Thinking... 🤖";

        try {
            const res = await fetch(`${BACKEND_URL}/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: transcript }),
            });

            const data = await res.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

            responseEl.textContent = reply;
            speak(reply);
        } catch (err) {
            console.error(err);
            responseEl.textContent = "Error communicating with AI.";
        }
    };

    recognition.onerror = (event) => {
        statusEl.textContent = `Error: ${event.error}`;
    };

    recognition.onend = () => {
        statusEl.textContent += " (Click button to speak again)";
    };
});

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
}
