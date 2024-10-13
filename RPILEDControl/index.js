const { execSync } = require('child_process');
const { Server } = require('ws');
const express = require('express');
const get = require('node-fetch');
const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config.json', 'utf-8'));
config.map(light => light.time = Date.now());

const cache = {
    cam1lvl: 0,
    cam2lvl: 0
}

function all(cfg, state, init) {
    for (const light of cfg) {
        light.time = [0, 1].includes(state) ? Date.now() : light.time;
        light.state = [0, 1].includes(state) ? state : light.state;
        !init && [0, 1].includes(state) ? execSync(`sudo pinctrl ${light.gpio} op ${light.state ? 'dh' : 'dl'}`) : void 0;
    }
    return cfg;
}

new Server({ port: 2000 }).on('connection', ws => {
    ws.on('message', message => {
        message = JSON.parse(message);
        if (!message.gpio) ws.send(JSON.stringify({ event: 'all', data: all(config, message.state) }))
        else {
            const light = config.find(light => light.gpio === message.gpio);
            light.state = message.state;
            light.time = Date.now();
            execSync(`sudo pinctrl ${light.gpio} op ${light.state ? 'dh' : 'dl'}`);
            ws.send(JSON.stringify({ event: 'update', state: message.state, data: light }))
        }
    })
    ws.send(JSON.stringify({ event: 'load', data: all(config, void 0, true) }))
})

express()
    .use(express.static('public'))
    .get('/status', (_, res) => res.send(all(config, void 0)))
    .get('/start/:id', (req, res) => {
        if (+req.params.id === 1) {
            execSync(`sudo pinctrl ${config[10].gpio} op dh`);
        } else {
            execSync(`sudo pinctrl ${config[11].gpio} op dh`);
        }
        res.send('OK');
    })
    .get('/set/:id/:level', (req, res) => {
        const id = +req.params.id;
        const level = +req.params.level;

        if (![1, 2].includes(id) || level < 0 || level > 5) return res.send('Invalid request');

        if (id === 1) {
            execSync(`sudo pinctrl ${config[10].gpio} op dh`);

            [0, 2, 4, 6, 8].map(i => {
                config[i].state = 0;
                execSync(`sudo pinctrl ${config[i].gpio} op ${config[i].state ? 'dh' : 'dl'}`);
            });

            if (level === 5) {
                [0, 2, 4, 6, 8].map(i => {
                    config[i].state = 1;
                });
            } else if (level === 4) {
                [2, 4, 6, 8].map(i => {
                    config[i].state = 1;
                });
            } else if (level === 3) {
                [4, 6, 8].map(i => {
                    config[i].state = 1;
                });
            } else if (level === 2) {
                [6, 8].map(i => {
                    config[i].state = 1;
                });
            } else if (level === 1) {
                config[8].state = 1;
            }

            [0, 2, 4, 6, 8].map(i => {
                execSync(`sudo pinctrl ${config[i].gpio} op ${config[i].state ? 'dh' : 'dl'}`);
            });

        } else {
            execSync(`sudo pinctrl ${config[11].gpio} op dh`);

            [1, 3, 5, 7, 9].map(i => {
                config[i].state = 0;
                execSync(`sudo pinctrl ${config[i].gpio} op ${config[i].state ? 'dh' : 'dl'}`);
            });

            if (level === 5) {
                [1, 3, 5, 7, 9].map(i => {
                    config[i].state = 1;
                });
            } else if (level === 4) {
                [3, 5, 7, 9].map(i => {
                    config[i].state = 1;
                });
            } else if (level === 3) {
                [5, 7, 9].map(i => {
                    config[i].state = 1;
                });
            } else if (level === 2) {
                [7, 9].map(i => {
                    config[i].state = 1;
                });
            } else if (level === 1) {
                config[9].state = 1;
            }

            [1, 3, 5, 7, 9].map(i => {
                execSync(`sudo pinctrl ${config[i].gpio} op ${config[i].state ? 'dh' : 'dl'}`);
            });

        }

        if (id === 1 && cache.cam1lvl !== level) {
            console.log('Set level', level, 'for cam', id, 'sending to', `http://192.168.124.69:1123/start/1/${level}`);
            get(`http://192.168.124.69:1123/start/1/${level}`)
            cache.cam1lvl = level;
        }

        if (id === 2 && cache.cam2lvl !== level) {
            console.log('Set level', level, 'for cam', id, 'sending to', `http://192.168.124.69:1123/start/1/${level}`);
            get(`http://192.168.124.69:1123/start/2/${level}`)
            cache.cam2lvl = level;
        }

        res.send('OK');
    })
    .listen(1123)
