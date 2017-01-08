from datetime import date
import json
import pandas as pd


start_date = date(2017,4,1)
end_date = date(2020,3,31)

daterange = pd.date_range(start_date, end_date)

dateArray = []


for single_date in daterange:
    newDate = { "date" : single_date.strftime("%Y-%m-%d")  }
    weekDay = int(single_date.strftime("%w"))
    weekNumber = int(single_date.strftime("%W"))
    if  weekDay == 1 or weekDay == 2: # monday - tuesday
    	newDate["type"] = "IL"
    elif weekDay == 4 or weekDay == 5: # thursday - friday
    	newDate["type"] = "LO"
    elif weekDay == 6 or weekDay == 0: # saturday - sunday
    	newDate["type"] = "WE"
    else :
    	if weekNumber % 2 == 0 :
    		newDate["type"] = "IL"
    	else :
	    	newDate["type"] = "LO"

    dateArray.append(newDate)


content = json.dumps(dateArray, indent=4, separators=(',', ': '));

jsonFile = open("planning.json", "w")
jsonFile.write(content)
jsonFile.close()