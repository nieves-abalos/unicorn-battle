(function() {
    function bindRecognition() {
        document.addEventListener("keypress", function (e) {
            if (e.keyCode === 0 || e.keyCode === 32) {
                e.preventDefault();
                startVoiceRecognizer(processVoiceInput);
            }
        });
    }

    function processVoiceInput(text) {
        console.log(text);

        var tokens  = tokenize(text),
            stems   = stem(tokens),
            ngrms   = ngrams(stems, 3),
            matched = intersection(words, ngrms);

        if (matched.length > 0) {
            // Do something if there is a match
        }
    }

    function main() {
        bindRecognition();
    }

    main();
})();
