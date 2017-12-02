function init(){
  // Temporal event trigger with space bar
  $(window).keypress(function (e) {
    if (e.keyCode === 0 || e.keyCode === 32) {
      e.preventDefault()
      console.log('Space pressed');
      startVoiceRecognizer();
    }
  });
}

function processVoiceInput(text){
  console.log('User said', text);
  let tokenizedInput = tokenize(text);
  let stemmedInput = stem(tokenizedInput);
  let ngramedInput = ngrams(stemmedInput, 2);
  let matchedWords = intersection(words, ngramedInput);
  if(matchedWords.length > 0){
    // Do something if there is a match
    console.log('We matched', matchedWords);
  }
}

$( document ).ready(function() {
  init();
});
