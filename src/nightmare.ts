let Nightmare = require('nightmare');


let defaultOptions = {
    show: true, x: 1024, y:0, width: 640,
    openDevTools: { mode: ''}
};
export function getNightmare() {
    let nightmare = Nightmare( defaultOptions );
    return nightmare;
}


