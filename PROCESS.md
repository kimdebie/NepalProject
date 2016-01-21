#Process Book

###day 2: 5 January

Today I focused on building a _prototype_. I found JSON-files that contain the Nepali districts. I built the HTML framework (including a dropdown menu for selecting data sources and a slider to select a date range) and I also set up a basic d3 map. The map now shows up (yay!) with all the districts, so now I'll have to add data to it. Data collection is a bit more involved (I'm building my own dataset so I can't just scrape something) and something that will be a work in progress, but I should be able to finish that by the end of this week. 

I also did some work on the _design document_. I'm not sure if it's more or less done or if I need to be much more detailed (especially on the functions/return types I want to implement) so this is something I will ask tomorrow. I also still need to include a few sketches.

Based on my thoughts/ideas today, I have chosen to change the way I _display data_. I realised that many, many datapoints will have the same geolocation, and placing these on top of each other as points (as I planned to do first) will not look very pretty. Many data points are e.g. linked to the capital of a district, while they are actually valid for the district as a whole; mapping them on the district only would therefore give a misleading representation of the situation. Instead I now want to make a measure for the 'data density' of the district as a whole. So, when there is more data for a district, that should be visible (e.g. it should become darker). I updated this in my proposal. 

For _tomorrow_, I want to finish the prototype. I want the districts to be clickable (and record somewhere that they are being clicked on) and I want to be able to give them different colors. Perhaps I can do some styling (of headers/fonts etcetera). As mentioned above, I want to ask for help about the design document to see what more I need to add there. For the rest I will be working on compiling my dataset further. 


###day 3: 6 January

We had our first stand-up meeting this morning. From the others (and also after consulting with the staff) I understood that I had already done most of the work for the _design document_, so I was able to finish that today after a bit of work.
 
I also worked on the _prototype_; I worked on the design of the document (I hadn't done anything in CSS yesterday) so it looks a lot better now. I also discovered that I hadn't loaded the districts seperately, but instead as one big area. I fixed that today, so now they are separate elements in the DOM. Districts are now saved with their name as ID, so I am able to color them separately. Furthermore I implemented a _tooltip_ which displays the name of the district on hover; that is fully functional now. Moreover, clicking on a district is now saved as an event and a text pops up at the bottom (this will be replaced by a bar chart).  I had some trouble with the _date slider_; I found a module yesterday that I didn't like in the end (it only allowed me to select a date range and not a single date) but I found a better one now. The formatting of the text that is displayed is a bit buggy though, and it doesn't completely pick the right dates yet (sometimes 23:59:59 instead of 00:00:00 on the following day) but I think I know what causes it and I'll fix it tomorrow. 

So, _tomorrow_ I want to fix the last bugs in the prototype (date slider) and then I should be able to spend quite some time on getting my datasets in the right format. 


###day 4: 7 January

Today I firstly finished up my prototype - the map and dateslider are now working, and I added some functions that I will later complete to relate the map to the data. After that I spent most of my day on finishing up my datasets (which involves manual coding, so not too programming-intensive today). _Tomorrow_ I will focus on preparing my presentation and I want to see if I can load the data properly. I also want to make a plan for next week and determine what exactly should be part of my alpha-version that is due on day 10. 


###day 5: 8 January

As planned, I fixed the _loading of the data_. I also further improved the interactive parts of the map: I replaced the drop-down menu I had to select data with _checkboxes_ which I find prettier/more intuitive. I further implemented functions that register what _filters_ are applied, and I built a prototype function that should eventually color the districts on the map. The main challenge for now is _linking this function to the dataset_ and determining the color of a district based on the number of reports that are in the dataset for that district. I also worked on the general layout of the page; I added a _navigation bar_ and multiple pages (that will not all contain data visualizations but mostly background info). 

Based on my thought process in preparing for the presentation (and the feedback I got during the presentation) I decided that it would probably be helpful to have some extra charts that allow the user to compare _all_ data over time. The current visualizations I have are mostly focused on displaying data per district, but it would also be nice to e.g. have a line graph that shows the number of reports coming in over time for both data sources, to see where peaks are etcetera. For now I will focus on the map/barchart part though.

For _next week_, I will focus on the map and linking data to it, based on filters that are applied. Hopefully I should get this working by Tuesday or so. I want to spend the rest of the week on building the bar charts. 

###day 6 and 7: 11/12 January

_Today and yesterday_, I worked on getting the map element fully functional. This worked out well and is now done. I struggled a bit with saving data globally (so that I can access it from functions outside the d3 function) but I figured it out in the end. The appropriate filters (date and data type) are applied, and the data points for each district are counted accordingly. The only thing I might still want to improve about the map is the coloring - I now created 9 'buckets' of equal size, but relatively many districts stay on the whiter scale of the spectrum for a long time. Maybe the buckets should be of non-equal size, but this is something I can think about in a later stage. I also want to add a legend.

For the rest of the week, I want to focus on implementing the bar chart element. 

###day 8 and 9: 13/14 January

Over the past two days, I focused on implementing the bar chart. What made this quite difficult is loading the data and making D3 work on the basis of objects instead of csv(-like) files. However the data is now loaded correctly, making a selection based on the correct date and district for each click.

To-do list for this week:
- labeling the axes for the bar chart
- implementing a tooltip for the bar chart
- adding legends to both the bar chart and the map
- making sure the bar chart has a correct domain (now arbitrarily set at 20) 

For a later stage (prettifying) re. bar chart and map: 
- improving colors on the map: changing the buckets
- updating the bar chart when the date slider is moved
- making sure only districts with data can be clicked

###day 10 and 11: 15/18 January

I fixed everything on the to do list(s) above. I had a few fights with the labels of the bar chart - they wouldn't display and I couldn't figure out why, but it turned out that this had to do with CSS. So, I learnt quite a bit about the order/priority with which CSS is applied to elements. Next to this, I wrote texts and found images for the info pages that are part of my website. I now consider the first three pages of my website as done (in terms of content) and tomorrow I want to focus on implementing histograms to compare data on the last page (I need to edit this in my design document; will try to do that tomorrow as well). Lastly, I need to complete the styling of my website.

###day 12: 19 January

Today, I implemented a cumulative line chart - instead of a histogram. I think this communicates the data better in the end than the histogram I planned to build first, as I can now display trends for both data types (and for the two datasets combined). I used the C3 library for this (which builds on top of D3) which made it a lot easier to implement an interactive multiple line graph from the arrays I had - which seemed very tricky to do using pure D3. I also implemented a bar chart so that the entire page now allows the user to explore the data per _date_. So, the home page is now for exploring data per _district_, and this page is for exploring data over _time_.

Something I still want to do is implementing the _tooltip_ on the second bar chart (doesn't work correctly yet) and _styling_.


###day 13 and 14: 20/21 January

I spent the past two days on styling my website. I looked into different fonts, colours and the general layout of the website and I am quite happy with the results. I also implemented nice transitions for the bar charts which makes them look quite smooth now! Something that is unfortunately still not working is the tooltip that is implemented on the line & bar chart page. The line chart uses C3 and it seems like D3 and C3 code interfere with each other. I'm not sure how to fix that yet but I'll hopefully figure it out.