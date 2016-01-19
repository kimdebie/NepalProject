/*
 *
 * Kim de Bie (11077379) - 5 January 2016
 * Last updated: 18 January 2016
 *
 * Displays a map of Nepal with crowdsourced and conventional data from after the
 * 25 April 2015 earthquake.
 * 
 */


// global variables to be called throughout program 
var date, type, conventionaldata, crowdsourceddata, combineddata;
var initialLoad = true;

// setting colors for the map
// from colorbrewer2.org
var color = d3.scale.threshold()
    .domain([5, 10, 15, 20, 25, 30, 35, 40, 245])
    .range(["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"])

var ext_color_domain = [0, 5, 10, 15, 20, 25, 30, 35, 40]
var legend_labels = ["<5", "5+", "10+", "15+", "20+", "25+", "30+", "35+", ">40"]

// loading the data
queue()
  .defer(d3.json, '../data/nepal-districts.topo.json')
  .defer(d3.csv, '../data/conventional.csv')
  .defer(d3.csv, '../data/crowdsourced.csv')
  .defer(d3.csv, '../data/combined.csv')
  .await(loadMap);

/*
 * map element
 * https://github.com/batuwa/nepal_d3_map
 */

// once the data is loaded, show the map
function loadMap(error, nepal, conventional, crowdsourced, combined){

    if(error) return console.error(error);

    // setting the width and height of the map
    var width = 650,
        height = 420;

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
        .attr("height", height)
        .attr("id", "barchartsvg");

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

    // save all datasets into a global variable with appropriate date value
    conventionaldata = adaptDate(conventional);
    crowdsourceddata = adaptDate(crowdsourced);
    combineddata = adaptDate(combined);

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

    // coloring the map - initally with both data sources
    type = combineddata;
    colorMap(type);
    initialLoad = false;

    // adding a legend
    // http://bl.ocks.org/KoGor/5685876
    var legend = svg.selectAll("g.legend")
      .data(ext_color_domain)
      .enter().append("g")
      .attr("class", "legend");

    var ls_w = 20, ls_h = 20;

    legend.append("rect")
      .attr("x", 20)
      .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
      .attr("width", ls_w)
      .attr("height", ls_h)
      .style("fill", function(d, i) { return color(d); })

    legend.append("text")
      .style("text-anchor", "start")
      .attr("x", 50)
      .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
      .text(function(d, i){ return legend_labels[i]; });
};



/*
 * Functions to determine what type of data should be displayed
 */

function isChecked(){
    if($('#conventional').prop('checked') && $('#crowdsourced').prop('checked')){
        type = combineddata;
        colorMap(combineddata);
    } else if ($('#conventional').prop('checked')) {
        type = conventionaldata;
        colorMap(conventionaldata);
    } else if ($('#crowdsourced').prop('checked')) {
        type = crowdsourceddata;
        colorMap(crowdsourceddata);
    } else {
        d3.selectAll(".districts")
          .style("fill", "#C1C1C1")
        alert('Select at least one data type!');
    };
};
      
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
    if (initialLoad == false){
        colorMap(type);
    };
});


/* 
 * function to color the map based on data 
 */

function colorMap(dataset){
    // reset the colors
    d3.selectAll(".districts")
       .style("fill", "#C1C1C1")

    // removing the tooltip
    d3.select(".d3-tip").remove();


    // reset the bar chart
    document.getElementById('barchart').innerHTML = '';

    counted = countRows(dataset);
      
    // color the districts with datapoints
    counted.forEach(function(object){
      d3.select("#" + object.district)
        .style("fill", color(object.count))
        .on("click", showBarchart)
    });



};

/*
 *  the bar graphs that appear when clicking on a district should go here
 */

function showBarchart(d){

        // first, cleaning the DOM element (deleting possible existing bar charts and tooltips)
        document.getElementById('barchart').innerHTML = '';
        d3.select(".d3-tip").remove();


        // filtering the appropriate data
        var counts = {};
        var labels = ["medical", "damage", "search&rescue", "general assessment", "transport", "nutrition", "sanitation", "children", "casualties", "shelter", "communication", "population behavior", "shocks"];
        for (var i = 0; i < labels.length; i++){
            var key = labels[i];
            counts[key] = {
              conventional: 0,
              crowdsourced: 0
            }
        };

        combineddata.forEach(function(r){
              if (r.date <= date){
                    if (r.district == d.properties.name.toLowerCase()){
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

        console.log(barchartdata)

        var data = d3.transpose(barchartdata)

        // displaying the barchart
        // http://bl.ocks.org/phoebebright/3532324
        // and http://bl.ocks.org/mbostock/3887051

        // declaring variables
        var padding = { top: 30, bottom: 90, left: 30, right: 30 };
        var width = 640 - padding.left - padding.right;
        var height = 350 - padding.top - padding.bottom; 
        var colors = ["#E41A1C", "#377EB8"]

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

        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom")
            .tickFormat(function(d, i){ return labels[i]});

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format("d"))
            .tickSubdivide(0);

        // selecting the appropriate DOM element
        var chart = d3.select("#barchart").append("svg")
            .attr("width", width+padding.left+padding.right)
            .attr("height", height+padding.top+padding.bottom)
          .append("g")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>Number of Reports:</strong> <span style='color:red'>" + d + "</span>";
            })

        var series = chart.selectAll(".series")
            .data(data)
            .enter().append("g")
                .attr("class", "series")
                .attr("fill", function (d, i) { return colors[i]; })
                .attr("transform", function (d, i) { return "translate(" + x1(i) + ")"; });

        series.selectAll("rect")
            .data(Object) 
            .enter().append("rect")
                .attr("class", "bar")
                .attr("x", 0)
                .attr("y", y)
                .attr("width", x1.rangeBand())
                .attr("height", function (d) { return height - y(d); })
                .attr("transform", function (d, i) { return "translate(" + x0(i) + ")"; })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
                
        chart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
          .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)" )
        
        chart.append("text")
            .attr("x", width/2)
            .attr("y", 300)
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .text("Category")

        chart.append("g")
            .attr("class", "axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("font-size", "10px")
            .text("Number of Reports");

        chart.append("text")
          .attr("x", width/2)
          .attr("y", -10)
          .style("text-anchor", "middle")
          .text("Reports for " + d.properties.name.capitalize(true) + " on " + titleDate(date))  

        chart.call(tip);

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

function titleDate(date){
    return date.getDate() + nth(date.getDate()) + " " +
        months[date.getMonth()]
}


// function to save datasets with correct dates (from Excel date to JS)

function adaptDate(dataset){
  dataset.forEach(function(r) {
    // https://gist.github.com/christopherscott/2782634 (adapted)
    r.date = new Date(((r.date - (25567 + 2))*86400*1000)-2*60*60*1000);
  });
  return dataset;
};


// function to count the number of rows for a given selection

function countRows(dataset){
    // counting the number of rows for each district
    // https://stackoverflow.com/questions/19711123/count-the-number-of-rows-of-a-csv-file-with-d3-js
    var counts = {};
    dataset.forEach(function(r) {
        if (r.district !== "NA"){
          // only reports included up to date selected with slider
          if (r.date <= date){
              var key = r.district;
              if (!counts[key]) {
                    counts[key] = {
                      district: r.district,
                      count: 0
                    };
              }
              counts[key].count++;
            }
        }  
    });

    // converting to an array
    var data = [];
    Object.keys(counts).forEach(function(key) {
        data.push(counts[key]);
    });
    return data;
};
