const API_KEY = "AIzaSyA9wdextBbNhCbxfZ5qpObUUe9qX7Kcl2o&";

function createGarbageCansData(id, latitude, longitude, location, fill_level, traffic_hour, days_since_last_filled) {
    return {
        id: id,
        latitude: latitude,
        longitude: longitude,
        location: location,
        fill_level: fill_level,
        traffic_hour: traffic_hour,
        days_since_last_filled: days_since_last_filled
    }
}



const lat = [42.373611, 42.371654, 42.369262, 42.366978, 42.372862, 42.369561, 42.373056, 42.375099, 42.377003, 42.378297]
const log = [-71.109733, -71.113823, -71.114005, -71.105488, -71.108658, -71.106216, -71.116757, -71.105615, -71.115906, -71.120493]
const loc = ["Harvard Yard, Harvard University", "Harvard Square, Cambridge", "Harvard Art Museums, Cambridge", "Harvard Business School", "Memorial Hall, Harvard University", "Harvard Kennedy School", "Cambridge Common Park", "Science Center Plaza, Cambridge", "John F. Kennedy Park, Cambridge", "Charles River near Eliot Bridge"]
const fill = [5, 2, 3, 4, 1, 0, 5, 4, 3, 2] // level: 0 = 0%, 1 = 20%, 2 = 40%, 3 = 60%, 4 = 80%, 5 = 100%
const daysLastPicked = [3, 1, 2, 5, 4, 1, 7, 2, 3, 4]

async function getData() {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?departure_time=now&destinations=Lexington%2CMA%7CConcord%2CMA&origins=Boston%2CMA%7CCharlestown%2CMA&key=${API_KEY}`

    try {
        const res = await fetch(url);
        if(!res.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }   
}

getData();


