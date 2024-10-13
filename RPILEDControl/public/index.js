const [$, $$, { style }] = [(query, parent) => (parent || document).querySelector(query), (query, parent) => (parent || document).querySelectorAll(query), document.documentElement];
const [socket, svg] = [new WebSocket('ws://192.168.124.47:2000'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 986.67 1399.48"><path light d="M1259,1264.26h-35.48v-400c0-110.46-89.54-200-200-200h0c-110.46,0-200,89.54-200,200v400H789a40,40,0,0,0-40,40h0a40,40,0,0,0,40,40h470a40,40,0,0,0,40-40h0A40,40,0,0,0,1259,1264.26Z" transform="translate(-520.66 -324.26)"/><path frame d="M1259,1239.26h-10.48v-375a225,225,0,1,0-450,0v375H789a65,65,0,0,0,0,130h99.52v329.48a25,25,0,1,0,50,0V1369.26h170V1592.9a25,25,0,0,0,50,0V1369.26H1259a65,65,0,0,0,0-130Zm-410.48-375c0-96.5,78.5-175,175-175s175,78.5,175,175v375h-350Zm410.48,455H789a15,15,0,0,1,0-30h470a15,15,0,0,1,0,30Z" transform="translate(-520.66 -324.26)"/><path glow d="M1024,324.26h0a25,25,0,0,0-25,25v200a25,25,0,0,0,25,25h0a25,25,0,0,0,25-25v-200a25,25,0,0,0-25-25Z" transform="translate(-520.66 -324.26)"/><path glow d="M665.61,460.87h0a25,25,0,0,0,0,35.36L807,637.65a25,25,0,0,0,35.36,0h0a25,25,0,0,0,0-35.36L701,460.87a25,25,0,0,0-35.36,0Z" transform="translate(-520.66 -324.26)"/><path glow d="M1382.39,460.87h0a25,25,0,0,0-35.36,0L1205.61,602.29a25,25,0,0,0,0,35.36h0a25,25,0,0,0,35.36,0l141.42-141.42a25,25,0,0,0,0-35.36Z" transform="translate(-520.66 -324.26)"/> <rect disabled x="397.33" y="1009" width="1233.34" height="50" rx="25" transform="translate(-954.82 695.6) rotate(-45)"/><path overlay d="M1432.37,590.63a25,25,0,0,1,17.68,42.68L613.31,1470.05A25,25,0,0,1,578,1434.69L1414.69,598a24.94,24.94,0,0,1,17.68-7.32m0-50a74.53,74.53,0,0,0-53,22L542.59,1399.34a75,75,0,0,0,106.07,106.07l836.75-836.75a75,75,0,0,0-53-128Z" transform="translate(-520.66 -324.26)"/></svg>'];

// Connection opened
socket.addEventListener('open', (event) => $('[preload]').classList.add('hide'));

window.onload = _ => {
    setTimeout(_ => {
        if (!$('[preload]').classList.contains('hide')) {
            $('[preload] p b').innerHTML = 'Connection timed out.';
            $('[preload] p b').style.color = 'var(--red)';
        }
    }, 1000 * 10)
    setInterval(_ => {
        for (const div of $$('div[time]')) {
            const time = +div.getAttribute('time');
            div.innerHTML = time !== 0 ? timeify(Date.now() - time) : '';
        }
    }, 500)
}

$('[on]').onclick = _ => socket.send(JSON.stringify({ state: 1 }));
$('[off]').onclick = _ => socket.send(JSON.stringify({ state: 0 }));

// Listen for messages
socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    switch (message.event) {
        case 'load': {
            for (const light of message.data) {
                const div = document.createElement('div');
                div.id = `GPIO${light.gpio}`;
                light.state === 1 && div.classList.add(light.type);
                div.innerHTML = `<h2>${light.name}</h2>${svg}<p></p><div time="${light.time}"></div>`;
                $('section').appendChild(div);
                div.onclick = _ => {
                    div.classList.add('hide');
                    if (['red', 'green', 'yellow', 'blue', 'white'].includes(div.classList.toString().split(' ').shift())) socket.send(JSON.stringify({ gpio: +div.id.slice(4), state: 0 }));
                    else socket.send(JSON.stringify({ gpio: +div.id.slice(4), state: 1 }));
                }
            }
            break;
        }

        case 'all': {
            for (const light of message.data) {
                const div = $(`#GPIO${light.gpio}`);
                if (light.state === 1) !div.classList.contains(light.type) && div.classList.add(light.type);
                else div.classList.remove(light.type);
                div.classList.remove('hide');
                $('div[time]', div).setAttribute('time', light.time);
            }
            break;
        }

        case 'update': {
            const div = $(`#GPIO${message.data.gpio}`);
            div.classList[message.state === 1 ? 'add' : 'remove'](message.data.type);
            div.classList.remove('hide');
            $('div[time]', div).setAttribute('time', message.data.time);
            break;
        }
    }
})

function timeify(ms, short) {
    if (typeof ms === 'string') return ms;
    let sec = +(ms / 1000).toFixed(0);
    let min = Math.floor(sec / 60);
    let hrs = min > 59 ? Math.floor(min / 60) : 0;
    min -= hrs * 60;
    sec = Math.floor(sec % 60);

    const result = [];
    hrs ? result.push(`${hrs.toLocaleString()} ${short ? 'hr' : 'hour'}${hrs === 1 ? '' : 's'}`) : void 0;
    min ? result.push(`${min} ${short ? 'min' : 'minute'}${min === 1 ? '' : 's'}`) : void 0;
    sec ? result.push(`${(min || hrs) ? 'and ' : ''} ${sec} ${short ? 'sec' : 'second'}${sec === 1 ? '' : 's'}`.trim()) : void 0;

    return result.length ? result.shift() : (short ? '0 secs' : '0 seconds');
};
