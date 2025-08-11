const BACKEND_URL = "https://voice-ai-backend-m1y1.onrender.com";
let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    alert("Your browser doesn't support speech recognition.");
}
if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
}
function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    synth.speak(utterance);
}
async function sendToAI(message) {
    try {
        const res = await fetch(`${BACKEND_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });
        const data = await res.json();

        if (data && data.reply) {
            document.getElementById("response").innerText = data.reply;
            speak(data.reply);
        } else {
            document.getElementById("response").innerText = "No reply from AI.";
        }
    } catch (err) {
        console.error(err);
        document.getElementById("response").innerText = "Error contacting AI.";
    }
}
function startListening() {
    if (!recognition) return;
    recognition.start();
    document.getElementById("status").innerText = "Listening... 🎤";
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById("userText").innerText = transcript;
        sendToAI(transcript);
    };
    recognition.onerror = (err) => {
        console.error(err);
        document.getElementById("status").innerText = "Error listening.";
    };
    recognition.onend = () => {
        document.getElementById("status").innerText = "Click to speak again.";
    };
}
document.getElementById("startBtn").addEventListener("click", startListening);
