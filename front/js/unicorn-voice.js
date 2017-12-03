var timeFromStart, timeToReset, recognizing, refreshalId, lastKeyWord;
var timeoutId = -1;

const listenFor = 60 * 1000;

function buildGrammar() {
    var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList,
        grammar = '#JSGF V1.0; grammar colors; public <colors> = Gartner | Big | Data | Bootstrap | Cloud | Disruptive | Ecosystem | Freemium | Game | Changer | Gamification | Internet | Things| Lean | Startup | Leverage | effect | Tail | fruit | MVP | Revenues |  Minimal | MVP | Paradigm | Pivot | Tipping | Traction | Viral | Competition | Technology | Maping | Blockchain | IOT | Startup | Innovation | API | Dataset | Machine | Learning | Voice | Image | Recognition | APP | Application | Develop | Platform | Infrastructure | Automatic | Chatbot | Payment | Frontend | Backend | mobile | web | connect | software | intelligent | sensor | analytics | system | digital | assistant | process | monitor | remote | web | framework | security | computing | design | interoperability | comunication | gadget | user | algoritm | architecture | Accessibility | open | democratize | direct | bank | transport';

    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    return speechRecognitionList;
}

function buildRecognizer() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition,
        recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    return recognition;
}

const recognition = buildRecognizer();
recognition.grammars = buildGrammar();


recognition.onstart = function() {
    timeFromStart = Date.now();
    timeToReset = Date.now() + 10 * 1000;
    recognizing = true;

    if (timeoutId === -1) {
        timeoutId = setTimeout(function() {
        clearInterval(refreshalId);
        recognizing = false;
        recognition.stop();
        timeoutId = -1;
        }, listenFor);
    }

    if (refreshalId) {
        clearInterval(refreshalId);
    }

    refreshalId = setInterval(function() {
        if (recognizing && Date.now() >= timeToReset) {
            recognition.stop();
            timeToReset = Date.now() + 10 * 1000;
        }
    }, 5000);
}

recognition.onend = function() {
    if (recognizing && (Date.now() - timeFromStart) <= listenFor) {
        recognition.start();
    } else {
        recognizing = false;
    }
}

recognition.onerror = function(event) {
    console.error('Speech recognition error detected: ' + event.error);
    recognition.start();
}

recognition.onnomatch = function() {
    console.error('No mathcing...');
}

function onResult(e, callback) {
    if (!e.results[e.results.length - 1][0].isFinal) {
        var last = e.results.length - 1,
            text = e.results[last][0].transcript;

        if (lastKeyWord && text !== lastKeyWord) {
            callback(text);
        }

        lastKeyWord = text;
        // Aquí hacer algo con las palabras detectadas
    } else {
        // Aquí hay frases muy bien escritas
        var text = e.results[last][0].transcript;
    }
}

function startVoiceRecognizer(callback) {
    recognition.start();

    recognition.onresult = function (e) {
        onResult(e, callback);
    }
}