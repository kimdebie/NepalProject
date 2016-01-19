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
var colors = ["red", "green", "blue"];
var types = ["combined", "crowdsourced", "conventional"]

// http://bl.ocks.org/mbostock/3883245
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

d3.csv("../data/combined.csv", function(error, data) {
  if (error) throw error;

  // counting the rows per day/datatype
  combineddata = countRows(adaptDate(data))

  // preparing data for graph 
  var mappeddata = combineddata.map(function(d) {
  	return {
  		date: d[0],
  		conventional: d[1],
  		crowdsourced: d[2],
  		combined: d[3]
  	}
  })

  var x = d3.time.scale()
    .range([0, width])
    .domain(d3.extent(mappeddata, function(d) { return d.date }));

  var y = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(mappeddata, function(d) { return d.combined })])
    .nice();

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var combinedline = d3.svg.line()
    .x(function(d) { return x(d.date) })
    .y(function(d) { return y(d.combined) });

  var conventionalline = d3.svg.line()
    .x(function(d) { return x(d.date) })
    .y(function(d) { return y(d.conventional) });

  var crowdsourcedline = d3.svg.line()
    .x(function(d) { return x(d.date) })
    .y(function(d) { return y(d.crowdsourced) });

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
      .attr("d", combinedline)
      .attr("stroke", colors[0]);

  svg.append("path")
  	  .datum(mappeddata)
      .attr("class", "line")
      .attr("d", crowdsourcedline)
      .attr("stroke", colors[1]);
  
  svg.append("path")
  	  .datum(mappeddata)
      .attr("class", "line")
      .attr("d", conventionalline)
      .attr("stroke", colors[2]);

  svg.selectAll("g.dot")
      .data(mappeddata)
      .enter().append("g")
      .attr("class", "dot")
      .selectAll("circle")
      .data(function(d) { return d.Data; })
      .enter().append("circle")
      .attr("r", 6)
      .attr("cx", function(d,i) {  return x(d.Date); })
      .attr("cy", function(d,i) { return y(d.Value); })   


  // adding a legend
        var legend = svg.selectAll("g.legend")
          .data([1, 2, 3])
          .enter().append("g")
          .attr("class", "legend");

        var ls_w = 20, ls_h = 20;
        var legend_labels = types;

        legend.append("rect")
          .attr("x", width-90)
          .attr("y", function(d, i){ return (height - (i*ls_h) - 2*ls_h);})
          .attr("width", ls_w)
          .attr("height", ls_h)
          .style("fill", function(d, i) { return colors[i]; })
          .style("opacity", 1);

        legend.append("text")
          .style("text-anchor", "start")
          .attr("x", width-65)
          .attr("y", function(d, i){ return (height - (i*ls_h) - ls_h - 4);})
          .text(function(d, i){ return legend_labels[i]; });
});


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