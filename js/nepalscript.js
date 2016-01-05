/*
 *
 * Kim de Bie (11077379) - 5 January 2016
 * Last updated: 5 January 2016
 *
 * Displays a map of Nepal with crowdsourced and conventional data from after the
 * 25 April 2015 earthquake.
 * 
 */

// the map of Nepal should go here
// https://github.com/batuwa/nepal_d3_map

var width = 960,
    height = 500;

var projection = d3.geo.albers()
    .center([86, 28])
    .rotate([-85, 0])
    .parallels([27, 32]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("http://localhost:8000/data/nepal-districts.topo.json", function(error, nepal) {

    var districts = topojson.feature(nepal, nepal.objects.districts);

    projection
      .scale(1)
      .translate([0, 0]);

    var b = path.bounds(districts),
         s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
         t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
      .scale(s)
      .translate(t);

    svg.append("path")
      .datum(districts)
      .attr("class", "feature")
      .attr("d", path);
});


// date slider (to select a date range)

$("#slider").dateRangeSlider({
	bounds: {min: new Date(2015, 3, 25), max: new Date(2015, 4, 5)},
	defaultValues: {min: new Date(2015, 3, 25), max: new Date(2015, 4, 5)}
});

// the bar graphs that appear when clicking on a district should go here