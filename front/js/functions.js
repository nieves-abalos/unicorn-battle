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
                var candidate = text.slice(j, j+num).join(" ");
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
    var raw     = text.split(" "),
        tokens  = [];

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