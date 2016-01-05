#Process Book

###day 2: 5 January

Today I focused on building a _prototype_. I found JSON-files that contain the Nepali districts. I built the HTML framework (including a dropdown menu for selecting data sources and a slider to select a date range) and I also set up a basic d3 map. The map now shows up (yay!) with all the districts, so now I'll have to add data to it. Data collection is a bit more involved (I'm building my own dataset so I can't just scrape something) and something that will be a work in progress, but I should be able to finish that by the end of this week. 

I also did some work on the _design document_. I'm not sure if it's more or less done or if I need to be much more detailed (especially on the functions/return types I want to implement) so this is something I will ask tomorrow. I also still need to include a few sketches.

Based on my thoughts/ideas today, I have chosen to change the way I _display data_. I realised that many, many datapoints will have the same geolocation, and placing these on top of each other as points (as I planned to do first) will not look very pretty. Many data points are e.g. linked to the capital of a district, while they are actually valid for the district as a whole; mapping them on the district only would therefore give a misleading representation of the situation. Instead I now want to make a measure for the 'data density' of the district as a whole. So, when there is more data for a district, that should be visible (e.g. it should become darker). I updated this in my proposal. 

For _tomorrow_, I want to finish the prototype. I want the districts to be clickable (and record somewhere that they are being clicked on) and I want to be able to give them different colors. Perhaps I can do some styling (of headers/fonts etcetera). As mentioned above, I want to ask for help about the design document to see what more I need to add there. For the rest I will be working on compiling my dataset further. 
