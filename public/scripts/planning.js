 document.addEventListener("DOMContentLoaded", function(event) {
        var rawData;
        var nestedData;
        var currentDate = new Date(2017, 3);

        var formatDay = d3.timeFormat("%Y-%m-%d"),
            formatWeek = d3.timeFormat("%W"),       // Monday-based week of the year as a decimal number [00,53].
            formatMonth = d3.timeFormat("%m"),          // month as a decimal number [01,12].
            formatShortMonthName = d3.timeFormat("%b"), // abbreviated month name.
            formatDayMonth = d3.timeFormat("%e"),       // space-padded day of the month as a decimal number [ 1,31]; equivalent to %_d.
            formatMonthName = d3.timeFormat("%B"),      // full month name.
            formatYear = d3.timeFormat("%Y"),           // year with century as a decimal number.
            formatYearMonth = d3.timeFormat("%Y-%m"),
            formatMonthNameYear = d3.timeFormat("%B %Y");

        function draw(data) {
            "use strict";

            var dateStart = new Date(data[0].date);
            var dateEnd = new Date(data[data.length -1].date);

            data = data.map(function(entry){
                return { "date" :new Date (entry.date), "type": entry.type };
            })
            rawData = data;
          
            nestedData = d3.nest()
            .key(function(d) { return formatYearMonth(d.date);  })
            .key(function(d) { return formatWeek(d.date);  })
            .entries(data);

            //console.log(nestedData)
            //console.log(calendarData)
            var navItem = d3.select(".timeline")
                .append("ul")
                .selectAll("li")
                .data(nestedData)
                .enter()
                    .append("li")
                    .attr("class", function(d){ return "ym" + d.key; });
            navItem        
                .append("span")
                .attr("class", function(d,i){ return (i == 0 || d.key.substr(5,2) == "01") ? "year": "year hidden"; })
                .text(function(d){ return d.key.substr(0,4); });
                    
            navItem
                .append("span")
                .attr("class", "month")
                .text(function(d){ return formatShortMonthName(new Date(d.key)); });

            navItem
                .on("click", function(d,i){
                    var saveTheDate =  d.values[0].values[0].date
                    showCalendar(saveTheDate, null);
                    
                })


            var calendarItem = d3.select(".calendars")
                .selectAll("section")
                .data(nestedData)
                .enter()
                    .append("section")
                    .attr("class", function(d, i){ "monthDetail ym" + d.key ; })
                    .attr("id", function(d, i){ return "ym" + d.key; });


            calendarItem
                .append("h1")
                .text(function(d){ return formatMonthNameYear(d.values[0].values[0].date); });

            calendarItem
                .append("div")
                .attr("class", "rows")
                .selectAll(".row")
                .data(function(d){ return d.values; })
                .enter()
                    .append("div")
                    .attr("class", function(d,i){ return (i == 0) ? "row first-row" : "row"; })
                    .selectAll(".day")
                    .data(function(d){ return d.values; })
                    .enter()
                        .append("div")
                        .attr("class", function(d){ return  (formatDay(d.date) === formatDay(new Date()) ) ? "day today " + d.type : "day " + d.type; })
                        .text(function(d){ return formatDayMonth(d.date); })
            
            if(document.requestedDate && document.requestedDate.length==7){
                var year = Number(document.requestedDate.substr(0,4))
                var month = Number(document.requestedDate.substr(5,2))-1
                showCalendar(new Date(year, month))
            }else{
                showCalendar()
            }
                
        }

        function showCalendar(reqDate, direction){

            var dateStart = new Date(rawData[0].date);
            var dateEnd = new Date(rawData[rawData.length -1].date);
            var dateNow = new Date();
            //
            var requestedDate ;
            if (reqDate){
                requestedDate = reqDate;

            }else if(direction === "previous" || direction === "next"){
                requestedDate = currentDate;
                var increment = (direction === "previous") ? -1 : 1;
                requestedDate.setMonth(requestedDate.getMonth() + increment);
            }else{
                requestedDate = dateNow;
            }
            if(! (requestedDate >= dateStart && requestedDate <= dateEnd)) requestedDate = dateStart;
            //
            //console.log(requestedDate);
            var requestedFormatted = formatYearMonth(requestedDate);
            d3.selectAll("section:not(#ym"+ requestedFormatted + ")").classed("hidden", true);
            d3.select("section#ym"+ requestedFormatted + "").classed("hidden", false);

            d3.selectAll("header li:not(.ym"+ requestedFormatted + ")").classed("active", false);
            d3.select("header li.ym"+ requestedFormatted + "").classed("active", true);
            currentDate = requestedDate;

            window.history.pushState({}, formatMonthNameYear(requestedDate), "/" + formatYearMonth(requestedDate));
        }

        
        //previous and next button
        var previousButton = document.getElementById('previous');
        var nextButton = document.getElementById('next');

        previousButton.addEventListener('click', function() {
            showCalendar(null, "previous");
        }, false);
        nextButton.addEventListener('click', function() {
            showCalendar(null, "next");
        }, false);

        // calls the draw function once the data is loaded
        d3.json('/data/planning.json', draw);
});