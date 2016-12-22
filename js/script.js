//variables

var width = 500;
var height = 500;
var paper = Raphael("paper", width, height);
var decades = {};
var activeDecade;

function init() {
    drawDecades();
}

function drawDecades() {
    $.getJSON("http://localhost:8080/Timeline/webresources/events/decades", function (data) {

        var spacing = height / (data.length + 2);
        paper.rect(27, spacing, 6, spacing * (data.length - 1)).attr({"stroke-width": 6, stroke: "#E00"});

        for (var i = 0; i < data.length; i++) {
            paper.setStart();
            var circle = paper.circle(30, (i + 1) * spacing, 20);
            circle.attr({
                fill: "#F22",
                "stroke-width": 5,
                stroke: "#E00"
            });
            circle.info = data[i].decade;
            var text = paper.text(30, (i + 1) * spacing, data[i].decade).attr({fill: "#FFF"});
            text.info = data[i].decade;
            var icon = paper.setFinish();
            icon.info = "asu " + data[i].decade;
            icon.click(function () {
                drawDecade(this);
            });
        }


    });
}

function drawDecade(obj) {

    if (activeDecade) {
        console.log("if");
        console.log(activeDecade);
        activeDecade.animate({transform: "s0"}, 1000, function () {
            activeDecade = undefined;
            drawDecade(obj);
        });
    } else {
        $.getJSON("http://localhost:8080/Timeline/webresources/events/decade/" + obj.info, function (data) {
            //console.log();
            paper.setStart();
            var line = paper.rect(10, height - 30, width - 20, 6);
            line.attr({stroke: "#E00", "stroke-width": 6});
            for (var i = 0; i < 10; i++) {
                var circle = paper.circle(25 + i * width / 10, height - 30, 20);
                var text = paper.text(25 + i * width / 10, height - 30, (obj.info + i));
                if (getYears(data).indexOf((obj.info + i)) !== -1) {
                    circle.attr({
                        fill: "#EE2",
                        "stroke-width": 5,
                        stroke: "#E00",
                        cursor: "pointer"
                    });
                    text.attr({fill: "#FFF", cursor: "pointer"});
                    text.year = (obj.info + i);
                    circle.year = (obj.info + i);
                    
                    text.click(function (){
                        console.log(getEventsFromYear(data,this.year));
                    });
                    circle.click(function (){
                        console.log(getEventsFromYear(data,this.year));
                    });
                } else {
                    circle.attr({
                        fill: "#F22",
                        "stroke-width": 5,
                        stroke: "#E00"
                    });
                    text.attr({fill: "#FFF"});
                }
            }
            var decade = paper.setFinish();
            activeDecade = decade;
        });

    }
}

function getYears(data) {
    var years = [];
    data.forEach(function (element) {
        years.push(element.year);
    });
    return years;
}

function getEventsFromYear(data, year) {
    var events = [];
    data.forEach(function (element) {
        if (element.year === year) {
            events.push(element);
        }
    });
    return events;
}

document.body.onload = init;


