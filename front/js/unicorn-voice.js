
var timeFromStart;
var recognizing;

// time to listen | liste time
const listenFor = 60 * 1000;
let lastKeyWord;

function buildGrammar(){
  var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
  var grammar = '#JSGF V1.0; grammar colors; public <colors> = Gartner | Big | Data | Bootstrap | Cloud | Disruptive | Ecosystem | Freemium | Game | Changer | Gamification | Internet | Things| Lean | Startup | Leverage | effect | Tail | fruit | MVP | Revenues |  Minimal | MVP | Paradigm | Pivot | Tipping | Traction | Viral | Competition | Technology | Maping | Blockchain | IOT | Startup | Innovation | API | Dataset | Machine | Learning | Voice | Image | Recognition | APP | Application | Develop | Platform | Infrastructure | Automatic | Chatbot | Payment | Frontend | Backend | mobile | web | connect | software | intelligent | sensor | analytics | system | digital | assistant | process | monitor | remote | web | framework | security | computing | design | interoperability | comunication | gadget | user | algoritm | architecture | Accessibility | open | democratize | direct | bank | transport';

  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  return speechRecognitionList;
}

function buildRecognizer(){
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.maxAlternatives = 1;
  return recognition;
}

const recognition = buildRecognizer();
recognition.grammars = buildGrammar();

recognition.onstart = function(){
  console.log('start');
  timeFromStart = Date.now();
  recognizing = true;
  setTimeout(function (){
    if(recognizing) recognition.stop();
  },listenFor);
}

recognition.onend = function(){
  console.log('end');
  recognizing = false;
}

recognition.onerror = function(event) {
  console.log('Speech recognition error detected: ' + event.error);
  recognizing = false;
}

recognition.onnomatch = function(event) {
  console.error('No mathcing...');
}

recognition.onresult = function(e) {
  if(!e.results[e.results.length - 1][0].isFinal){
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    console.error(text);
    if(lastKeyWord && text !== lastKeyWord)
      processVoiceInput(text);
    lastKeyWord = text;
    // Aquí hacer algo con las palabras detectadas
  }
  else {
    // Aquí hay frases muy bien escritas
    let text = e.results[last][0].transcript;
  }

  if((Date.now() - timeFromStart) > listenFor){
    recognition.stop();
  }
}

function startVoiceRecognizer(){
  recognition.start();
};
