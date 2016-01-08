/*
 *
 * Kim de Bie (11077379) - 5 January 2016
 * Last updated: 7 January 2016
 *
 * Displays a map of Nepal with crowdsourced and conventional data from after the
 * 25 April 2015 earthquake.
 * 
 */

/*
 * map element
 * https://github.com/batuwa/nepal_d3_map
 */

var date;
var type = "both";

var width = 960,
    height = 500;

// albers projection for Nepal's districts
var projection = d3.geo.albers()
    .center([86, 28])
    .rotate([-85, 0])
    .parallels([27, 32]);

// the path generator
var path = d3.geo.path()
    .projection(projection);

// creating an svg element
var svg = d3.select("#nepalmap")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// adding a rectangular container for the map
svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "container");

// this will be used to add each district's path
var g = svg.append("g");

// tooltip
var tooltip = d3.select("#nepalmap").append("div")
    .attr("class", "tooltip");

// loading the data
queue()
  .defer(d3.json, '../data/nepal-districts.topo.json')
  .defer(d3.csv, '../data/conventional.csv')
  .defer(d3.csv, '../data/crowdsourced.csv')
  .await(loadMap);


// once the data is loaded, show the map
function loadMap(error, nepal, conventional, crowdsourced){

    if(error) return console.error(error);

    // saving the district data
    var districts = topojson.feature(nepal, nepal.objects.districts);

    // centering the map
    // https://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
    projection
      .scale(1)
      .translate([0, 0]);

    var b = path.bounds(districts),
        s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
      .scale(s)
      .translate(t);

    // adding all districts as seperate elements
    g.selectAll("districts")
      .data(districts.features)
      .enter()
      .append("path")
      .attr("class", function(d) { return "districts"; })
      .attr("id", function(d) { return d.properties.name.toLowerCase(); })
      .attr("d", path)

      // this should eventually show a bar chart
      .on("click", showBarchart)

      // the tooltip
      // http://techslides.com/demos/d3/d3-world-map-colors-tooltips.html
      .on("mouseover", function(d,i) {
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
        tooltip
          .classed("hidden", false)
          .attr("style", "left:"+parseFloat(event.pageX+30)+"px;top:"+parseFloat(event.pageY-20)+"px")
          .html(d.properties.name.capitalize(true))
      })
      .on("mouseout",  function(d,i) {
        d3.select(".tooltip").classed("hidden", true);
      })

    // making the borders nice
    g.append("path")
      .datum(topojson.mesh(nepal, nepal.objects.districts, function(a, b) { return a !== b;}))
      .attr("class", "district-boundary")
      .attr("d", path); 

    colorMap();
};

/*
 * Functions to determine what type of data should be displayed
 */

function isChecked(){
    if($('#conventional').prop('checked') && $('#crowdsourced').prop('checked')){
        type = 'both';
    } else if ($('#conventional').prop('checked')) {
        type = 'conventional';
    } else if ($('#crowdsourced').prop('checked')) {
        type = 'crowdsourced';
    } else {
        type = 'none';
    };
    colorMap();
}
      
/* 
 * date slider (to select a date range)
 * noUISlider from https://refreshless.com/nouislider
 */ 

// create a list of day and monthnames (for displaying the date)
var weekdays = ["Sunday", "Monday", "Tuesday","Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// initializing the slider
var slider = document.getElementById('slider');

noUiSlider.create(slider, {
  range: {
    'min': timestamp("2015, 4, 25"),
    'max': timestamp("2015, 5, 5")
  },
  // each step is one day (in miliseconds)
  step: 24 * 60 * 60 * 1000,
  start: timestamp("2015, 5, 5")
});

// updating the slider value
slidervalue = document.getElementById("slidervalue")

slider.noUiSlider.on('update', function( values, handle ) {
  slidervalue.innerHTML = formatDate(new Date(+values[handle]));
  date = new Date(+values[handle]);
  colorMap();
});

/* function to determine for which date data should be displayed */

function colorMap(){
    console.log("I will display " + type + " data on " + date);
    // for testing
    d3.select("#gorkha")
      .attr("style", "fill:green")
    if (type == 'crowdsourced'){
      d3.select("#gorkha")
      .attr("style", "fill:red")
    }
};

/*
 *  the bar graphs that appear when clicking on a district should go here
 */

function showBarchart(d){
        console.log("click!");
        document.getElementById('barchart').innerHTML = 'A barchart will be added here for the following district: ' + d.properties.name.capitalize(true);
};

/*
 * Other helper functions
 */

// function for capitalizing strings
// from: https://stackoverflow.com/questions/2332811/capitalize-words-in-string
String.prototype.capitalize = function(lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

// functions for slider
// from https://refreshless.com/nouislider/examples/#section-dates

function timestamp(str){
    return new Date(str).getTime();   
};

// Append a suffix to dates.
// Example: 23 => 23rd, 1 => 1st.
function nth (d) {
  if(d>3 && d<21) return 'th';
  switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
};

// Create a string representation of the date.
function formatDate ( date ) {
    return weekdays[date.getDay()] + ", " +
        date.getDate() + nth(date.getDate()) + " " +
        months[date.getMonth()] + " " +
        date.getFullYear();
};