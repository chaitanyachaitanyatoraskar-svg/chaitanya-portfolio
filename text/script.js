function playSpeech(text) {
    if (text.trim() !== "") {
        window.speechSynthesis.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
}

// Fixed speakText
function speakText() {
    const text = document.getElementById('textInput').value;
    playSpeech(text);
}

// Fixed speakFile logic
async function speakFile() {
    const fileInput = document.querySelector('#fileInput'); // Corrected ID
    const display = document.getElementById('display');

    if (fileInput.files.length === 0) {
        display.innerText = "Please select a file first.";
        return;
    }

    const file = fileInput.files[0];
    try {
        const content = await file.text(); // Using the .text() method we discussed
        display.innerText = "Reading: " + file.name;
        playSpeech(content);
    } catch (error) {
        display.innerText = "Error reading file.";
        console.error(error);
    }
}


function gotoFile() {
    document.getElementById('textbox').style.display = 'none';
    document.getElementById('filebox').style.display = 'block';
}
function gotoText() {
    document.getElementById('filebox').style.display = 'none';
    document.getElementById('textbox').style.display = 'block';
}