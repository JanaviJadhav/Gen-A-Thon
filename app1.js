const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");
const apiKey = "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";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value;
  input.value = "";

  messages.innerHTML += `<div class="message user-message">
  <img src="https://imgs.search.brave.com/2DfwnE4QsDnn6hLMAXltGWWpAhDp_NUI6RcfAFVE7a8/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93aW5h/ZXJvLmNvbS9ibG9n/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE3/LzEyL1VzZXItaWNv/bi0yNTYtYmx1ZS5w/bmc" alt="user icon"> <span>${message}</span>
  </div>`;
  const response = await axios.post(
    "https://api.openai.com/v1/completions",
    {
      prompt:message,
      model: "text-davinci-003",
      temperature: 0,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  const chatbotResponse = response.data.choices[0].text;
const speakButton = document.getElementById("speak-button");

speakButton.addEventListener("click", () => {
  const chatbotResponse = response.data.choices[0].text;
  speakText(chatbotResponse);
});

function speakText(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.voice = speechSynthesis.getVoices()[0]; 
  utterance.rate = 1;
  synth.speak(utterance);
}

  messages.innerHTML += `<div class="message bot-message">
  <img src="https://imgs.search.brave.com/4sC7Ugy_ppFFFLJmLqzE9xPSz-H7K6T8VKU9XKCOw-A/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMTUvQ2hh/dEJvdC1QTkctUGlj/dHVyZS5wbmc" alt="bot icon"> <span>${chatbotResponse}</span>
  </div>`;
});