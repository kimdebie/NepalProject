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
