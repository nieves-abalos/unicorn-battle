(function() {
    var idTeam = -1;

    function bindRecognition() {
        document.addEventListener("keypress", function(e) {
            if (e.keyCode === 0 || e.keyCode === 32) {
                e.preventDefault();
                startVoiceRecognizer(processVoiceInput);
                idTeam = createTeam();
                increment = {}
                //send event with this data:
                var rankTeams = getRankingTeam();
                var rankWords = getRankingWords();
                word_count = rankWords;
                ranking = rankTeams;
                setRanking( idTeam, rankTeams );
                //drawWordCloud( rankWords, update );

                var team = getTeam(idTeam); // get scoreTotal
                updateCurrentTeam(team);
                //incremento de palabras >>>>> increment

                console.error(increment, team);
                setRankingTeam(idTeam, team.scoreTotal);
                drawWordCloud(null, update);

                setIncrement(increment)

            }
        });
    }

    function processVoiceInput(text) {
        console.log(text);

        var tokens = tokenize(text),
            ngrms = ngrams(tokens, 3),
            matched = intersection(words, ngrms);

        if (matched.length > 0) {
            console.log('matched', matched);

            // update info of the team with the words matched
            var increment = updateTeam(idTeam, matched);

            //send event with this data: data for the cloud of the team and team info
            var team = getTeam(idTeam); // get scoreTotal
            updateCurrentTeam(team);
            //incremento de palabras >>>>> increment

            console.error(increment, team);
            setRankingTeam(idTeam, team.scoreTotal);
            setIncrement(increment)
        }
    }

    function populateViz(){
      var rankTeams = getRankingTeam();
      var rankWords = getRankingWords();
      word_count = rankWords;
      ranking = rankTeams;
      setRanking( idTeam, rankTeams );
      drawWordCloud(null, update);
    }

    function main() {
        bindRecognition();
        createRankingTeam();
        createRankingWords();
        populateViz();
    }

    main();
})();
