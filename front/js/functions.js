/**
 * Generate ngrams based on max param from
 * tokenized text and return it.
 *
 * @param {String Array} text
 * @param {Int} max
 * @return {String Array} res
 */
function ngrams(text, max) {
    if (max > 1) {
        var res = [];
        for (var i = max; i > 0; i--) {
            var num = i;
            for (var j = 0; j <= text.length - num; j++) {
                var candidate = text.slice(j, j + num).join(" ");
                if (Boolean(candidate)) {
                    res.push(candidate);
                }
            }
        }
        return res;
    }
    return text;
}

/**
 * Split text in single words, transform to
 * lowercase and trim each one.
 * @param {String} text
 * @return {String Array} tokens
 */
function tokenize(text) {
    var raw = text.split(" "),
        tokens = [];

    for (var i = 0; i < raw.length; i++) {
        var candidate = raw[i].toLowerCase().trim();
        if (Boolean(candidate)) {
            tokens.push(candidate);
        }
    }
    return tokens;
}

/**
 * Iterate over tokens list and get the
 * steam of each one.
 * @param {String Array} tokens
 * @return {String Array} stems
 */
function stem(tokens) {
    var stems = [];
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        stems.push(stemmer(token));
    }
    return stems;
}

/**
 * Return intersection between keyword list
 * and ngrams provided.
 * @param {Object Array} keywords
 * @param {String Array} ngramslist
 * @return {String Array} tokens
 */
function intersection(keywords, ngramslist) {
    var found = [];
    for (var i = 0; i < ngramslist.length; i++) {
        for (var j = 0; j < keywords.length; j++) {
            var keyword = keywords[j],
                detected = (keyword.word === ngramslist[i]);

            if (detected) found.push(keyword);
        }
    }
    return found;
}

function createTeam() {
    var storage = window.localStorage,
        id = storage.length - 2;

    var team = {
        teamId: id,
        words: {}, // {"internet of things":{count:1,score:100,..}}
        scoreTotal: 0
    };

    var value = JSON.stringify(team);
    storage.setItem(id, value);
    return id;
}

function updateTeam(id, listWordScore) {
    var storage = window.localStorage,
        item = storage.getItem(id),
        team = JSON.parse(item);

    var increment = {};

    if (team) {
        for (var index in listWordScore) {
            if (listWordScore.hasOwnProperty(index)) {
                var element = listWordScore[index];

                if (team.words[element.word]) {
                    team.words[element.word].count = team.words[element.word].count + 1;
                    team.words[element.word].scorePartial = team.words[element.word].scorePartial + team.words[element.word].score;
                    setRankingWords(element.word, 1);
                    increment[element.word] = 1; // WARNING! check this is true
                } else {
                    var word = {};
                    team.words[element.word] = {
                        count: 1,
                        score: element.score,
                        scorePartial: element.score
                    };

                    setRankingWords(element.word, 1);
                    increment[element.word] = 1;
                }
                team.scoreTotal = team.scoreTotal + element.score;
            }
        }

        var value = JSON.stringify(team);
        storage.setItem(id, value);
    }
    return increment;
}

function getTeam(id) {
    var storage = window.localStorage;
    var item = storage.getItem(id);
    var team = JSON.parse(item);
    return team;
}

function createRankingTeam() {
    var storage = window.localStorage;
    var item = storage.getItem("rankingTeams");
    var ranking = JSON.parse(item) || {};

    var value = JSON.stringify(ranking);
    storage.setItem("rankingTeams", value);
}

function setRankingTeam(teamId, score) {
    var storage = window.localStorage;
    var item = storage.getItem("rankingTeams");
    var ranking = JSON.parse(item);
    console.log(typeof(ranking));


    if (score) {
        ranking[teamId] = score;
    } else {
        ranking[teamId] = 0;
    }

    // console.log(ranking);
    var value = JSON.stringify(ranking);
    storage.setItem("rankingTeams", value);
}

function getRankingTeam() {
    var storage = window.localStorage;
    var item = storage.getItem("rankingTeams");
    var ranking = JSON.parse(item);

    return ranking;
}

function createRankingWords() {
    var storage = window.localStorage;
    var ranking = {};

    for (w = 0; w < words.length; w++) {
        var key = words[w].word;
        ranking[key] = 0;
    }

    var value = JSON.stringify(ranking);
    storage.setItem("rankingWords", value);
}

function setRankingWords(word, addCount) {
    var storage = window.localStorage;
    var item = storage.getItem("rankingWords");
    var ranking = JSON.parse(item);

    ranking[word] = ranking[word] + addCount;

    var value = JSON.stringify(ranking);
    storage.setItem("rankingWords", value);
}

function getRankingWords() {
    var storage = window.localStorage;
    var item = storage.getItem("rankingWords");
    var ranking = JSON.parse(item);

    return ranking;
}