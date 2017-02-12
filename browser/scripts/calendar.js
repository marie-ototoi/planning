const d3 = require('d3'),
    timeformat = require('d3-time-format')

const formatDay = d3.timeFormat("%Y-%m-%d"),
    formatWeek = d3.timeFormat("%W"),       // Monday-based week of the year as a decimal number [00,53].
    formatMonth = d3.timeFormat("%m"),          // month as a decimal number [01,12].
    formatShortMonthName = d3.timeFormat("%b"), // abbreviated month name.
    formatDayMonth = d3.timeFormat("%e"),       // space-padded day of the month as a decimal number [ 1,31]; equivalent to %_d.
    formatMonthName = d3.timeFormat("%B"),      // full month name.
    formatYear = d3.timeFormat("%Y"),           // year with century as a decimal number.
    formatYearMonth = d3.timeFormat("%Y-%m"),    
    formatMonthNameYear = d3.timeFormat("%B %Y");


let dateStart,
dateEnd, 
dateNow,
rawData,
newData,
nestedData,
currentDate


const initAndLoad = function initAndLoad(data, requestedDate){
    init(data)
    draw()
    if(requestedDate && requestedDate.length==7){
        let year = Number(requestedDate.substr(0,4))
        let month = Number(requestedDate.substr(5,2))-1
        showCalendar(requestCalendar(new Date(year, month)))

    }else{
        showCalendar(requestCalendar())
    }
}

//if(document.data){
const init = function init(data){
         
    dateStart = new Date(data[0].date);
    dateEnd = new Date(data[data.length -1].date);
    dateNow = new Date()
    currentDate = dateStart

    rawData = data
    newData = data.map(function(entry){
        return { "date" :new Date (entry.date), "type": entry.type }
    })

    nestedData = d3.nest()
        .key(function(d) { return formatYearMonth(d.date) })
        .key(function(d) { return formatWeek(d.date) })
        .entries(newData)
    
    return { dateStart, dateEnd, dateNow, rawData, newData, nestedData }

    
    /*draw(data)
    if(requestedDate && requestedDate.length==7){
        let year = Number(requestedDate.substr(0,4))
        let month = Number(requestedDate.substr(5,2))-1
        showCalendar(new Date(year, month))

    }else{
        showCalendar()
    }*/
}


const draw = function draw() {

        let navItem = d3.select(".timeline")
            .append("ul")
            .attr("class", "timeline__list")
            .selectAll("li")
            .data(nestedData)
            .enter()
                .append("li")
                .attr("class", function(d){ return "timeline__item ym" + d.key })
        navItem        
            .append("span")
            .attr("class", function(d,i){ return (i == 0 || d.key.substr(5,2) == "01") ? "timeline__year": "timeline__year hidden" })
            .text(function(d){ return d.key.substr(0,4) })
                
        navItem
            .append("span")
            .attr("class", "timeline__month")
            .text(function(d){ return formatShortMonthName(new Date(d.key)) })

        navItem
            .on("click", function(d,i){
                let saveTheDate =  d.values[0].values[0].date
                showCalendar(requestCalendar(saveTheDate, null))
            })


        let calendarItem = d3.select(".calendar__list")
            .selectAll("section")
            .data(nestedData)
            .enter()
                .append("section")
                .attr("class", function(d, i){ "monthDetail ym" + d.key })
                .attr("id", function(d, i){ return "ym" + d.key; })

        calendarItem
            .append("h1")
            .text(function(d){ return formatMonthNameYear(d.values[0].values[0].date) })

        let calendarRow = calendarItem
            .append("div")
            .attr("class", "calendar__rows")
            .selectAll(".calendar__row")
            .data(function(d){ return d.values })
            .enter()
                .append("div")
                .attr("class", function(d,i){ return (i == 0) ? "calendar__row calendar__row_first" : "calendar__row"; })
                
        let calendarDay = calendarRow
            .selectAll(".calendar__day")
            .data(function(d){ return d.values; })
            .enter()
                .append("div")
                .attr("class", function(d){ return  (formatDay(d.date) === formatDay(new Date()) ) ? "calendar__day calendar__day_today " + d.type : "calendar__day " + d.type; })

        calendarDay
            .append("div")            
            .attr("class", 'calendar__daynumber')   
            .text(function(d){ return formatDayMonth(d.date) })     

     
}


const requestCalendar = function requestCalendar(reqDate, direction){
    //
    let requestedDate

    if (reqDate){
        requestedDate = reqDate

    }else if(direction === "previous" || direction === "next"){
        requestedDate = currentDate
        
        // check if there's a next or prev month in the data before
        if(!(formatYearMonth(currentDate) === formatYearMonth(new Date(rawData[0].date))&&  (direction === "previous")) &&
           !(formatYearMonth(currentDate) === formatYearMonth(new Date(rawData[rawData.length-1].date))&&  (direction === "next")) ){
            let increment = (direction === "previous") ? -1 : 1
            requestedDate.setMonth(requestedDate.getMonth() + increment)
        }

    }else{
        requestedDate = dateNow
    }

    if(! (requestedDate >= dateStart && requestedDate <= dateEnd)) requestedDate = dateStart
    if(currentDate !== requestedDate){
        currentDate = requestedDate
    }
    return currentDate;
}

const showCalendar = function showCalendar(requestedDate){
    //
    let requestedFormatted = formatYearMonth(requestedDate)
    d3.selectAll("section:not(#ym"+ requestedFormatted + ")").classed("hidden", true);
    d3.select("section#ym"+ requestedFormatted + "").classed("hidden", false)

    d3.selectAll("header li:not(.ym"+ requestedFormatted + ")").classed("active", false)
    d3.select("header li.ym"+ requestedFormatted + "").classed("active", true)
    
    
    window.history.pushState({}, formatMonthNameYear(requestedDate), "/" + formatYearMonth(requestedDate))
    
}

        
//previous and next button
d3.select('.calendar__previous').on('click', function() {
        showCalendar(requestCalendar(null, "previous"))
    }, false)
d3.select('.calendar__next').on('click', function() {
        showCalendar(requestCalendar(null, "next"))
    }, false)

module.exports = initAndLoad
module.exports.init = init
module.exports.draw = draw
module.exports.requestCalendar = requestCalendar
module.exports.showCalendar = showCalendar