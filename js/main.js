(function() {
    var idTeam = -1;
    var bufferFilter = new BufferFilter(5);

    function bindRecognition() {

        document.querySelector("form.video-form").addEventListener("submit", (e) => {
            e.preventDefault();
            var videoUrl = document.querySelector(".video-url").value;
            var videoId = videoUrl.split("/watch?v=")[1];

            function onPlayerReady(event) {
                event.target.playVideo();
            }

            var done = false;
            var lastVideo = '';
            function onPlayerStateChange(event) {
                // if (event.data == YT.PlayerState.PLAYING && !done) {
                videoUrl = document.querySelector(".video-url").value;
                videoId = videoUrl.split("/watch?v=")[1];
                if (event.data == YT.PlayerState.PLAYING) {
                    // ToDo: Control video volume
                    // console.info("For: "+ player.getDuration() + " seconds")
                    setListenTime( player.getDuration() );
                    startVoiceRecognizer(processVoiceInput);
                    console.log(lastVideo + " - " + videoId)
                    if ( lastVideo != videoId ) {
                        idTeam = createTeam();
                        increment = {}
                        //send event with this data:
                        var rankTeams = getRankingTeam();
                        var rankWords = getRankingWords();
                        word_count = rankWords;
                        ranking = rankTeams;
                        setRanking( idTeam, rankTeams, player.getVideoData().title );
                        //drawWordCloud( rankWords, update );

                        var team = getTeam(idTeam); // get scoreTotal
                        updateCurrentTeam(team);
                        //incremento de palabras >>>>> increment

                        console.error(increment, team);
                        setRankingTeam(idTeam, team.scoreTotal);
                        drawWordCloud(null, update);

                        setIncrement(increment);

                        lastVideo = videoId;
                    }

                    done = true;

                } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {

                    stopVoiceRecognizer()
                    // ToDo: Pop-up to publish score into the ranking?? :-/
                    // console.log("For: "+ player.getDuration() + " seconds")
                    // console.log("Title: "+ player.getVideoData().title + "")
                }
            }
            function stopVideo() {
                player.stopVideo();
            }
            if (player == null) {
                player = new YT.Player('video-area', {
                    // height: '360',
                    // width: '640',
                    videoId: videoId,
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            } else {
                player.loadVideoById(videoId, 0);
            }


            return false;
        })

        // OLD: Space bar feature
        // document.addEventListener("keypress", function(e) {
        //     if (e.keyCode === 0 || e.keyCode === 32) {
        //         e.preventDefault();
        //         startVoiceRecognizer(processVoiceInput);
        //         idTeam = createTeam();
        //         increment = {}
        //         //send event with this data:
        //         var rankTeams = getRankingTeam();
        //         var rankWords = getRankingWords();
        //         word_count = rankWords;
        //         ranking = rankTeams;
        //         setRanking( idTeam, rankTeams );
        //         //drawWordCloud( rankWords, update );

        //         var team = getTeam(idTeam); // get scoreTotal
        //         updateCurrentTeam(team);
        //         //incremento de palabras >>>>> increment

        //         console.error(increment, team);
        //         setRankingTeam(idTeam, team.scoreTotal);
        //         drawWordCloud(null, update);

        //         setIncrement(increment)

        //     }
        // });
    }

    function processVoiceInput(text) {
        console.log(text);

        var tokens = tokenize(text),
            ngrms = ngrams(tokens, 3),
            matched = intersection(words, ngrms);

        matched = matched.filter(function(item){
          return bufferFilter.check(item);
        });

        if (matched.length > 0) {
            console.log('matched', matched);
            matched.forEach(function(item){
              bufferFilter.insert(item);
            });

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
