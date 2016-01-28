/*
 *
 * Kim de Bie (11077379) - 19 January 2016
 * Last updated: 28 January 2016
 * Minor Programmeren: Programmeerproject
 * University of Amsterdam
 *
 * Displays a line graph with crowdsourced and conventional data from after the
 * 25 April 2015 earthquake in Nepal. Bar charts displayed with data per day on-click.
 * Functions for drawing the line graph and bar charts and selecting/processing the data. 
 * 
 */

// setting global variables to be used througout the program
var combineddata, data_barchart;

/*
 * Line graph
 */

d3.csv("../data/combined.csv", function(error, data) {
  if (error) throw error;

  // counting the rows per day/datatype
  data_barchart = barchartDate(data);
  combineddata = countRows(adaptDate(data));
  var colors = ["red", "green", "yellow"]

  // drawing the line graph using the C3.js library
  // from www.c3js.org
  var chart = c3.generate({
      padding: {
        top: 0,
        right: 50,
        bottom: 30,
        left: 50,
      },
      size: {
        height: 420,
        width: 650
      },
	    data: {
	        x: 'dates',
	        columns: combineddata,
	        onclick: showBarchart
	    },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: '%d %B',
                  outer: false,
                  count: 11,
              },
              height: 50,
              label: {
                 text: 'Date',
                 position: 'outer-center',
              }
          },
          y: {
            tick: {
              outer: false
            },
            label: {
              text: 'Number of reports',
              position: 'outer-center',
            }
          }
      },
      color: {
          pattern: ['#497285', '#F78536', '#f1c40f']
      }   
	});

});

/*
 * On click (on the line graph): displaying a bar chart
 * (This function is similar to that in homepage.js)
 */

function showBarchart(date){

	  // first, cleaning the DOM element (deleting possible existing bar charts and tooltips)
    document.getElementById('barchart').innerHTML = '';
    var date = new Date(date.x.setHours(date.x.getHours()+2));

    // filtering the appropriate data
    // each category gets data at count zero
    var counts = {};
    var labels = ["medical", "damage", "search&rescue", "general assessment", "transport", "nutrition", "sanitation", "children", "casualties", "shelter", "communication", "population behavior", "shocks"];
    for (var i = 0; i < labels.length; i++){
        var key = labels[i];
        counts[key] = {
          conventional: 0,
          crowdsourced: 0
         }
    };

    // adding counts to the appropriate category for each data point
    data_barchart.forEach(function(r){
        if (new Date(r.date) <= date){
            if (r.district !== 'NA'){
                var key = r.label;
                if (r.datatype == "conventional"){
                        counts[key].conventional++;
                } else if (r.datatype == "crowdsourced") {
                        counts[key].crowdsourced++;
                }
            }
        }
    });

    // storing the data and labels for the grouped bar chart
    // https://stackoverflow.com/questions/12180108/d3-create-a-grouped-bar-chart-from-json-objects
    var barchartdata = [];
    Object.keys(counts).forEach(function(key){
      barchartdata.push([counts[key].conventional, counts[key].crowdsourced]);
    })

    var data = d3.transpose(barchartdata)

    // displaying the barchart
    // http://bl.ocks.org/phoebebright/3532324
    // and http://bl.ocks.org/mbostock/3887051

    // declaring variables
    var padding = { top: 60, bottom: 90, left: 50, right: 30 };
    var width = 650 - padding.left - padding.right;
    var height = 380 - padding.top - padding.bottom; 
    var colors = ["#497285", "#F78536"]
    
    var numberGroups = 13; // groups
    var numberSeries = 2;  // series in each group

    // the absolute x axis
    var x0 = d3.scale.ordinal()
        .domain(d3.range(numberGroups))
        .rangeRoundBands([0, width], 0.1);

    // x-axis for each group
    var x1 = d3.scale.ordinal()
        .domain(d3.range(numberSeries))
        .rangeRoundBands([0, x0.rangeBand()]);

    // scaling the y-axis
    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(data){return d3.max(data)})])
        .range([height, 0])
        .nice();

    // setting the x-axis
    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom")
        .tickFormat(function(d, i){ return labels[i]})
        .outerTickSize(0);

    // setting the y-axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format("d"))
        .tickSubdivide(0)
        .tickSize(0);

    // selecting the appropriate DOM element
    var chart = d3.select("#barchart").append("svg")
        .attr("width", width+padding.left+padding.right)
        .attr("height", height+padding.top+padding.bottom)
      .append("g")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

    var series = chart.selectAll(".series")
        .data(data)
        .enter().append("g")
	        .attr("class", "series")
	        .attr("fill", function (d, i) { return colors[i]; })
	        .attr("transform", function (d, i) { return "translate(" + x1(i) + ")"; })
          .attr("title", function (d, i) { return d;})  ;

    // adding a bar for each category
    series.selectAll("rect")
        .data(Object) 
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", 0)
          .attr("y", y)
          .attr("width", x1.rangeBand())
          .attr("height", 0)
          .transition()
          .delay(500)
          .attr("height", function (d) { return height - y(d); })
          .attr("transform", function (d, i) { return "translate(" + x0(i) + ")"; })
          .attr("id", function (d, i) { return d; })
                
    // adding the x-axis
    chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)" )
        
    // label on the x-axis
    chart.append("text")
        .attr("x", width/2)
        .attr("y", 300)
        .attr("class", "axis")
        .style("text-anchor", "middle")
        .text("Category")

    // adding the y-axis
    chart.append("g")
        .attr("class", "axis")
        .call(yAxis);
       
    // label on the y-axis
    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "axis")
        .attr("x", -30)
        .attr("y", -20)
        .style("text-anchor", "end")
        .text("Number of reports");

    // chart title
    chart.append("text")
        .attr("x", width/2)
        .attr("y", -10)
        .attr("id", "barcharttitle")
        .style("text-anchor", "middle")
        .text("Reports for " + titleDate(date)); 

    // showing the amount of reports that make up a bar (on hover)
    chart.append("text")
        .attr("x", width/2)
        .attr("y", 40)
        .attr("id", "amount")
        .style("text-anchor", "middle")
        .text(""); 

    // adding a legend
    var legend = chart.selectAll("g.legend")
        .data([1, 2])
        .enter().append("g")
        .attr("class", "legend");

    var ls_w = 20, ls_h = 20;
    var legend_labels = ["conventional", "crowdsourced"]

    legend.append("rect")
        .attr("x", width-90)
        .attr("y", function(d, i){ return (height - (i*ls_h) - 2*ls_h)-200;})
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) { return colors[i]; })
        .style("opacity", 1);

    legend.append("text")
        .style("text-anchor", "start")
        .attr("x", width-65)
        .attr("y", function(d, i){ return (height - (i*ls_h) - ls_h - 4)-200;})
        .text(function(d, i){ return legend_labels[i]; });

    // workaround for tooltip issues: conflicting with C3.js
    // not too pretty but oh well..
    d3.selectAll('.bar')
        .attr("onmouseover", "document.getElementById('amount').innerHTML = $(this)[0].id + ' reports' ")
        .attr("onmouseout", "document.getElementById('amount').innerHTML = ''")

};



/*
 * Additional helper functions
 */

// function to convert excel date to JS date
function adaptDate(dataset){
  dataset.forEach(function(r) {
    // https://gist.github.com/christopherscott/2782634 (adapted)
    r.date = r.date.toISOString().slice(0, 10);
  });
  return dataset;
};

function barchartDate(dataset){
  dataset.forEach(function(r) {
    // https://gist.github.com/christopherscott/2782634 (adapted)
    r.date = new Date(((r.date - (25567 + 1))*86400*1000)-2*60*60*1000);
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

    // from dictionary to array
	  var counted = [];
    Object.keys(counts).forEach(function(key){
      	counted.push([counts[key].date, counts[key].conventional, counts[key].crowdsourced, counts[key].combined]);
    });

    counted.sort(sortFunction);
    counted = d3.transpose(counted);

    // cumulative numbers to be displayed: adding up the data cumulatively
    var countedcumulative = [["dates", "conventional", "crowdsourced", "combined"]]
    var dates = ['dates']
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

	return d3.transpose(countedcumulative);
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

// adding a date as title to the bar graph
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function titleDate(date){
    return date.getDate() + nth(date.getDate()) + " " +
        months[date.getMonth()]
}

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