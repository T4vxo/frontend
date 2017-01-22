//variables
var width = 500;
var height = 500;
//colors
var design = {
    color: {
        active: "rgb(253,242,0)",
        darkbase: "rgb(250,105,0)",
        base: "rgb(243,134,48)",
        lightblue: "rgb(167,219,219)",
        blue: "rgb(105,210,231)",
        gray: "rgb(224,228,204)",
        text: "rgb(240,250,248)"
    },
    style: {
        strokewidth: 5
    }
};

var lowerPaper = Raphael("lower-paper", 500, 100);
var leftPaper = Raphael("left-paper");
var decades = {};
var activeDecade;
function init() {
    drawDecades();

}


function drawDecades() {
    $.getJSON("http://localhost:8080/Timeline/webresources/events/decades", function (data) {

        var spacing = height / (data.length + 2);
        leftPaper.rect(22, spacing, 4, spacing * (data.length - 1)).attr({"stroke-width": design.style.strokewidth, stroke: design.color.darkbase});
        for (var i = 0; i < data.length; i++) {
            leftPaper.setStart();
            var circle = leftPaper.circle(25, (i + 1) * spacing, 20);
            circle.attr({
                fill: design.color.base,
                "stroke-width": design.style.strokewidth,
                stroke: design.color.darkbase
            });
            circle.info = data[i].decade;
            var text = leftPaper.text(25, (i + 1) * spacing, data[i].decade).attr({fill: design.color.text});
            text.info = data[i].decade;
            var icon = leftPaper.setFinish();
            icon.info = "asu " + data[i].decade;
            icon.click(function () {
                drawDecade(this);
            });
        }


    });
}

function drawDecade(obj) {

    if (activeDecade) {
        activeDecade.animate({transform: "s0"}, 1000, function () {
            activeDecade = undefined;
            drawDecade(obj);
        });
    } else {
        $.getJSON("http://localhost:8080/Timeline/webresources/events/decade/" + obj.info, function (data) {
            lowerPaper.setStart();
            var line = lowerPaper.rect(10, 30, width - 20, 6);
            line.attr({stroke: "#E00", "stroke-width": 6});
            for (var i = 0; i < 10; i++) {
                var circle = lowerPaper.circle(25 + i * width / 10, 30, 20);
                var text = lowerPaper.text(25 + i * width / 10, 30, (obj.info + i));
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
                    text.click(function () {
                        showYear(getEventsFromYear(data, this.year));
                    });
                    circle.click(function () {
                        showYear(getEventsFromYear(data, this.year));
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
            var decade = lowerPaper.setFinish();
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

var currentYearData;
var currentEventOfTheYear = 0;
function showYear(data) {
    // alert(data[0].year);

    var next = document.getElementById("next");
    var prev = document.getElementById("prev");
    if (data.length > 1) {
        next.style.display = "inline";
        prev.style.display = "inline";
        currentYearData = data;

        next.onclick = function () {
            currentEventOfTheYear++;
            if (currentEventOfTheYear >= data.length) {
                currentEventOfTheYear = 0;
            }
            displayData(data);
        };

        prev.onclick = function () {
            currentEventOfTheYear--;
            if (currentEventOfTheYear < 0) {
                currentEventOfTheYear = data.length - 1;
            }
            displayData(data);
        };
    } else {
        next.style.display = "none";
        prev.style.display = "none";
    }
    displayData(data);
}
function displayData(data) {
    var title = document.getElementById("title");
    var image = document.getElementById("image");
    var text = document.getElementById("text");
    title.innerHTML = data[currentEventOfTheYear].year + " " + data[currentEventOfTheYear].title;
    text.innerHTML = data[currentEventOfTheYear].text;
    image.src = data[currentEventOfTheYear].image;
}


document.body.onload = init;


