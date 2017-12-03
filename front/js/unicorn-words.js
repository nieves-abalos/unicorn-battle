
var word_count = {}

function drawWordCloud( currentWords, callback ){

    var mod_words = {}
    for (var w in word_count){
        if (word_count.hasOwnProperty(w)) {
            if (word_count[w] > 400) mod_words[w] = parseFloat(word_count[w])*2;
            mod_words[w] = parseFloat(word_count[w])/10;
        }
    }

    var svg_location = "#chart";
    var width = $(document).width();
    var height = $(document).height()-400;

    var color1 = '#999999';
    var color2 = '#111111';
    var length = 100;

    var fill = d3.scale.category20();
    var color = d3.scale.linear().domain([1,length])
                    .interpolate(d3.interpolateHcl)
                    .range([d3.rgb(color2), d3.rgb(color1)]);

    var word_entries = d3.entries(word_count);

    var xScale = d3.scale.linear()
        .domain([0, d3.max(word_entries, function(d) {
            return d.value;
        })
        ])
        .range([5,100]);

    d3.layout.cloud().size([width, height])
        .timeInterval(20)
        .words(word_entries)
        .fontSize(function(d) { return xScale(+d.value); })
        .text(function(d) { return d.key; })
        // .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .rotate(function() { return 0; })
        .font("Raleway")
        .on("end", draw)
        .start();

    function draw(words) {
        document.getElementById("chart").innerHTML = ""
        d3.select(svg_location).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return xScale(d.value) + "px"; })
            .style("font-family", "Raleway")
            .style("fill", function(d, i) { 
                if (currentWords) {
                    if (d.key in currentWords) {
                        return "#FFEB3B" 
                    } else return color(i)
                } else {
                    console.info("no currentWords")
                    return color(i); 
                }
            })
            .style("stroke-width", function(d, i) { 
                if (currentWords) {
                    if (d.key in currentWords) return "1px"
                }
            })
            .style("stroke", function(d, i) { 
                if (currentWords) {
                    if (d.key in currentWords) return "black"
                }
            })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.key; });
            if (callback) callback()
    }

    d3.layout.cloud().stop();
}

var fua = new Audio('sound/fua.wav');

var ranking = [
    { id: 1, points: 300, score: 85 },
    { id: 2, points: 200, score: 65 },
    { id: 3, points: 120, score: 45 }
]

var current = {
    id: 5,
    points: 50,
    score: 20,
    words: {
        "machine learning": 500,
        "image recognition": 400,
        "application": 200,
        "platform": 200,
        "automatic": 100,
        "chatbot": 500
    }
}


function update() {

    setRanking(ranking, current);
}

function setRanking( ranking, current ) {
    console.log(ranking)
    var indicators = document.getElementsByClassName("ranking-indicator");
    var teams = document.getElementsByClassName("team");
    var points = document.getElementsByClassName("points");
    var unicorngif = document.getElementById("unicorn-gif");

    if (current) {
        indicators[0].setAttribute("style", "left: "+current.score+"%");
        teams[0].innerHTML = "t"+current.id;
        points[0].innerHTML = ""+current.points;
        if (Object.keys(current.words).length > 0){

            Object.assign(word_count, current.words);

            drawWordCloud( current.words )

            unicorngif.classList.toggle("hidden");
            fua.play();
            fua.currentTime = 0
            setTimeout(function() {
                unicorngif.classList.toggle("hidden");
            }, 1200)
        }
    }

    for (let i = 1; i < indicators.length; i++) {
        indicators[i].setAttribute("style", "left: "+ranking[i-1].score+"%");
        teams[i].innerHTML = ""+ranking[i-1].id;
        points[i].innerHTML = ""+ranking[i-1].points;
    }
    
}

$( document ).ready(function() {

    // drawWordCloud(null, update);

    // setTimeout( function() {
    //     let newWords = {
    //         id: 4,
    //         points: 80,
    //         score: 40,
    //         words: {
    //             "blockchain": 450
    //         }
    //     }
    //     let prevWords = current.words;
    //     Object.assign(prevWords, newWords.words);
    //     Object.assign(current, newWords);
    //     current.words = prevWords;
    //     console.log(current)
        
    //     setRanking(ranking, current)

    // }, 3000)


});
