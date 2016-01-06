#Design Document
####Last edited: 6 January 2016
*NB: This version is not complete yet!*

To recap: I aim to visualize conventional and crowdsourced data as collected after the earthquake in Nepal on 25 April 2015. My visualization will consist of two main parts (possibly a third):

###Map of Nepal's districts

The first element will be a map of Nepal with its 75 districts. This map will display data density for each district. I plan to measure data density in terms of numbers of reports collected *up to a certain point in time*. Reports usually remain 'valid' for the entire period (if a village is damaged now, it will be so tomorrow) and as such data per district will accumulate over time. This element will also include a drop-down menu to select either or both data source(s). Moreover, a time slider allows the user to select a point in time up to which she wants to view the reports. 

* **Data** will come from three sources: TopoJSON data for the districts, and two csv-files for the conventional and crowdsourced data (datasets I am creating myself). The datasets will be loaded using D3.js. These datasets will have to be linked together, so that each district is linked to a list(?) of reports. 

* With the **drop-down menu**, users can select a database (or select both databases). The database selected will be recorded. The **slide bar** can be used to select a date up to which point the user wants the reports to be included. This starts the following process:
    * The data will be loaded.
    * The number of reports per district (up to the selected date) will be counted - (length of district-array/list(?) is checked).
    * The number of reports per district will be linked to a color.
    * The district will be given that color. 

* Clicking on a **district** will manipulate the bar chart as described below. I should therefore record these clicks (onClick).  

![]doc/designdoc1.png

###Bar chart with data per category.

The second element of the visualization is a bar chart that says something about the *qualitative aspects* of the data. The emergency reports are saved into multiple categories; the bar chart expresses which categories the data points belong to. This allows the user to understand about what topics information is known at a certain point in time, rather than just a crude number. The bar chart initially displays data for all districts together, but clicking on a district will show data for one district only. 

* **Data** comes from the same sources as above (except the TopoJSON which is not required here). 
* Clicking on a district starts the following process:
    * The district that is clicked on will be stored.
    * The rows for this district are filtered out.
    * Separate lists(?) for each category are created (twice: once for conventional and once for the crowdsourced data) and their length is checked.
    * The bar chart is created on the basis of this data. Two bars for each category: one for conventional and crowdsourced data.

![]doc/designdoc2.png

###Feature to check individual reports (optional).

The last element should allow the user to explore individual reports for more in-depth research. (I haven't put too much thought into this yet and it is the last element I would implement if I have the time). Only the data that was *added* on the selected day (selected with the slide bar on the map) will be included in this element. 

* Again, **data** comes from the two csv files.
* Selecting a day would then lead to the following sequence of events:
    * Check if a district has already been selected, if so, this becomes the second filter.
    * Filter for date and district (if applicable). 
    * Each report will be represented by a coloured dot (using D3). 
    * Hovering over a dot displays reports for that dot. 

![]doc/designdoc3.png

###Minimum Viable Product

The main task of my visualization is to increase understanding of the differences between crowdsourced and conventional data in the emergency response. I will be focusing on the aspect of data density/quantity: how *much* data is actually provided by either of these sources? This aspect is mainly conveyed by the first element of my visualization, namely the map. As such, to deliver a product that is minimally viable, i.e. that fulfills the task of my product in the most minimal way possible, I will have to get the map working first. Once I have my MVP (so the map) working, I can start focusing on other tasks. 

An additional task is to allow the user to explore the *nature* of the data (i.e., moving from a quantitative focus to a qualitative research). This is facilitated by the second and third elements of my visualization. In the end, this is the ultimate goal for my visualization, but the focus should first be on the map. 

### Optional extra features

* Expressing data density in terms of number of reports per district is somewhat limiting: not every report may have the same 'weight'. If I have the time, I could develop a measure for data density that incorporates the weight/size of a report. For example, a report that one person broke his arm (e.g.) should probably get a smaller weight than a report that an entire village needs shelter. This would take quite a bit of time though as I would have to hand-code each report. 

* It would be nice to have a 'play' button that plays the reports from start to finish. 

* I could include a text block that describes the general events on a selected day to provide some context (earthquake first happens, major aftershock, 5000 deaths mark passed...). 