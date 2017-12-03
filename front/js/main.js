(function() {
    var idTeam = -1;

    function bindRecognition() {
        document.addEventListener("keypress", function(e) {
            if (e.keyCode === 0 || e.keyCode === 32) {
                e.preventDefault();
                startVoiceRecognizer(processVoiceInput);
                idTeam = createTeam();

                //send event with this data:
                var rankTeams = getRankingTeam();
                var rankWords = getRankingWords();
                console.log(rankTeams, rankWords);
            }
        });
    }

    function processVoiceInput(text) {
        console.log(text);

        var tokens = tokenize(text),
            stems = stem(tokens),
            ngrms = ngrams(stems, 3),
            matched = intersection(words, ngrms);

        if (matched.length > 0) {
            console.log('matched', matched);

            // update info of the team with the words matched
            var increment = updateTeam(idTeam, matched);

            //send event with this data: data for the cloud of the team and team info
            var team = getTeam(idTeam); // get scoreTotal
            //incremento de palabras >>>>> increment

            console.error(increment, team);
            setRankingTeam(idTeam, team.scoreTotal);

        }
    }

    function main() {
        bindRecognition();
        createRankingTeam();
        createRankingWords();
    }

    main();
})();