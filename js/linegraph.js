/*
 *
 * Kim de Bie (11077379) - 19 January 2016
 * Last updated: 19 January 2016
 *
 * Displays a line graph with crowdsourced and conventional data from after the
 * 25 April 2015 earthquake in Nepal.
 * 
 */

var combineddata;

// http://bl.ocks.org/mbostock/3883245
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatDate = d3.time.format("%d-%b-%y");



d3.csv("../data/combined.csv", function(error, data) {
  if (error) throw error;

  combineddata = countRows(adaptDate(data))
  console.log(combineddata)

  var mappeddata = combineddata.map(function(d) {
  	return {
  		date: d[0],
  		conventional: d[1],
  		crowdsourced: d[2],
  		combined: d[3]
  	}
  })

  console.log(mappeddata)

  var x = d3.time.scale()
    .range([0, width])
    .domain(d3.extent(mappeddata, function(d) { return d.date }));

  var y = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(mappeddata, function(d) { return d.combined })]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var line = d3.svg.line()
    .x(function(d) { return x(d.date) })
    .y(function(d) { return y(d.combined) });

  var svg = d3.select("#linegraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Reports");

  svg.append("path")
  	  .datum(mappeddata)
      .attr("class", "line")
      .attr("d", line)
      .attr("stroke", "#ff0000");
});



  /*

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
});

function type(d) {
  d.date = formatDate.parse(d.date);
  d.close = +d.close;
  return d;
  */



/*
 * Additional helper functions
 */

// function to convert excel date to JS date
function adaptDate(dataset){
  dataset.forEach(function(r) {
    // https://gist.github.com/christopherscott/2782634 (adapted)
    r.date = new Date(((r.date - (25567 + 2))*86400*1000)-2*60*60*1000);
  });
  return dataset;
};


function countRows(dataset){
    // counting the number of rows for each date and data type
    // https://stackoverflow.com/questions/19711123/count-the-number-of-rows-of-a-csv-file-with-d3-js
    var counts = [];
    dataset.forEach(function(r) {
        if (r.district !== "NA"){
              var key = r.date;
              if (!counts[key]) {
                    counts[key] = {
                  	  date: r.date,
                      conventional: 0,
                      crowdsourced: 0,
                      combined: 0
                    };
              }
              if (r.datatype == 'conventional') {
              	counts[key].conventional++;
              } else {
              	counts[key].crowdsourced++;
              }
              counts[key].combined++;
        }  
	});

	var counted = [];
    Object.keys(counts).forEach(function(key){
      	counted.push([counts[key].date, counts[key].conventional, counts[key].crowdsourced, counts[key].combined]);
    });

    counted.sort(sortFunction);
    counted = d3.transpose(counted);
    console.log(counted[0].length)

    var countedcumulative = []
    for (i = 0; i < counted[0].length; i++) {
    	var date = counted[0][i]
    	var conventional = 0;
    	var crowdsourced = 0;
    	var combined = 0;
    	for (j = 0; j < i+1; j++) {
    		conventional = conventional + counted[1][j];
    		crowdsourced = crowdsourced + counted[2][j];
    		combined = combined + counted[3][j];
    	}
    	countedcumulative.push([date, conventional, crowdsourced, combined])
    }

	return countedcumulative;
};



// sorting two-dimensional arrays
// from https://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
};