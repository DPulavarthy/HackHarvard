const fetch = require('node-fetch');
const express = require('express');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 1123;
const API_KEY = process.env.API_KEY;
app.use(cors());

const lat = [42.373611, 42.371654, 42.369262, 42.366978, 42.372862, 42.369561, 42.373056, 42.375099, 42.377003, 42.378297]
const log = [-71.109733, -71.113823, -71.114005, -71.105488, -71.108658, -71.106216, -71.116757, -71.105615, -71.115906, -71.120493]
const loc = ["Harvard Yard, Harvard University", "Harvard Square, Cambridge", "Harvard Art Museums, Cambridge", "Harvard Business School", "Memorial Hall, Harvard University", "Harvard Kennedy School", "Cambridge Common Park", "Science Center Plaza, Cambridge", "John F. Kennedy Park, Cambridge", "Charles River near Eliot Bridge"]
let fill = [5, 3, 2, 4, 1, 0, 5, 3, 4, 2] // level: 0 = 0%, 1 = 20%, 2 = 40%, 3 = 60%, 4 = 80%, 5 = 100%
const daysLastPicked = [1, 2, 3, 4, 7, 5, 1, 3, 2, 6]

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createDurationMatrix() {
    const matrix = [];

    for (let i = 0; i < lat.length; i++) {
        const adj = [];
        const promises = [];

        for (let j = 0; j < log.length; j++) {
            const origin = `${lat[i]},${log[i]}`;
            const destination = `${lat[j]},${log[j]}`;
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${API_KEY}`;

            promises.push(
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        if (data.rows.length > 0 && data.rows[0].elements.length > 0) {
                            const element = data.rows[0].elements[0];
                            return element.duration.text;
                        } else {
                            return 'N/A';
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching duration:', error);
                        return 'Error';
                    })
            );
        }

        const row = await Promise.all(promises);
        matrix.push(row);
}

    return matrix;
}

function createGarbageCansData(id, latitude, longitude, location, fill_level, durations, days_since_last_filled) {
    return {
        id: id,
        latitude: latitude,
        longitude: longitude,
        location: location,
        fill_level: fill_level,
        durations: durations,
        days_since_last_picked: days_since_last_filled
    };
}

async function start(id, level) {
    console.log(id, level);
    fill[id - 1] = level;
    const durations = await createDurationMatrix();

    // console.log("Durations Matrix:", durations);

    const garbageCansData = [];

    for (let i = 0; i < 10; i++) {
        const garbageCan = createGarbageCansData(
            i + 1, 
            lat[i],
            log[i],
            loc[i],
            fill[i],
            durations[i],
            daysLastPicked[i]
        );
        garbageCansData.push(garbageCan);
    }

    const jsonData = JSON.stringify(garbageCansData, null, 2);
    fs.writeFileSync('garbageCansData.json', jsonData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File has been saved.');
        }
    });
};
app.get('/trashData', (req, res) => {
    fs.readFile('garbageCansData.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading the file.");
        }
        res.send(data);
    });
});
app.get('/routeData', (req, res) => {
    fs.readFile('orderedGarbageCansData.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading the file.");
        }
        res.send(data);
    });
});
app.get(`/start/:id/:level`, (req, res) => {
    // console.log(req);
    start(+req.params.id, +req.params.level);
    res.send("Data has been formatted and saved to the file.");
}).listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});







    
